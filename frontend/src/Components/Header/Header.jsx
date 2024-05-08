import React from "react";
import './Header.css'
import logo from '../Assets/logo.png'
// import cart_img from '../Assets/cart_icon.png'

const Header = () => {
    return (
        <div className="header">
            <div className="head-logo">
                <img src={logo} alt=""/>
                <div>
                    <p className="p1">BEYOND STYLE</p>
                    <p className="p2">Wear Simple Elegant Smart</p>
                </div>
            </div>
        </div>
    )
}

export default Header