import React, { useEffect, useState } from 'react'
import ProductCard from '../Card/ProductCard'
import { getAllProducts } from '../Services/api'

const Collection = () => {
  const [AllProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const fetchProducts = async()=>{

      try {
        setLoading(true)
        const res = await getAllProducts();
        setAllProducts(res);
      } catch (error) {
        console.error("Can't Load the Products", error)
      }finally{
        setLoading(false)
      }
    }
    fetchProducts();
  }, []);
  return (
    <div>
      <ProductCard products={AllProducts} title="All Products"/>
    </div>
  )
}

export default Collection
