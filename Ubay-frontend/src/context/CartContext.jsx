import { createContext, useState, useContext } from "react";


const CartContext= createContext();

export const CartProvider = ({children})=>{
  const[cartItems, setCartItems] = useState([]);
  const [error, setError]= useState("");
  const [loading, setLoading ] = useState(false);

  const addToCart = (productItem)=>{
    try{
      setLoading(true)
       setCartItems([...cartItems, productItem]);
    }catch(error){
    console.log(error);
  }finally{
    setLoading(false);
  }
};

  const removeFromCart = (productId) => {
     try{
      setLoading(true)
      setCartItems(cartItems.filter(product=> product.id !== productId));
    }catch(error){
    console.log(error);
  }finally{
    setLoading(false);
  }
  };

  const cartTotal = cartItems.reduce((total, product) => total + product.price, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
  
};

export const useCart = () => useContext(CartContext);