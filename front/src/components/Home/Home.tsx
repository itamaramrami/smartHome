import React from 'react'
import css from "./Home.module.css"
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    
    <div>
        <h1> ברוכים הבאים</h1>
        <div className={css.container}>
    <div><button><Link to="/Item">Item</Link></button></div>
    <div><button><Link to="/Event">Event</Link></button></div>
    <div><button><Link to="/Assignment">Assignment</Link></button></div>
   
    
   </div>
    </div>
  )
}

export default Home