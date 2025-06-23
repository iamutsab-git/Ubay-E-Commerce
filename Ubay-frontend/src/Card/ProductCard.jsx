import React from 'react'
import { useNavigate } from 'react-router-dom';
import toast from "react-toastify";

const ProductCard = ({ product, products,title}) => {
    navigate= useNavigate();
    const BASE_IMAGE_URL="http://localhost:8800/"
  const   FALLBACK_IMAGE="https://sct.com.np/wp-content/uploads/2022/08/default-fallback-image.png"
    const cardVariants ={
        hover:{
      scale: 1.15,
      zIndex: 10,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    initial: { scale: 1 },
    };
    
  const handleSinglePage = (productId) => {
    navigate(`/product/${productId}`);
  };
  const handleCartClick=async(e, productItem)=>{
    e.stopPropagation();
    toast.success("Added to Cart");

  }

  if(products && title){
  return (
    <motion.div
    initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-4 pl-4">{title}</h2>
            <div className='flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide'>
                {products.map((productItem)=>
                <motion.div
                key={productItem.id}
                variants={cardVariants}
                 initial="initial"
              whileHover="hover"
               className="flex-none w-52  relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleSinglePage(productItem.id)}
                >
                    <img
                    src={ productItem.photo
                    ? `${BASE_IMAGE_URL}${productItem.photo}`
                    : FALLBACK_IMAGE}
                    alt={productItem.title}
                    className='w-full h-full object-cover'
                    onClick={handleSinglePage}/>
                    <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4">
                   <h3 className="text-white text-lg font-bold truncate">
                  {productItem.title || "Untitled Product"}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {productItem.overview?.slice(0, 80) || "No description available"}...
                </p>
                  <h2 className="text-white text-lg font-bold truncate">
                  Rs:{productItem.price || "Rs:???"}
                </h2>
                 <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleCartClick(e, productItem)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  Add to Cart
                </motion.button>
                    </motion.div>
                </motion.div>
                )}
            </div>
    </motion.div>
  )
}}

export default ProductCard
