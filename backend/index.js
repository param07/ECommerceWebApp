const express = require("express")
const session = require('express-session')
const app = express()
const cors = require('cors')
const db = require('./db.js')
const path = require('path')
const cookieParser = require('cookie-parser')

// console.log(path.resolve())
const currPath = path.resolve()
// const imagePath1 = path.join(currPath, '..', 'Assets', 'example.jpg');
// console.log(imagePath1)



// Port Number Setup 
const PORT = process.env.port || 8000

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json()) // access to request.body so that we can get json data
app.use(cookieParser("secret"))
app.use(session({
	secret: "hashValue",
	saveUninitialized: false, // not want to save unmodified data to the session store
	resave: false,
}))

app.use((_, res, next) => {
    // res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
// const staticAssetsPath = path.join('ECommerceWebApp', 'Assets')
// const staticAssetsPath = path.join(__dirname, 'ECommerceWebApp', 'Assets');

// app.use(express.static(staticAssetsPath));

function setAllProducts(result){
	let allProducts = []
	if(result && result.rows && result.rows.length > 0){
		for (let i = 0; i < result.rows.length; i++){
			allProducts.push({
				id: result.rows[i].id,
				name: result.rows[i].name,
				category: result.rows[i].category_name,
				image: result.rows[i].image_relative_url,
				new_price: result.rows[i].price - result.rows[i].discount,
				old_price: Number(result.rows[i].price),
				currencySign: result.rows[i].currency_symbol,
				curr_stock: result.rows[i].stock_quantity
			})
		}
	}
	return allProducts;
}

async function getAllProducts(){
	try{
		const result = await db.pool.query('SELECT pr.*, cat.name AS category_name, curr.symbol AS currency_symbol FROM product pr, category cat, currency curr WHERE pr.category_id = cat.id AND pr.currency_id = curr.id AND pr.stock_quantity > 0;');

		// let allProducts = setAllProducts(result)
		// for (let i = 0; i < result.rows.length; i++){
		// 	allProducts.push({
		// 		id: result.rows[i].id,
		// 		name: result.rows[i].name,
		// 		category: result.rows[i].category_name,
		// 		image: result.rows[i].image_relative_url,
		// 		new_price: result.rows[i].price - result.rows[i].discount,
		// 		old_price: Number(result.rows[i].price),
		// 		currencySign: result.rows[i].currency_symbol,
		// 		curr_stock: result.rows[i].stock_quantity
		// 	})
		// }
		return setAllProducts(result);
	} catch(error){
		throw error
	}
}

async function getCartDetails(cart_id, allProducts){
	let cart = {}
	for (let i = 0; i < allProducts.length; i++) {
		cart[allProducts[i].id] = 0
	}
	
	try{
		const result = await db.pool.query('select product_id, quantity from cartDetails where cart_id = $1', [cart_id])
		for (let i = 0; i < result.rows.length; i++){
			cart[result.rows[i].product_id] = result.rows[i].quantity
		}
		return cart;
	}catch(error){
		throw error
	}

	
}

app.get("/", async (req, res) => {
	// console.log(req.session)
	// console.log(req.sessionID)
	try{
		req.session.visited = true;
		let cart = {}
		// console.log(req.signedCookies.sessionID)
		// console.log(req.sessionID)
		// if(req.signedCookies.sessionID && req.signedCookies.sessionID === req.sessionID){
		const allAvailProducts = await getAllProducts()
		console.log(req.sessionID)
		console.log(req.signedCookies.sessionValidateID)
		if(req.signedCookies.sessionValidateID && req.signedCookies.sessionValidateID === req.sessionID){
			// console.log(req.signedCookies.sessionValidateID)
			console.log("IOld user")
			// // console.log(req.signedCookies.sessionPrimaryID)
			// const result = await db.pool.query('select id from cart where session_id = $1', [req.signedCookies.sessionPrimaryID])
			// // console.log(result)
			// if(result.rows && result.rows.length > 0){
			// 	cart = await getCartDetails(result.rows[0].id, allAvailProducts)
			// }
			// await getCartDetailsForSession()
		} else{
			console.log("New user")
			const result = await db.pool.query('INSERT INTO session_details (token) VALUES ($1) RETURNING id', [req.sessionID]);
			const newId = result.rows[0].id;
			res.cookie("sessionValidateID", req.sessionID, {signed: true})
			res.cookie("sessionPrimaryID", newId, {signed: true})
		}
		// return res.status(201).json({msg: "Hello"})
		return res.status(200).json({allProducts: allAvailProducts, cart_details: cart});
	} catch (error){
		return res.status(500).json({ error: error.message });
	}
	
})

// getting all products from product table
app.get("/allproducts", async function (req, res) {
	// console.log(req.signedCookies.sessionID === req.sessionID)
	// console.log(req.session)
	// console.log(req.sessionID)
	try {
		const allAvailProducts = await getAllProducts()
		// const result = await db.pool.query('select * from product where stock_quantity > 0');
		return res.status(200).json({allProducts: allAvailProducts});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
})



// search products based on product name
app.get("/searchproducts", async function (req, res) {
	try {
		// const allAvailProducts = await getAllProducts()
		const result = await db.pool.query('SELECT pr.*, cat.name AS category_name, curr.symbol AS currency_symbol FROM product pr, category cat, currency curr WHERE pr.category_id = cat.id AND pr.currency_id = curr.id AND pr.stock_quantity > 0 AND LOWER(pr.name) LIKE $1', [`%${req.query.name.toLowerCase()}%`]);
		// const result = await db.pool.query('select * from product where LOWER(name) LIKE $1', [`%${req.query.name.toLowerCase()}%`]);
		return res.status(200).json({allProducts: setAllProducts(result)});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	} 
})

app.post("/addtocart", async function (req, res) {
	try {
		const product_id = 2 // get from request
		const session_id = req.signedCookies.sessionPrimaryID
		console.log(session_id)
		const result = await db.pool.query('select * from cart where session_id = $1', [session_id]);
		console.log(session_id)
		const product_result = await db.pool.query('select price, discount, stock_quantity from product where id = $1', [product_id]);
		// const product_result = await db.pool.query('select price,  from product where session_id = $1', [session_id]);
		// if(product_result.rows[0].stock_quantity === 0){
		// 	return res.status(200).json({isStockAvail: false, message: ""});
		// }
		let quan = 1
		let actual_price = product_result.rows[0].price - product_result.rows[0].discount
		console.log(actual_price)
		let cart_id = 0
		if(result.rows.length > 0){
			cart_id = result.rows[0].id
			await db.pool.query('update cartDetails SET update_date = NOW(), quantity = quantity + 1 where cart_id = $1 and product_id = $2', [cart_id, product_id]);
			// quan = cart_detail_result.rows[0].quantity
		} else {
			const cart_result = await db.pool.query('INSERT INTO cart (session_id) VALUES ($1) RETURNING id', [session_id]);
			cart_id = cart_result.rows[0].id
			await db.pool.query('INSERT INTO cartDetails (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cart_id, product_id, 1]);
		}
		console.log(quan)
		await db.pool.query('update product SET stock_quantity = stock_quantity - 1, update_date = NOW() where id = $1', [product_id])
		await db.pool.query('update cart SET update_date = NOW(), total_amount = total_amount + $1 where session_id = $2', [quan * actual_price, session_id]);
		const allProducts = await getAllProducts();
		const cart_details = await getCartDetails(cart_id, allProducts);
		return res.status(200).json({allProducts: allProducts, cart_details: cart_details});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	} 
})


async function insertProducts(){
	let basePrice = 80.00
	// baseNewPrice = 50.00
	let discount = 30.00
	let baseURL = './Assets'
	let stock = 2
	try {
		for (let i = 1; i < 37; i++){
			let imageName = 'product_' + i +'.png';
			// let imagePath = './ECommerceWebApp/Assets/' + imageName
			let imagePath = path.join("./Assests/" + imageName);
			// imagePath = imagePath.replace(/\\/g, "/");
			// let staticAssetsPath2 = path.join(staticAssetsPath, imageName);
			// console.log(staticAssetsPath)
			let categoryId = 3
			let names = 'kids wear'
			if(i < 13){
				categoryId = 1
				names = 'ladies wear'
			} else if(i < 25){
				categoryId = 2
				names = 'gents wear'
			}
			names += ' product ' + i
			await db.pool.query('INSERT INTO product (name, description, price, discount, stock_quantity, category_id, currency_id, image_absolute_url, image_relative_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [names, names, basePrice, discount, stock, categoryId, 1, imagePath, baseURL+'/'+imageName]);

			basePrice += 10.00
			stock += 1
			// baseNewPrice += 10.00
		}
	} catch(error) {
		console.log("Error :", error)
	}
}

// This function will run first when the backend server starts. It is used to populate necessary tables of currency, category, product
(async function () {
	try {
		const countCurrency = (await db.pool.query('select * from currency')).rowCount;
		const countCategory = (await db.pool.query('select * from category')).rowCount;
		const countProducts = (await db.pool.query('select * from product')).rowCount;
	
		if (countCurrency === 0) {
			await db.pool.query('INSERT INTO currency (name, symbol) VALUES ($1, $2)', ['INR', '₹']);
    		await db.pool.query('INSERT INTO currency (name, symbol) VALUES ($1, $2)', ['USD', '$']);
		} else {
			console.log('Currency rows exists in table');
		}

		if (countCategory === 0) {
			await db.pool.query('INSERT INTO category (name) VALUES ($1)', ['WOMEN']);
    		await db.pool.query('INSERT INTO category (name) VALUES ($1)', ['MEN']);
			await db.pool.query('INSERT INTO category (name) VALUES ($1)', ['KIDS']);
		} else {
			console.log('Category rows exists in table');
		}

		if (countProducts === 0) {
			await insertProducts();
		} else {
			console.log('Product rows exists in table');
		}
		app.listen(PORT, function (error) {
			if (!error) {
				console.log("Server created Successfully on PORT :", PORT);
			} else {
				console.log("Error :", error)
			}
		})
	} catch (err) {
		console.log('ERROR:', err);
	}
})();

// app.listen(PORT, function (error) {
// 	if (!error) {
// 		console.log("Server created Successfully on PORT :", PORT);
// 	} else {
// 		console.log("Error :", error)
// 	}
// })


