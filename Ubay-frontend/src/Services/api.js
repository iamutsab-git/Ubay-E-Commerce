import axios from "axios";


export const apiRequest = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});


export const getAllProducts = async () => {
  try {
    const res = await apiRequest.get("/product/");
    return res.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductDetails = async (id) => {
  try {
    const res = await apiRequest.get(`/product/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};
export const  getPopularProducts = async () => {
    try {
      const res = await apiRequest.get('/product/popular');
      return res.data;
    } catch (error) {
      throw new Error(error.res?.data?.message || 'Failed to fetch popular products');
    }
    
};

 export const searchProducts =async (query) => {
    try {
      const res = await apiRequest.get('/product/search', { 
        params: { q: query } 
      });
      return res.data;
    } catch (error) {
      throw new Error(error.res?.data?.message || 'Search failed');
    }
};

 // Create product (admin only)
  export const createProduct= async (productData) => {
    try {
      const res = await apiRequest.post('/product', productData);
      return res.data;
    } catch (error) {
      throw new Error(error.res?.data?.message || 'Product creation failed');
    }
  };

  // Update product (admin only)
  export const updateProduct= async (id, productData) => {
    try {
      const res = await apiRequest.put(`/product/${id}`, productData);
      return res.data;
    } catch (error) {
      throw new Error(error.res?.data?.message || 'Product update failed');
    }
  };

  // Delete product (admin only)
  export const deleteProduct =async (id) => {
    try {
      const res = await apiRequest.delete(`/product/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.res?.data?.message || 'Product deletion failed');
    }
  };

  // Upload product image
  export const uploadProductImage = async (productId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const res = await apiRequest.post(
        `/product/${productId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (error) {
      throw new Error(error.res?.data?.message || 'Image upload failed');
    }
  };