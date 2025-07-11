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
import ProductPage from './pages/ProductPage'
import Profile from './pages/profile'
import Cart from './pages/Cart'
import Dashboard from './admin/Dashboard'
import UpdateProfile from './components/UpdateProfile'
const App = () => {
  return (
    <div>
{/*       
      <Navbar/>
      <Hero/>

      <Footer/> */}
      <Routes>
       <Route path="/" element={<><Navbar /><Hero /><Footer/></>} />
        <Route path="/about" element={<><Navbar /><About/></>}/>
        <Route path="/contact" element={<><Navbar/><Contact/></>}/>
        <Route path="/collection" element={<><Navbar/><Collection/></>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<><Navbar/><Profile /></>} />
        <Route path="/edit" element={<><Navbar/><UpdateProfile /></>} />
        <Route path="/cart" element={<><Navbar/><Hero/><Cart/></>} />
   <Route path="/product/:id" element={<ProductPage />} />
   <Route path="/admin/dashboard" element={<Dashboard/>}/>
       </Routes>
      <ToastContainer
  position="bottom-center"
  hideProgressBar
  theme="dark"
  toastClassName="bg-zinc-900 text-white border-l-4 border-green-400 rounded shadow-md p-4"
  bodyClassName="text-sm font-medium"
  progressClassName="bg-orange-400"
/>
    </div>
  )
}

export default App
