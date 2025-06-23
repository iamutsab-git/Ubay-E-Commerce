import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Contact from './pages/Contact'
import Hero from './components/Hero'
import Footer from './components/Footer'
import {ToastContainer} from "react-toastify";
const App = () => {
  return (
    <div>
      
      <Navbar/>
      <Hero/>
      <Footer/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/collection" element={<Collection/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      <ToastContainer/>
    </div>
  )
}

export default App
