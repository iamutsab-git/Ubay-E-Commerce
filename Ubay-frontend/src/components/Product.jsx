import React, { useEffect, useState } from 'react';
import { apiRequest } from '../Services/api';
import ProductCard from '../Card/ProductCard';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest.get('/product?limit=8'); // Fetch 8 products
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Product
