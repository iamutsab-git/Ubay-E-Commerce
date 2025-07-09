import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, products, title }) => {
  const navigate = useNavigate();
  const { addToCart, loading, error } = useCart();
  const FALLBACK_IMAGE = "https://sct.com.np/wp-content/uploads/2022/08/default-fallback-image.png";
  const productList = product ? [product] : products;
  const [quantities, setQuantities] = useState({});

  if (!productList?.length) {
    return <div className="text-center text-gray-500 py-8">No products available</div>;
  }

  const handleSinglePage = (productId) => {
    navigate("/product/:id");
  };

  const handleCartClick = async (e, productItem, quantity) => {
    e.stopPropagation();
    try {
      if (!loading) {
        await addToCart(productItem, quantity);
        toast.success(`${productItem?.name || "Product"} (Qty: ${quantity}) added to cart`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = (e, productItem) => {
    e.stopPropagation();
    navigate(`/checkout?product=${productItem._id}&quantity=${quantities[productItem._id] || 1}`);
  };

  const handleIncrement = (e, productId) => {
    e.stopPropagation();
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };

  const handleDecrement = (e, productId) => {
    e.stopPropagation();
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          {title}
        </h2>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((item) => {
          const quantity = quantities[item._id] || 1;
          const mainImage = item.images?.[0]?.url || FALLBACK_IMAGE;

          return (
            <motion.div
              key={item._id}
              initial={{ y: 0 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
              onClick={() => handleSinglePage(item._id)}
            >
              <div className="relative pt-[100%] bg-gray-100">
                <img
                  src={mainImage}
                  alt={item.name || "Product"}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  loading="lazy"
                />
                {item.salesCount > 0 && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {item.salesCount} sold
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-gray-800 font-medium mb-1 truncate">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2 h-10">
                  {item.description || "No description available"}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-orange-600">
                    Rs. {item.price?.toLocaleString() || "N/A"}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={(e) => handleDecrement(e, item._id)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-2 text-sm w-8 text-center">{quantity}</span>
                    <button
                      onClick={(e) => handleIncrement(e, item._id)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-1 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleCartClick(e, item, quantity)}
                      className="flex-1 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                      disabled={loading}
                    >
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleBuyNow(e, item)}
                      className="flex-1 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCard;
