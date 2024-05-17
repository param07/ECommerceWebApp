import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from "react-router-dom";
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
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    const navigate = useNavigate();

    const updateProducts = (products) => {
        set_all_product(products);
    }

    const [cartProducts, setCartProducts] = useState([]);
    const [useType, setUseType] = useState('old');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/', {
                    credentials: "include"
                });
                const data = await response.json();
                
                set_all_product(data.allProducts);
                // const sessionID = Cookies.get('sessionValidateID');
                setUseType(data.userType);

            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };

        fetchData();
    }, []) // square brackets is for loading the useeffect once, when the component is mounted


    useEffect(() => {
        const sessionID = Cookies.get('sessionValidateID');
        const queryParams = new URLSearchParams(location.search);
        if (sessionID && useType === "old" && ((!queryParams.get("payStatus")) || (queryParams.get("payStatus") && (queryParams.get("payStatus") !== 'success')))) {
            const storedCartItems = localStorage.getItem(`cartItems_${sessionID}`);
            if (storedCartItems) {
                setCartItems(JSON.parse(storedCartItems));
            }
        }
    }, [location.search, useType]);

    useEffect(() => {
        // const sessionID = Cookies.get('sessionValidateID');
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get("payStatus") && queryParams.get("payStatus") === 'success') {
            alert('Payment Successful!'); 
            navigate('/');
        }
    }, [location.search]);

    useEffect(() => {
        const sessionID = Cookies.get('sessionValidateID');

        if (sessionID) {
            // console.log('inside set local storage')
            localStorage.setItem(`cartItems_${sessionID}`, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    useEffect(() => {
        const fetchDataNew = async () => {
            try {
                const response = await fetch('http://localhost:8000/allproducts', {
                    credentials: "include"
                });
                const data = await response.json();
                
                setCartProducts(data.allProducts.filter(product => cartItems[product.id] > 0));
            } catch (error) {
                console.error('Error fetching poducts:', error);
            }
        };

        fetchDataNew();
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
                let itemInfo = cartProducts.find((product) => product.id===(Number)(i))
                if(itemInfo){
                    total += itemInfo.new_price * cartItems[i];
                }
            }
        }
        return total;
    }

    const contextVal = { getTotalCartValue, all_product, cartItems, addItemCart, removeItemCart, updateProducts, cartProducts, setLoading, loading }


    return (
        <CommonContext.Provider value={contextVal}>
            {props.children}
        </CommonContext.Provider>
    )
}

export default CommonContextProvider