import axios from "axios";


export const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
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

export const getProductDetails = async (productId) => {
  try {
    const res = await apiRequest.get(`/product/${productId}`);
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

  // Order API functions
export const getAllOrders = async () => {
  try {
    const res = await apiRequest.get('/order');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await apiRequest.get(`/order/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await apiRequest.put(`/order/${id}/status`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

export const updateOrderToDelivered = async (id) => {
  try {
    const res = await apiRequest.put(`/order/${id}/deliver`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark order as delivered');
  }
};

export const deleteOrder = async (id) => {
  try {
    const res = await apiRequest.delete(`/order/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
};

// User API functions
export const getAllUsers = async () => {
  try {
    const res = await apiRequest.get('/user');
    return res.data.data; // Matches your response structure { success, count, data }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

export const getUserById = async (id) => {
  try {
    const res = await apiRequest.get(`/user/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

export const updateUserProfile = async (id, userData) => {
  try {
    const formData = new FormData();
    
    // Append simple fields
    if (userData.email) formData.append('email', userData.email);
    if (userData.username) formData.append('username', userData.username);
    if (userData.password) formData.append('password', userData.password);
    
    // Append avatar file if exists
    if (userData.avatarFile) {
      formData.append('avatar', userData.avatarFile);
    }

    const res = await apiRequest.put(`/user/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.user; // Matches your response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user profile');
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await apiRequest.delete(`/user/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Admin-specific user management
export const updateUserAsAdmin = async (id, userData) => {
  try {
    const res = await apiRequest.put(`/admin/user/${id}`, userData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const createUserAsAdmin = async (userData) => {
  try {
    const res = await apiRequest.post('/admin/user', userData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};