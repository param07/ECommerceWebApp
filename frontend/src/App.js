
import './App.css';
import React, { useContext } from "react";
import Header from './Components/Header/Header';
import Lead from './Components/Main/Lead';
import { CommonContext } from "./Components/Main/Common";
import loader_icon from './Components/Assets/loader.gif'
// import Search from './Components/Main/Search';

function App() {
  const { loading } = useContext(CommonContext)
  return (
    <div className={loading ? "app-loading" : ""}>
            {loading && ( // Show spinner when loading is true
                <div className="spinner-container">
                    <img src={loader_icon} alt="Loading..." className="spinner" />
                </div>
            )}
      <div>
        <Header />
        {/* <Search /> */}
        <Lead />      
      </div>
    </div>  
  );
}

export default App;
