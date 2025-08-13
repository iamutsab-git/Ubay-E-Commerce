import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} from "../Services/api";

const ProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const limit = 10;

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    brand: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getAllProducts({ page: pageNum, limit });
      setProducts(res.data || res);
      setTotalPages(Math.ceil(res.total / limit) || 1);
    } catch (error) {
      toast.error(error.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!productForm.name.trim()) errors.name = "Name is required";
    if (!productForm.price) errors.price = "Price is required";
    if (isNaN(productForm.price)) errors.price = "Price must be a number";
    if (!productForm.stock) errors.stock = "Stock is required";
    if (isNaN(productForm.stock)) errors.stock = "Stock must be a number";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all form fields
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("description", productForm.description || "");
      formData.append("brand", productForm.brand || "");
      formData.append("category", productForm.category || "");

      // Append images if they exist
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (editingProductId) {
        await updateProduct(editingProductId, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }

      // Reset form
      resetForm();
      fetchProducts(page);
    } catch (error) {
      console.error("Product submission error:", error);
      
      let errorMessage = error.message || "Error saving product";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      price: "",
      description: "",
      stock: "",
      brand: "",
      category: "",
    });
    setImages([]);
    setImagePreviews([]);
    setEditingProductId(null);
    setFormErrors({});
  };

  const handleProductEdit = (product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      stock: product.stock || "",
      brand: product.brand || "",
      category: product.category || "",
    });
    setEditingProductId(product._id);
    setImages([]);
    setImagePreviews(product.images?.map((img) => img.url) || []);
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts(page);
    } catch (error) {
      toast.error(error.message || "Error deleting product");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error(`Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setImages([...images, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const fetchProductDetails = async (productId) => {
    if (!productId) return;
    try {
      setLoading(true);
      const data = await getProductDetails(productId);
      setSelectedProduct(data);
    } catch (error) {
      toast.error(error.message || "Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Products</h3>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading && !filteredProducts.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Name</th>
                      <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Price</th>
                      <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Stock</th>
                      <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{product.name}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">${product.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => fetchProductDetails(product._id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleProductEdit(product)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleProductDelete(product._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                              disabled={actionLoading[product._id]}
                            >
                              {actionLoading[product._id] ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={page === 1 || loading}
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={page === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow sticky top-4">
            <h4 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
              {editingProductId ? "Edit Product" : "Add New Product"}
            </h4>
            <form onSubmit={handleProductSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                      formErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-600'
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                        formErrors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-600'
                      } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      required
                      min="0"
                      step="0.01"
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                        formErrors.stock ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-600'
                      } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      required
                      min="0"
                    />
                    {formErrors.stock && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.stock}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Images (up to 4)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingProductId ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      editingProductId ? "Update Product" : "Add Product"
                    )}
                  </button>

                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Product Details</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Information</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium">Name:</span> {selectedProduct.name}</p>
                    <p><span className="font-medium">Price:</span> ${selectedProduct.price}</p>
                    <p><span className="font-medium">Stock:</span> {selectedProduct.stock}</p>
                    <p><span className="font-medium">Brand:</span> {selectedProduct.brand || "N/A"}</p>
                    <p><span className="font-medium">Category:</span> {selectedProduct.category || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedProduct.description || "No description available"}
                  </p>
                </div>
              </div>
              
              {selectedProduct.images?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProduct.images.map((img, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPanel;