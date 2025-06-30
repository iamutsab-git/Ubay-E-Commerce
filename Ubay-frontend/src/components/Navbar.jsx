import React, { useContext } from 'react'
import Ubay_logo from "../assets/UBAY_LOGO.png"
import { Link } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { AuthContext } from '../context/AuthContext';
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";


const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
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
            {!currentUser? (
              <>
                <Link to="/login">
                <li className='hover:text-orange-500 relative group'>
                <FaRegUser/>
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>

                </li>
                </Link>
           
                {/* <Link to="/login">
                <li className='hover:text-orange-500 relative group'>
                Log in
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
                </li>
                </Link> */}
                </>
                ):(
                  <>
                  <div className='flex items-center space-x-3'>
                    <Link to="/profile"
                    className='flex items-center relative group border border-transparent rounded-full hover:border-orange-500 transition-colors duration-300 '>
                     <span> <img 
                      src={
                        currentUser.avatar ||  "https://images.icon-icons.com/3446/PNG/512/account_profile_user_avatar_icon_219236.png"
                      }
                      alt='User Avatar'
                      className='w-7 h-7 rounder-full object-cover'/></span>
                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  
                  </div>
                  </>
                )}
                <Link to="/cart">
                  <li className='hover:text-orange-500 relative group'>
                  <span><IoCartOutline /></span>
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
