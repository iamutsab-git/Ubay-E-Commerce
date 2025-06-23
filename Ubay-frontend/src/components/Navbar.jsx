import React from 'react'
import Ubay_logo from "../assets/UBAY_LOGO.png"
import { Link } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
  return (
    <div className='bg-white border-y border-orange-400 my-1 sticky top-0 z-10   max-w-8xl'>
        <nav className='flex justify-between items-center  flex-row px-2 py-2 mx-6'>
      <div  >
        <Link to="/">
        <img
        src={Ubay_logo}
        alt='Ubay Logo'
        className='w-20 h-10 px-2 '/>
        </Link>
      </div>
      <div className="border border-orange-400 rounded-full flex items-center p-2 w-70">
        <IoIosSearch className='mr-3  '/>
        <form>
        <input
        type="search"
        name="search"
        placeholder="Search"
        className="outline-none flex-1 "/>
        </form>
      </div>
      <div>
        <ul className='list-none flex justify-between space-x-4 items-center flex-row  '>
        
                <Link to="/">
                 <li className='hover:text-orange-500 relative group'>
                Home
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>

                </li>
                </Link>
            
            
                <Link to="/about">
                <li className='hover:text-orange-500 relative group'>
                About
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>

                </li>
                </Link>
            
                <Link to="/collection">
                <li className='hover:text-orange-500 relative group'>
                Collection
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>

                </li>
                </Link>
           
                <Link to="/contact">
             <li className='hover:text-orange-500 relative group'> 
                  Contact
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>

                </li>
                </Link>
            
                <Link to="/signup">
                <li className='hover:text-orange-500 relative group'>
                Sign Up
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>

                </li>
                </Link>
           
                <Link to="/login">
                <li className='hover:text-orange-500 relative group'>
                Log in
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
                </li>
                </Link>
           
        </ul>
      </div>
      </nav>
    </div>
  )
}

export default Navbar
