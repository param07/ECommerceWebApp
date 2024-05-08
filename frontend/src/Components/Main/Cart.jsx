import React from "react";
import './Cart.css'
import cart_img from '../Assets/cart_icon.png'
import CartItems from "./CartItems";


const Cart = () => {
    return(
        <div className="cart">
            <div className="cart-start">
                <h1>Cart</h1>
                <div className="head-cart">
                    <img src={cart_img} alt=""/>
                    <div className="cart-count">
                        0
                    </div>
                </div>
            </div>
            <hr className="carthr"/>
            <CartItems />
        </div>
        
        
    )
}

export default Cart