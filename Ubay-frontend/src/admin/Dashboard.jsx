import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getPopularProducts,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../Services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState({ users: 1, products: 1, orders: 1 });
  const [totalPages, setTotalPages] = useState({
    users: 1,
    products: 1,
    orders: 1,
  });
  const limit = 10;

  // Product form state
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
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Order form state
  const [orderForm, setOrderForm] = useState({ status: "" });
  const [editingOrderId, setEditingOrderId] = useState(null);

  // User form state
  const [userForm, setUserForm] = useState({ isAdmin: false });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (activeSection === "orders") fetchOrders(page.orders);
    else if (activeSection === "products") fetchProducts(page.products);
    else if (activeSection === "users") fetchUsers(page.users);
  }, [page, activeSection]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const [usersRes, ordersRes, productsRes, popularRes] = await Promise.all([
        getAllUsers({ page: 1, limit: 5 }),
        getAllOrders({ page: 1, limit: 5 }),
        getAllProducts({ page: 1, limit: 5 }),
        getPopularProducts(),
      ]);
      setStats({
        users: usersRes.total || usersRes.length,
        orders: ordersRes.total || ordersRes.length,
        products: productsRes.total || productsRes.length,
      });
      setRecentOrders(ordersRes.data || ordersRes);
      setPopularProducts(popularRes);
      setUsers(usersRes.data || usersRes);
      setProducts(productsRes.data || productsRes);
      setOrders(ordersRes.data || ordersRes);
      setTotalPages({
        users: Math.ceil(usersRes.total / limit) || 1,
        products: Math.ceil(productsRes.total / limit) || 1,
        orders: Math.ceil(ordersRes.total / limit) || 1,
      });
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getAllUsers({ page: pageNum, limit });
      setUsers(res.data || res);
      setTotalPages((prev) => ({
        ...prev,
        users: Math.ceil(res.total / limit) || 1,
      }));
    } catch (error) {
      toast.error(error.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getAllProducts({ page: pageNum, limit });
      setProducts(res.data || res);
      setTotalPages((prev) => ({
        ...prev,
        products: Math.ceil(res.total / limit) || 1,
      }));
    } catch (error) {
      toast.error(error.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getAllOrders({ page: pageNum, limit });
      setOrders(res.data || res);
      setTotalPages((prev) => ({
        ...prev,
        orders: Math.ceil(res.total / limit) || 1,
      }));
    } catch (error) {
      toast.error(error.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (section, newPage) => {
    if (newPage >= 1 && newPage <= totalPages[section]) {
      setPage((prev) => ({ ...prev, [section]: newPage }));
    }
  };

  // Product Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      if (productForm.description)
        formData.append("description", productForm.description);
      if (productForm.brand) formData.append("brand", productForm.brand);
      if (productForm.category)
        formData.append("category", productForm.category);
      images.forEach((image) => formData.append("images", image));

      let product;
      if (editingProductId) {
        product = await updateProduct(editingProductId, formData);
        toast.success("Product updated successfully");
      } else {
        product = await createProduct(formData);
        toast.success("Product created successfully");
      }

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
      fetchProducts(page.products);
    } catch (error) {
      toast.error(error.message || "Error saving product");
    } finally {
      setLoading(false);
    }
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
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts(page.products);
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

  // Order Handlers
  const handleOrderSubmit = async (e, orderId) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      setActionLoading((prev) => ({ ...prev, [orderId]: true }));

      // Ensure status is properly formatted
      const formattedStatus =
        orderForm.status.charAt(0).toUpperCase() +
        orderForm.status.slice(1).toLowerCase();

      await updateOrderStatus(orderId, formattedStatus);

      toast.success("Order status updated successfully");
      setOrderForm({ status: "" });
      setEditingOrderId(null);
      fetchOrders(page.orders);
    } catch (error) {
      toast.error(error.message || "Error updating order status");
      console.error("Update error:", error.response?.data || error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleOrderEdit = (order) => {
    setOrderForm({ status: order.status || "pending" });
    setEditingOrderId(order._id);
  };

  const handleOrderDelete = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await deleteOrder(id);
      toast.success("Order deleted successfully");
      fetchOrders(page.orders);
    } catch (error) {
      toast.error(error.message || "Error deleting order");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // User Handlers
  const handleUserSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));

      const response = await updateUserRole(
        userId,
        userForm.isAdmin === "true" // Convert to boolean
      );

      toast.success(response.message || "User role updated successfully");
      fetchUsers(page.users);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
      setEditingUserId(null);
    }
  };
  const handleUserEdit = (user) => {
    setUserForm({ isAdmin: user.isAdmin ? "true" : "false" });
    setEditingUserId(user._id);
  };

  const handleUserDelete = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers(page.users);
    } catch (error) {
      toast.error(error.message || "Error deleting user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredData = (data, type) => {
    return data.filter((item) => {
      if (type === "orders") {
        const matchesSearch =
          searchQuery === "" ||
          item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.customer &&
            item.customer.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus =
          statusFilter === "" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }
      if (type === "products") {
        return (
          searchQuery === "" ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      if (type === "users") {
        return (
          searchQuery === "" ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.username &&
            item.username.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      return true;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
      {loading && !activeSection ? (
        <div className="col-span-3 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <>
          {!activeSection ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveSection("users")}
              >
                <h2 className="text-xl font-semibold text-gray-800">Users</h2>
                <p className="text-3xl text-blue-600">{stats.users}</p>
                <p className="text-gray-600 mt-2">Recent Users:</p>
                {users.slice(0, 3).map((user) => (
                  <p key={user._id} className="text-sm text-gray-500">
                    {user.email}
                  </p>
                ))}
              </div>
              <div
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveSection("products")}
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Products
                </h2>
                <p className="text-3xl text-blue-600">{stats.products}</p>
                <p className="text-gray-600 mt-2">Popular Products:</p>
                {popularProducts.slice(0, 3).map((product) => (
                  <p key={product._id} className="text-sm text-gray-500">
                    {product.name}
                  </p>
                ))}
              </div>
              <div
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveSection("orders")}
              >
                <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
                <p className="text-3xl text-blue-600">{stats.orders}</p>
                <p className="text-gray-600 mt-2">Recent Orders:</p>
                {recentOrders.slice(0, 3).map((order) => (
                  <p key={order._id} className="text-sm text-gray-500">
                    Order #{order._id}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setActiveSection(null)}
                className="mb-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Back to Summary
              </button>
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={`Search ${activeSection}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {activeSection === "orders" && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-1/4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                )}
              </div>
              {activeSection === "users" && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Manage Users</h3>
                  {loading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredData(users, "users").map((user) => (
                          <div
                            key={user._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1"
                          >
                            <p className="text-gray-600">
                              <strong>Email:</strong> {user.email}
                            </p>
                            <p className="text-gray-600">
                              <strong>Username:</strong>{" "}
                              {user.username || "N/A"}
                            </p>
                            <p className="text-gray-600">
                              <strong>Admin:</strong>{" "}
                              {user.isAdmin ? "Yes" : "No"}
                            </p>

                            {editingUserId === user._id ? (
                              <form
                                onSubmit={(e) => handleUserSubmit(e, user._id)}
                                className="mt-4"
                              >
                                <div className="mb-4">
                                  <label className="block text-gray-700">
                                    Admin Status
                                  </label>
                                  <select
                                    value={userForm.isAdmin?.toString()} // Ensure string value
                                    onChange={(e) =>
                                      setUserForm({ isAdmin: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                  >
                                    <option value="">Select Status</option>
                                    <option value="true">Admin</option>
                                    <option value="false">User</option>
                                  </select>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                                    disabled={actionLoading[user._id]}
                                  >
                                    {actionLoading[user._id] ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
                                    ) : (
                                      "Update Admin Status"
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingUserId(null)}
                                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
                                    disabled={actionLoading[user._id]}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUserDelete(user._id)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-red-400"
                                    disabled={actionLoading[user._id]}
                                  >
                                    {actionLoading[user._id] ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
                                    ) : (
                                      "Delete"
                                    )}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingUserId(user._id); // Set the correct user ID to edit
                                    setUserForm({
                                      isAdmin: user.isAdmin.toString(),
                                    }); // Initialize form with current value
                                  }}
                                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                                >
                                  Edit Role
                                </button>
                                <button
                                  onClick={() => handleUserDelete(user._id)}
                                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-center gap-4">
                        <button
                          onClick={() =>
                            handlePageChange("users", page.users - 1)
                          }
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                          disabled={page.users === 1 || loading}
                        >
                          Previous
                        </button>
                        <span className="text-gray-800">
                          Page {page.users} of {totalPages.users}
                        </span>
                        <button
                          onClick={() =>
                            handlePageChange("users", page.users + 1)
                          }
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                          disabled={page.users === totalPages.users || loading}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeSection === "products" && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Manage Products</h3>
                  <form
                    onSubmit={handleProductSubmit}
                    className="mb-6 bg-white p-4 rounded-lg shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Price</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              price: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Description
                        </label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Stock</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              stock: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Brand</label>
                        <input
                          type="text"
                          value={productForm.brand}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              brand: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <input
                          type="text"
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Images (up to 4)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="w-full p-2 border rounded"
                          name="images"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : editingProductId
                        ? "Update Product"
                        : "Add Product"}
                    </button>
                  </form>
                  {selectedProduct && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow">
                      <h3 className="text-xl font-bold mb-2">
                        Product Details
                      </h3>
                      <p>
                        <strong>Name:</strong> {selectedProduct.name}
                      </p>
                      <p>
                        <strong>Price:</strong> ${selectedProduct.price}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedProduct.description || "N/A"}
                      </p>
                      <p>
                        <strong>Stock:</strong> {selectedProduct.stock}
                      </p>
                      <p>
                        <strong>Brand:</strong> {selectedProduct.brand || "N/A"}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {selectedProduct.category || "N/A"}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProduct.images?.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
                            alt="Product"
                            className="h-20 w-20 object-cover rounded"
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                      >
                        Close
                      </button>
                    </div>
                  )}
                  {loading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredData(products, "products").map((product) => (
                          <div
                            key={product._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1"
                          >
                            <p className="text-gray-600">
                              <strong>Name:</strong> {product.name}
                            </p>
                            <p className="text-gray-600">
                              <strong>Price:</strong> ${product.price}
                            </p>
                            <p className="text-gray-600">
                              <strong>Stock:</strong> {product.stock}
                            </p>
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => fetchProductDetails(product._id)}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-400"
                                disabled={actionLoading[product._id]}
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleProductEdit(product)}
                                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 disabled:bg-yellow-400"
                                disabled={actionLoading[product._id]}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleProductDelete(product._id)}
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-red-400"
                                disabled={actionLoading[product._id]}
                              >
                                {actionLoading[product._id] ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
                                ) : (
                                  "Delete"
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-center gap-4">
                        <button
                          onClick={() =>
                            handlePageChange("products", page.products - 1)
                          }
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                          disabled={page.products === 1 || loading}
                        >
                          Previous
                        </button>
                        <span className="text-gray-800">
                          Page {page.products} of {totalPages.products}
                        </span>
                        <button
                          onClick={() =>
                            handlePageChange("products", page.products + 1)
                          }
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                          disabled={
                            page.products === totalPages.products || loading
                          }
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeSection === "orders" && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Manage Orders</h3>
                  {loading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredData(orders, "orders").map((order) => (
                          <div
                            key={order._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1"
                          >
                            <p className="text-gray-600">
                              <strong>Order #:</strong> {order._id}
                            </p>
                            <p className="text-gray-600">
                              <strong>Customer:</strong>{" "}
                              {order.user.email || "N/A"}
                            </p>
                            <p className="text-gray-600">
                              <strong>Amount:</strong> $
                              {order.totalPrice || order.amount || "N/A"}
                            </p>
                            <p className="text-gray-600">
                              <strong>Status:</strong> {order.status || "N/A"}
                            </p>
                            {editingOrderId === order._id ? (
                              <form
                                onSubmit={(e) =>
                                  handleOrderSubmit(e, order._id)
                                }
                                className="mt-4"
                              >
                                <div className="mb-4">
                                  <label className="block text-gray-700">
                                    Update Status
                                  </label>
                                  <select
                                    value={orderForm.status}
                                    onChange={(e) =>
                                      setOrderForm({ status: e.target.value })
                                    }
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    required
                                  >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">
                                      Processing
                                    </option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                                    disabled={actionLoading[order._id]}
                                  >
                                    {actionLoading[order._id] ? (
                                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
                                    ) : (
                                      "Update Status"
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingOrderId(null)}
                                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
                                    disabled={actionLoading[order._id]}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => handleOrderEdit(order)}
                                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 disabled:bg-yellow-400"
                                  disabled={actionLoading[order._id]}
                                >
                                  Edit Status
                                </button>
                                <button
                                  onClick={() => handleOrderDelete(order._id)}
                                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-red-400"
                                  disabled={actionLoading[order._id]}
                                >
                                  {actionLoading[order._id] ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
                                  ) : (
                                    "Delete"
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-center gap-4">
                        <button
                          onClick={() =>
                            handlePageChange("orders", page.orders - 1)
                          }
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                          disabled={page.orders === 1 || loading}
                        >
                          Previous
                        </button>
                        <span className="text-gray-800">
                          Page {page.orders} of {totalPages.orders}
                        </span>
                        <button
                          onClick={() =>
                            handlePageChange("orders", page.orders + 1)
                          }
                          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                          disabled={
                            page.orders === totalPages.orders || loading
                          }
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard ;
