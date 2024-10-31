import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from "./components/Home/Home"
import Item from "./components/Item/Item"
import Event from "./components/Event/Event"
import Assignment from './components/Assignment/Assignment';


function App() {
  return (
    <Router>
         <Routes>
         <Route path="/" Component={Home}/>
         <Route  path='/Items' Component={Item}/>
         <Route  path='/Event' Component={Event}/>
         <Route  path='/Assignment' Component={Assignment}/>
         </Routes>
    </Router>
  );
}

export default App;
