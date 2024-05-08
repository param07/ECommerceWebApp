import React from "react";
import Allproducts from "./Allproducts";
import Cart from "./Cart";
import './Lead.css'

const Lead = () => {
    return(
        <div className="main">
            <div>
                <Allproducts />
            </div>
            <div>
                <Cart />
            </div>
        </div>
    )
}

export default Lead