import React, { useContext, useState } from "react";
import { CommonContext } from './Common';
import './Search.css'

const Search = () => {
    const { updateProducts } = useContext(CommonContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        // console.log({searchTerm})
        // fetch('http://localhost:8000/searchproducts?name=' + encodeURIComponent(searchTerm))
        // .then(response => response.json())
        // .then(data => {
        //     // Update products in context
        //     updateProducts(data.allProducts);
        // })
        // .catch(error => {
        //     console.error('Error fetching search results:', error);
        // });
        try {
            console.log({searchTerm});
            const response = await fetch('http://localhost:8000/searchproducts?name=' + encodeURIComponent(searchTerm));
            const data = await response.json();
            updateProducts(data.allProducts);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }


    return(
        <div className="searchbar">
            <div className="form-group">
                <input type="text" className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  placeholder="search product" />
                <button className="btn btn-default" onClick={handleSearch}>Search</button>
            </div>
        </div>
    )
}

export default Search