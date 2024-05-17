import React, { useContext, useState } from "react";
import './CartItems.css'
import { CommonContext } from "./Common";
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
    const { cartItems, removeItemCart, getTotalCartValue, cartProducts, setLoading } = useContext(CommonContext)
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    const proceedToCheckout = async () => {
        let cartDetailsArr = []
        for (let item of cartProducts){
            if(cartItems[item.id] > 0){
                cartDetailsArr.push({
                    productId: item.id,
                    quantity: cartItems[item.id],
                    pr_name: item.name,
                    pr_price: item.new_price
                })
            }
        }
        const cartDetails = {
            totalCartValue: getTotalCartValue(),
            shipAddress: shippingAddress,
            billAddress: billingAddress,
            cartdetails: cartDetailsArr
        }
        // console.log(cartDetails)
        setLoading(true)
        const checkoutfunc = async () => {
            try{
                const response = await fetch('http://localhost:8000/checkout', {
                    credentials: "include",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cartDetails)
                });
                const data = await response.json();
                window.location.href = data.paypalUrl;
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        checkoutfunc();
        // fetch('http://localhost:8000/checkout',{
        //     credentials: "include",
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(cartDetails)
        // }).then(response => response.json())
        // .then(data => {window.location.href = data.paypalUrl}).catch(error => console.error("Error: ", error))
    }

    return (
        <div className="cartItemsClass">
            <div className="cartItems-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {cartProducts.map((i) => {
                if (cartItems[i.id] > 0) {
                    return <div key={i.id}>
                                <div className="cartItems-format cartItems-main">
                                    <img src={i.image} alt="" className="cartProduct-icon" />
                                    <p>{i.name}</p>
                                    <p>${i.new_price}</p>
                                    <button className="cartItems-quantity">{cartItems[i.id]}</button>
                                    <p>${i.new_price * cartItems[i.id]}</p>
                                    <img className="cartRemove-icon" src={remove_icon} onClick={() => { removeItemCart(i.id) }} alt="" />
                                </div>
                                <hr />
                            </div>
                }
                return null;
            })}
            <div className="cartItems-after">
                <div className="cartItems-total">
                    <h2>Cart Summary</h2>
                    <hr />
                    <div>
                        <div className="cartItems-total-items">
                            <p>Cart Total</p>
                            <p>${getTotalCartValue()}</p>
                        </div>
                        {/* <hr /> */}
                        <div className="cartItems-total-items">
                            <p>Tax</p>
                            <p>${0}</p>
                        </div>
                        <hr />
                        <div className="cartItems-total-items">
                            <h3>Total</h3>
                            <h3>${getTotalCartValue()}</h3>
                        </div>
                    </div>
                    {/* <button>PAYMENT</button> */}
                </div>
                <div className="ship-details">
                    <h2>Shipment</h2>
                    <hr />
                    <div>
                        <div className="form-group">
                            <label htmlFor="shipAddr">Shipping Address</label>
                            <input type="text" className="form-control box-length" placeholder="Shipping Address" id="shipAddr" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}/>
                        </div>
                        {/* <hr /> */}
                        <div className="form-group">
                            <label htmlFor="billAddr">Billing Address</label>
                            <input type="text" className="form-control box-length" placeholder="Billing Address" id="billAddr" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)}/>
                        </div>
                        {/* <hr /> */}
                    </div>
                    <button className="btn btn-default check-button" onClick={proceedToCheckout}>PROCEED TO CHECKOUT</button>
                </div>
                {/* <div className="cartItems-promocode">
                    <p>Enter Promo Code Here</p>
                    <div className="cartItems-promobox">
                        <input type="text" placeholder="Promo Code"/>
                        <button>Submit</button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default CartItems