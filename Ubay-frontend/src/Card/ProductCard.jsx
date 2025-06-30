import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProductCard = ({ product, products, title }) => {
  const navigate = useNavigate();
  const BASE_IMAGE_URL = "http://localhost:3000/";
  const FALLBACK_IMAGE =
    "https://sct.com.np/wp-content/uploads/2022/08/default-fallback-image.png";

  const productList = product ? [product] : products;
  console.log("ProductCard productList:", productList); // Debug

  if (!productList?.length) return <div>No products available</div>;

  const cardVariants = {
    hover: {
      scale: 1.05,
      zIndex: 10,
      transition: { duration: 0.2 },
    },
    initial: { scale: 1 },
  };

  const handleSinglePage = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCartClick = async (e, productItem) => {
    e.stopPropagation();
    try {
      toast.success(`${productItem.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      {title && (
        <h2 className="text-2xl font-bold text-orange-600 mb-2 px-4">{title}</h2>
      )}
      <div className="flex flex-wrap gap-2 pb-2 px-2">
        {productList.map((item) => (
          <motion.div
            key={item._id}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="flex-none w-56 relative h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer bg-gray-800 border border-orange-500/30"
            onClick={() => handleSinglePage(item._id)}
          >
            <img
              src={
                item.images?.url
                  ? item.images.url
                  : item.photo
                  ? `${BASE_IMAGE_URL}${item.photo}`
                  : FALLBACK_IMAGE
              }
              alt={item.name || item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4"
            >
              <h3 className="text-white font-bold truncate">
                {item.name || item.title}
              </h3>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                {item.description || item.overview || "No description"}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-orange-400 font-bold">
                  Rs: {item.price || "???"}
                </span>
                {item.salesCount && (
                  <span className="text-orange-300 text-xs">
                    {item.salesCount} sold
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleCartClick(e, item)}
                className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
              >
                Add to Cart
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductCard;