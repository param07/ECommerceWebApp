const express = require("express")
const session = require('express-session')
const app = express()
const cors = require('cors')
const db = require('./db.js')
const path = require('path')
const cookieParser = require('cookie-parser')
const currPath = path.resolve()
const uniqid = require('uniqid');
const axios = require('axios');
const sha256 = require('js-sha256');
const { url } = require("inspector")


// Port Number Setup 
const PORT = process.env.port || 8000
const FRONT_URL = 'http://localhost:3000';
const BACK_URL = 'http://localhost:8000';



app.use(cors({
	origin: FRONT_URL,
	credentials: true
}));
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


function setAllProducts(result) {
	let allProducts = []
	if (result && result.rows && result.rows.length > 0) {
		for (let i = 0; i < result.rows.length; i++) {
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

async function getAllProducts() {
	try {
		const result = await db.pool.query('SELECT pr.*, cat.name AS category_name, curr.symbol AS currency_symbol FROM product pr, category cat, currency curr WHERE pr.category_id = cat.id AND pr.currency_id = curr.id AND pr.stock_quantity > 0;');
		return setAllProducts(result);
	} catch (error) {
		throw error
	}
}


app.get("/", async (req, res) => {
	// console.log(req.session)
	// console.log(req.sessionID)
	try {
		req.session.visited = true;
		let cart = {}
		// console.log(req.signedCookies.sessionID)
		// console.log(req.sessionID)
		// if(req.signedCookies.sessionID && req.signedCookies.sessionID === req.sessionID){
		const allAvailProducts = await getAllProducts()
		console.log(req.sessionID)
		console.log(req.signedCookies.sessionValidateID)
		let userLatestType = "old";
		if (req.signedCookies.sessionValidateID && req.signedCookies.sessionValidateID === req.sessionID) {
			// console.log(req.signedCookies.sessionValidateID)
			console.log("IOld user")
		} else {
			console.log("New user")
			userLatestType = "new";
			const result = await db.pool.query('INSERT INTO session_details (token) VALUES ($1) RETURNING id', [req.sessionID]);
			const newId = result.rows[0].id;
			res.cookie("sessionValidateID", req.sessionID, { signed: true })
			res.cookie("sessionPrimaryID", newId, { signed: true })
		}
		return res.status(200).json({ allProducts: allAvailProducts, userType: userLatestType});
	} catch (error) {
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
		return res.status(200).json({ allProducts: allAvailProducts });
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
		return res.status(200).json({ allProducts: setAllProducts(result) });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
})

// app.get("/phonepay", async (req, res) => {
// 	const payEndPoint = '/v3/qr/init'
// 	const userId = "1234"
// 	const transaction_id = uniqid();
// 	const payload = {
// 		"merchantId": MERCHANT_ID,
// 		"merchantTransactionId": transaction_id,
// 		"storeId": userId,
// 		"amount": 10000, // in paise
// 		// "redirectUrl": `https://localhost:8000/redirect-url/${transaction_id}`,
// 		"expiresIn": 1800
// 	};

// 	// SHA256(base64 encoded payload + “/pg/v1/pay” +salt key) + ### + salt index
// 	const bufferObj = Buffer.from(JSON.stringify(payload), 'utf8');
// 	const base64Encodeding = bufferObj.toString("base64");
// 	const xVerify = sha256(base64Encodeding + payEndPoint + SALT_KEY) + '###' + SALT_KEY_INDEX;

// 	const options = {
// 		method: 'post',
// 		url: HOST_URL + payEndPoint,
// 		headers: {
// 			accept: 'application/json',
// 			'Content-Type': 'application/json',
// 			'X-VERIFY': xVerify,
// 			'X-CALLBACK-URL': `https://localhost:8000/redirect-url/${transaction_id}`
// 		},
// 		data: {
// 			request:base64Encodeding
// 		}
		
// 	};
// 	console.log(options);
// 	// console.log()
// 	axios.request(options).then(async function (response) {
// 		console.log(response.data);
// 		res.send(response.data)
// 	})
// 		.catch(function (error) {
// 			console.log("this is an error")
// 			return res.status(500).json({ error: error });
// 		});
// })

PAYPAL_CLIENT_ID = "AZ7HmAZ4oiT8vOb2ejMbBOxBNaFNdOPU9AhvmfjnIPmrNhzRa84kseuLxiYX_kPSIeC4VS298PX5UlkQ";
PAYPAL_SECRET = "EFEnpstSCLiXHTvmWlUhG04BPYPEwIzRHoUv6KtDI6kxrJ6DMIENKlvL3deB5IXCaxVEPHN3ZPPWA6ge";
PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"


async function generatePayPalAccessToken() {
	const response = await axios({
        url: PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
        data: 'grant_type=client_credentials',
        auth: {
            username: PAYPAL_CLIENT_ID,
            password: PAYPAL_SECRET
        }
    })

    return response.data.access_token
	// const options = {
	// 	method: 'post',
	// 	url: PAYPAL_BASE_URL + '/v1/oauth2/token',
	// 	headers: {
	// 		accept: 'application/json',
	// 		'Content-Type': 'application/x-www-form-urlencoded',
	// 	},
	// 	data: 'grant_type=client_credentials',
	// 	auth: {
	// 		username: PAYPAL_CLIENT_ID,
	// 		password: PAYPAL_SECRET
	// 	}
		
		
	// };
	// axios.request(options).then(async function (response) {
	// 	console.log(response.data);
	// 	const token = response.data.access_token;
	// 	// res.send(response.data)
	// }).catch(function (error) {
	// 		console.log("error while generating token", error)
	// 		// return res.status(500).json({ error: error });
	// 	});
}

async function initiatePayPalPayment(payArr, totalCartValue, transactionID, paymentId, new_order_id) {
	console.log("payment initiated")
	const accessToken = await generatePayPalAccessToken();
	// console.log("payment token", accessToken)
	// console.log("items array", payArr)
	// console.log("total cart value", totalCartValue)

	const response = await axios({
        url: PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
					invoice_id: transactionID,
                    items: payArr,
                    amount: {
                        currency_code: 'USD',
                        value: totalCartValue,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: totalCartValue
                            }
                        }
                    }
                }
            ],

			"payment_source": {
				"paypal": {
				  "experience_context": {
					"payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
					"brand_name": "EXAMPLE INC",
					"locale": "en-US",
					"landing_page": "LOGIN",
					"shipping_preference": "NO_SHIPPING",
					"user_action": "PAY_NOW",
					"return_url": `${BACK_URL}/completeOrder?paymentId=${paymentId}&orderID=${new_order_id}&accessToken=${accessToken}`,
					"cancel_url": BACK_URL + "/cancelOrder"
				  }
				}
			  }
        })
    })

	console.log("payment initiation done")

	// console.log(response.data)
	return response.data.links.find(link => link.rel === 'payer-action').href
	
}

async function finishPayment(orderId){
	const accessToken = await generatePayPalAccessToken()
	console.log("newaccesstoken", accessToken)

    const response = await axios({
        url: PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })
	console.log(response.data)
	console.log(response.data.status)

    return response.data.status
}

app.get('/completeOrder', async (req, res) => {
	try {
		console.log("complete order api")
		console.log("paymentID", req.query.paymentId)
		console.log("orderID", req.query.orderID)
		console.log("paypalordertoken", req.query.token)
		console.log("accesstoken", req.query.accessToken)
		const payStatus = await finishPayment(req.query.token)
		let payStatusDb = payStatus
		if(payStatus === 'COMPLETED'){
			payStatusDb = "PAID"
		}
		await db.pool.query('UPDATE payment_details SET payment_status = $1, update_date = NOW() WHERE id = $2', [payStatusDb, req.query.paymentId]);
		await db.pool.query('UPDATE orders SET order_pay_status = $1, update_date = NOW() WHERE id = $2', [payStatusDb, parseInt(req.query.orderID, 10)]);
		const allAvailProducts = await getAllProducts();
		// return res.redirect('http://localhost:3000');
		// return res.status(200).json({ allProducts: allAvailProducts, cart_details: {}, payStatus: "success"});
		const redirectUrl = `http://localhost:3000?payStatus=success`;
		return res.redirect(redirectUrl);
	} catch (error) {
		console.log("Error in /completeOrder API: ", error)
	}
})

app.get('/cancelOrder', async (req, res) => {
	const allAvailProducts = await getAllProducts();
	return res.status(200).json({ allProducts: allAvailProducts, cart_details: {}, payStatus: "CancelledByUser"});
})

app.post("/checkout", async function (req, res) {
	try {
		const { cartdetails, totalCartValue, shipAddress, billAddress } = req.body;
		const sessionId = req.signedCookies.sessionPrimaryID;
		console.log(sessionId)
		const new_order_result = await db.pool.query('INSERT INTO orders (session_id, total_amount, order_pay_status, order_deliver_status, shipping_address, billing_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [sessionId, totalCartValue, 'PENDING', 'PENDING', shipAddress, billAddress]);
		const new_order_id = new_order_result.rows[0].id;
		console.log(new_order_id)
		for (let i = 0; i < cartdetails.length; i++) {
			await db.pool.query('INSERT INTO order_details (order_id, product_id, quantity, order_deliver_status) VALUES ($1, $2, $3, $4) RETURNING id', [new_order_id, cartdetails[i].productId, cartdetails[i].quantity, 'PENDING']);
			await db.pool.query('UPDATE product SET stock_quantity = stock_quantity - $1, update_date = NOW() WHERE id = $2', [cartdetails[i].quantity, cartdetails[i].productId]);
		}

		// payment details
		// for transactionID
		// uuid.v4() method. This method generates a random UUID that is based on random numbers generated using the system clock and random number generator.
		const transactionID = uniqid();
		const pay_result = await db.pool.query('INSERT INTO payment_details (ord_id, session_id, transaction_id, payment_status) VALUES ($1, $2, $3, $4) RETURNING id', [new_order_id, sessionId, transactionID, 'PENDING']);
		// const payment_result = await db.pool.query('INSERT INTO payment_details (ord_id, session_id, transaction_id, payment_status) VALUES ($1, $2, $3, $4) RETURNING id', [new_order_id, sessionId, transactionID, 'PENDING']);
		const paymentId = pay_result.rows[0].id;

		// PhonePe API
		let payArr = []
		for (let i = 0; i < cartdetails.length; i++) {
			payArr.push(
				{
					name: cartdetails[i].pr_name,
					// description: 'Node.js Complete Course with Express and MongoDB',
					quantity: cartdetails[i].quantity,
					unit_amount: {
						currency_code: 'USD',
						value: cartdetails[i].pr_price
					}
				}
			)
		}

		const url = await initiatePayPalPayment(payArr, totalCartValue, transactionID, paymentId, new_order_id)
		// const urlWithPaymentId = `${url}?paymentId=${paymentId}?orderID=${new_order_id}?accessToken=${accessToken}`;
		console.log(url)
		return res.status(200).json({ paypalUrl: url });
		// res.redirect(url)

		// const allProducts = await getAllProducts();
		// const cart_details = await getCartDetails(cart_id, allProducts);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
})


async function insertProducts() {
	let basePrice = 80.00
	// baseNewPrice = 50.00
	let discount = 30.00
	let baseURL = './Assets'
	let stock = 2
	try {
		for (let i = 1; i < 37; i++) {
			let imageName = 'product_' + i + '.png';
			// let imagePath = './ECommerceWebApp/Assets/' + imageName
			let imagePath = path.join("./Assests/" + imageName);
			// imagePath = imagePath.replace(/\\/g, "/");
			// let staticAssetsPath2 = path.join(staticAssetsPath, imageName);
			// console.log(staticAssetsPath)
			let categoryId = 3
			let names = 'kids wear'
			if (i < 13) {
				categoryId = 1
				names = 'ladies wear'
			} else if (i < 25) {
				categoryId = 2
				names = 'gents wear'
			}
			names += ' product ' + i
			await db.pool.query('INSERT INTO product (name, description, price, discount, stock_quantity, category_id, currency_id, image_absolute_url, image_relative_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [names, names, basePrice, discount, stock, categoryId, 1, imagePath, baseURL + '/' + imageName]);

			basePrice += 10.00
			stock += 1
			// baseNewPrice += 10.00
		}
	} catch (error) {
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


