import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
// import all_product from "../Assets/all_product";

export const CommonContext = createContext(null);

// const defaultCart = () => {
//     let cart = {}
//     for (let i = 0; i < all_product.length + 1; i++) {
//         cart[i] = 0
//     }
//     return cart
// }

const defaultCart = () => {
    let cart = {}
    for (let i = 0; i < 300 + 1; i++) {
        cart[i] = 0
    }
    return cart
}

const CommonContextProvider = (props) => {

    const [all_product, set_all_product] = useState([])
    const [cartItems, setCartItems] = useState(defaultCart())

    // console.log(cartItems)
    // const addToCart = (itemId) => {
    //     setCartItems((prev) => ({...prev, [itemId]:prev[itemId] + 1}))
    // }

    const updateProducts = (products) => {
        set_all_product(products);
    }


    useEffect(() => {
        fetch('http://localhost:8000/', {
            credentials: "include"
        }).then((response) => response.json())
        .then((data) => set_all_product(data.allProducts));
        const cookieValue = Cookies.get('sessionValidateID');
        console.log(cookieValue)
        const cookiePValue = Cookies.get('sessionPrimaryID');
        console.log(cookiePValue)
    }, []) // square brackets is for loading the useeffect once, when the component is mounted


    useEffect(() => {
        const sessionID = Cookies.get('sessionValidateID');
        if (sessionID) {
            const storedCartItems = localStorage.getItem(`cartItems_${sessionID}`);
            if (storedCartItems) {
                setCartItems(JSON.parse(storedCartItems));
            }
        }
    }, []);

    useEffect(() => {
        const sessionID = Cookies.get('sessionValidateID');
        if (sessionID) {
            localStorage.setItem(`cartItems_${sessionID}`, JSON.stringify(cartItems));
        }
    }, [cartItems]);



    const addItemCart = (itemId) => {
        setCartItems(prev => {
            const updatedCart = { ...prev };
            for (const key in updatedCart) {
                if (Number(key) === itemId) {
                    updatedCart[itemId]++;
                    break;
                }
            }
            return updatedCart;
        });
        // console.log(cartItems)
    };

    const removeItemCart = (itemId) => {
        setCartItems(prev => {
            const updatedCart = { ...prev };
            for (const key in updatedCart) {
                if (Number(key) === itemId) {
                    updatedCart[itemId]--;
                    break;
                }
            }
            return updatedCart;
        });
    }

    const getTotalCartValue = () => {
        let total = 0
        for(const i in cartItems){
            if(cartItems[i] > 0){
                let itemInfo = all_product.find((product) => product.id===(Number)(i))
                if(itemInfo){
                    total += itemInfo.new_price * cartItems[i];
                }
            }
        }
        return total;
    }

    const contextVal = { getTotalCartValue, all_product, cartItems, addItemCart, removeItemCart, updateProducts }


    return (
        <CommonContext.Provider value={contextVal}>
            {props.children}
        </CommonContext.Provider>
    )
}

export default CommonContextProvider