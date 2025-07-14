import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { 
  IoClose, 
  IoCart, 
  IoAdd, 
  IoRemove, 
  IoTrash, 
  IoCard,
  IoAlertCircle
} from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Home from "./Home";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { 
    cartItems, 
    addToCart,
    removeFromCart, 
    cartTotal, 
    cartCount,
    loading,
    error,
  } = useCart();

  const navigate = useNavigate();

  if (loading) return (
    <div className="fixed right-4 bottom-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-2xl shadow-2xl w-80 z-50 border border-orange-400">
      <div className="flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
        Loading cart...
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed right-4 bottom-4 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl shadow-2xl w-80 z-50 border border-red-400">
      <div className="flex items-center">
        <IoAlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    </div>
  );



  return (
    <div className="fixed  inset-0 bg-slate-800 ">
   <div className="fixed left-1/2 top-1/2 w-auto h-auto bg-gradient-to-b from-slate-800 to-slate-900 text-white p-6 rounded-4xl max-w-md shadow-2xl z-50 border border-slate-700 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300">
  {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
          Your Cart
        </h2>
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 rounded-full text-sm font-medium">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
          <button
            onClick={()=> navigate("/")}
            className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-full transition-all duration-200"
            title="Close cart"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      </div>
          
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <IoCart className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">Your cart is empty</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="mb-6 max-h-72 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {cartItems.map(item => (
              <div key={item.product._id} className="flex justify-between items-center py-4 border-b border-slate-700 last:border-b-0">

                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{item.product.name}</h3>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => removeFromCart(item.product._id, false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      disabled={item.quantity <= 1 || loading}
                    >
                      <IoRemove className="w-4 h-4" />
                    </button>
                    <span className="bg-slate-700 px-3 py-1 rounded-full text-sm font-medium min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => addToCart(item.product, 1)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      disabled={loading}
                    >
                      <IoAdd className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="font-bold text-orange-400">
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.product._id, true)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                    aria-label="Remove item"
                    disabled={loading}
                  >
                    <IoTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Checkout */}
          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-white">Total:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                Rs. {cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end ">
            <button
              className="w-60  bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => navigate("/CheckOut")}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <IoCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </div>
              )}
            </button>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default Cart;