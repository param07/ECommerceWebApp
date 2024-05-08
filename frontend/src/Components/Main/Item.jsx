import React, { useContext } from "react";
import './Item.css'
import { CommonContext } from "./Common";

const Item = (props) => {

    const {addItemCart} = useContext(CommonContext)
    // console.log(addItemCart)


    return(
        <div className="item">
            {/* <Image src={props.image} alt="" responsive="true"/> */}
            <img src={props.image} alt=""/>
            <p>{props.name}</p>
            <div className="item-prices">
                <div className="item-price-new">${props.new_price}</div>
                <div className="item-price-old">${props.old_price}</div>
            </div>
            <div>
                <button type="button" className="btn btn-default cart-button" onClick={() => {addItemCart(props.id)}}>ADD TO CART</button>
            </div>
        </div>
    )
}

export default Item