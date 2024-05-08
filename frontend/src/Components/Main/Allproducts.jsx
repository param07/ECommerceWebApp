import React, { useContext } from "react";
import './Allproducts.css'
// import all_product from "../Assets/all_product";
import { CommonContext } from "./Common";
import Item from "./Item";
import Search from "./Search";

const Allproducts = () => {
    const { all_product } = useContext(CommonContext)
    return(

        <div className="all-products">
            <h1>Let's Shop</h1>
            <hr />
            <Search />
            <div className="shop-item">
                {all_product.map((item, i) => {
                    return <Item key = {i} id = {item.id} name = {item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price}/>
                })}
            </div>
        </div>
    )
}

export default Allproducts