import React, { useContext, useState } from 'react'
import Ubay_logo from "../assets/UBAY_LOGO.png"
import { Link, useNavigate } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { AuthContext } from '../context/AuthContext';
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import {  searchProducts } from '../Services/api';
import { IoClose } from 'react-icons/io5';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)
    const navigate = useNavigate()
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const {cartCount} = useCart();
  const handleSearch = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const query = formData.get('search');

    if (!query.trim()) return;

    try {
      setLoading(true);
      const result = await searchProducts(query);
      console.log("API Response:", result); 
       const formattedResults = result.data.map(product => ({
      id: product._id, // MongoDB uses _id
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "/default-product.jpg" // Take first image
    }));
      setSearchResults(formattedResults)
      setSearchQuery(query)
    } catch (error) {
      setError('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white border border-orange-400 my-1 sticky top-0 z-10  max-w-8xl'>
        <nav className='flex justify-between items-center  flex-row px-2 py-2 mx-6'>
      <div  >
        <Link to="/">
        <img
        src={Ubay_logo}
        alt='Ubay Logo'
        className='w-20 h-10 px-2 '/>
        </Link>
      </div>
      <div className='relative'>
    <div className="border border-orange-400 rounded-full flex items-center p-2 w-72">
  <form onSubmit={handleSearch} className="flex items-center w-full">
    <input
      type="search"
      name="search"
      placeholder="Search products..."
      className="outline-none flex-1 bg-white"
      aria-label="Search products"
    />
    <button type="submit" aria-label="Search" className="mr-2">
      <IoIosSearch className="text-lg"/>
    </button>
  </form>
</div>

 {searchResults.length > 0 && (
   <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-[1000] max-h-96 overflow-y-auto border-2 border-orange-500">
      <div className="flex justify-between p-2 border-b">
        <p className="font-semibold">Results for "{searchQuery}"</p>
        <button 
        title='search-dropdown-close'
        onClick={()=> setSearchResults(0) }
        className='text-gray-600 hover:text-white hover:bg-slate-400 rounded-full transition-all duration-300 '
        ><IoClose/></button>
      </div>
      {searchResults.map(product => (
        <div key={product.id} className="p-3 hover:bg-gray-100 cursor-pointer border-b">
          <div className="flex items-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-10 h-10 object-cover mr-3"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
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
                        currentUser.avatar?.url ||  "https://images.icon-icons.com/3446/PNG/512/account_profile_user_avatar_icon_219236.png"
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
                  <span><IoCartOutline size={24}/></span>
                    {/* Cart counter badge */}
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
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
