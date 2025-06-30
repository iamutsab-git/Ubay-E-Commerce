import React, { useEffect, useState } from 'react';
import { getPopularProducts } from '../Services/api.js';
import ProductCard from '../Card/ProductCard.jsx';
import { motion } from 'framer-motion';

const popularProducts = () => {
  const [popularProduct, setpopularProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const popularProducts = async () => {
      try {
        const data = await getPopularProducts(8); // Get top 6
        setpopularProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    popularProducts();
  }, []);

  if (loading) return <div className="text-white">Loading popularProducts...</div>;

  return (
    <ProductCard 
      products={popularProduct}
      title="Most Popular Products"
    />
  );
};

export default popularProducts;