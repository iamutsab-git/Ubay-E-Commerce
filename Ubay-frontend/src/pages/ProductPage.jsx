import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiRequest } from '../Services/api.js';
import ProductCard from '../Card/ProductCard';
import {toast }from 'react-toastify';
import { FaShoppingCart, FaStar, FaChevronLeft } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch main product
        const productRes = await apiRequest.get(`/product/${id}`);
        setProduct(productRes.data);
        
        // Fetch related products (same category)
        const relatedRes = await apiRequest.get(`/product?category=${productRes.data.category}&limit=4`);
        setRelatedProducts(relatedRes.data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await apiRequest.post('/cart', { productId: id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-white">Product not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-8"
        >
          <FaChevronLeft className="mr-2" /> Back to products
        </button>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product image */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={product.images?.url || `http://localhost:3000/api/${product.photo}`}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://sct.com.np/wp-content/uploads/2022/08/default-fallback-image.png';
              }}
            />
          </div>

          {/* Product details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {/* Rating and price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-500'} 
                  />
                ))}
                <span className="ml-2 text-gray-300">
                  ({product.numReviews || 0} reviews)
                </span>
              </div>
              <p className="text-2xl font-bold">Rs. {product.price}</p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-300">{product.description}</p>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Category:</span>
                <p className="capitalize">{product.category}</p>
              </div>
              <div>
                <span className="text-gray-400">Brand:</span>
                <p>{product.brand || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-gray-400">Availability:</span>
                <p>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
              </div>
              {product.salesCount && (
                <div>
                  <span className="text-gray-400">Popularity:</span>
                  <p>{product.salesCount} sold</p>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex items-center justify-center w-full py-3 px-6 rounded-lg font-medium ${
                product.stock <= 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <FaShoppingCart className="mr-2" />
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

     
      </div>
    </motion.div>
  );
};

export default ProductPage;