// src/components/Cart.js
import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <div className="fixed right-4 top-4 bg-white p-4 rounded-lg shadow-lg w-64">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="mb-4">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center py-2 border-b">
                <span>{item.name}</span>
                <div className="flex items-center">
                  <span className="mr-2">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="font-bold text-lg">
            Total: ${cartTotal.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;