import React, { useContext } from "react";
import './CartItems.css'
import { CommonContext } from "./Common";
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
    const { cartItems, removeItemCart, getTotalCartValue, cartProducts } = useContext(CommonContext)
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
                            <input type="text" className="form-control box-length" placeholder="Shipping Address" id="shipAddr"/>
                        </div>
                        {/* <hr /> */}
                        <div className="form-group">
                            <label htmlFor="billAddr">Billing Address</label>
                            <input type="text" className="form-control box-length" placeholder="Billing Address" id="billAddr"/>
                        </div>
                        {/* <hr /> */}
                    </div>
                    <button className="btn btn-default check-button">PROCEED TO CHECKOUT</button>
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