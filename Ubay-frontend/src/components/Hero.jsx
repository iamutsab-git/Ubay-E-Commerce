import heroBackground from "../assets/Ubay-hero-master.png";
import ProductCard from "../Card/ProductCard";
import React, { useState, useEffect } from "react";
import { getAllProducts } from "../Services/api";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const popular = await getAllProducts();
        setPopularProducts(popular);
      } catch (error) {
        setError(error.message || "Failed to load products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);


  return (
    <div>
      <section className="relative h-[50vh]  md:h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
         
        ><img
        src={heroBackground}
        alt="Hero Background"
       className="absolute inset-0 w-full h-full object-cover object-center"/>
          {/* Content Overlay */}
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Welcome to Ubay
              </h1>
              <p className="text-xl text-white mb-8 drop-shadow-md">
                Seamless Shopping, Anytime, Anywhere
              </p>
              <button
              onClick={()=>navigate("/collection")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-xl"
                aria-label="Explore products now"
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>
        
      </section>
        {/* Styled Product Card Section */}
      <div className="bg-gray-100 sm:px-6 lg:px-8">
        <ProductCard   products={popularProducts}  title="Popular Products" />
        <ProductCard   products={popularProducts}  title="Popular Products" />
        <ProductCard   products={popularProducts}  title="Popular Products" />
      </div>
    </div>
  );
};

export default Hero;