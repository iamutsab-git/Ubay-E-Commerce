import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../Services/api";

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderForm, setOrderForm] = useState({ status: "" });
  const limit = 10;

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getAllOrders({ page: pageNum, limit });
      setOrders(res.data || res);
      setTotalPages(Math.ceil(res.total / limit) || 1);
    } catch (error) {
      toast.error(error.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e, orderId) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      setActionLoading((prev) => ({ ...prev, [orderId]: true }));

      const formattedStatus =
        orderForm.status.charAt(0).toUpperCase() +
        orderForm.status.slice(1).toLowerCase();

      await updateOrderStatus(orderId, formattedStatus);

      toast.success("Order status updated successfully");
      setOrderForm({ status: "" });
      setEditingOrderId(null);
      fetchOrders(page);
    } catch (error) {
      toast.error(error.message || "Error updating order status");
      console.error("Update error:", error.response?.data || error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleOrderDelete = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await deleteOrder(id);
      toast.success("Order deleted successfully");
      fetchOrders(page);
    } catch (error) {
      toast.error(error.message || "Error deleting order");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email &&
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    refunded: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Manage Orders</h3>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-1/4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Order #</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Customer</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Status</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">#{order._id.slice(-6)}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.user?.email || 'Unknown'}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">${order.totalPrice || order.amount || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {order.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {editingOrderId === order._id ? (
                        <form onSubmit={(e) => handleOrderSubmit(e, order._id)} className="flex items-center space-x-2">
                          <select
                            value={orderForm.status}
                            onChange={(e) => setOrderForm({ status: e.target.value })}
                            className="p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            type="submit"
                            className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 disabled:bg-blue-400 text-sm"
                            disabled={actionLoading[order._id]}
                          >
                            {actionLoading[order._id] ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingOrderId(null)}
                            className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingOrderId(order._id);
                              setOrderForm({ status: order.status || "pending" });
                            }}
                            className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 text-sm"
                          >
                            Edit Status
                          </button>
                          <button
                            onClick={() => handleOrderDelete(order._id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 text-sm"
                            disabled={actionLoading[order._id]}
                          >
                            {actionLoading[order._id] ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
  );
};

export default OrdersPanel;