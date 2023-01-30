import React, { Component } from "react";
// import { ReactDOM } from "react";
// import { render } from "react-dom";

import {
    BrowserRouter,
    Route,
    Routes,
    Redirect,
    Switch
} from "react-router-dom";
import Dashboard from "./layout/Dashboard";

function App(props) {  

    return (
        <Routes>
            <Route path="/" element={<Dashboard />}></Route>
        </Routes>
    )
  }
    
export default App;