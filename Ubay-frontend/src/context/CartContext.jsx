import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest } from "../Services/api";


const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const {currentUser} = useContext(AuthContext)

  useEffect(()=>{
    const loadcart = async()=>{
      try {
        setLoading(true)
        const res = await apiRequest.get("/cart/",{
          headers:{
            Authorization: `Bearer ${currentUser?.token}`,
          },
          withCredentials: true,
        });
        setCartItems(res.data.items);
      } catch (error) {
        console.error("Failed To Load Cart", error);
        setCartItems([]);
      }finally{
        setLoading(false)
      }
  };
   loadcart();

},[currentUser])


const addToCart = async(productItem, quantity)=>{
  try{
    setLoading(true)
    const res = await apiRequest.post("/cart/add",{
      productId: productItem._id,
      quantity: Number(quantity),
   
    },{
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
          withCredentials: true,
        }
      ); 
      setCartItems(res.data.items);
  }catch(error){
    console.log("Failed to Cart the Item", error);

  }finally{
    setLoading(false)
  }
};


 const removeFromCart = async ( productId) => {
  
  
    try {
      setLoading(true);
      const res = await apiRequest.delete("/cart/remove", {
        data: { productId },
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
        withCredentials: true,
      });
       // setCartItems(prev=> prev.filter(cart=>{
    //   const item = cart.productItem || cart;
    //   return item.id !== productId ;
    // }))
      setCartItems(res.data.items); // use updated cart from backend
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    } finally {
      setLoading(false);
    }
  };


  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || item.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
  
return (
  <CartContext.Provider value={{cartItems, loading, addToCart, removeFromCart, cartCount, cartTotal}}>
{children}
  </CartContext.Provider>
)
};
export const useCart =()=> useContext(CartContext);