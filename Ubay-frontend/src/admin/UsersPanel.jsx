import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllUsers, updateUserRole, deleteUser } from "../Services/api";

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ isAdmin: false });
  const limit = 10;

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getAllUsers({ page: pageNum, limit });
      setUsers(res.data || res);
      setTotalPages(Math.ceil(res.total / limit) || 1);
    } catch (error) {
      toast.error(error.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e, userId) => {
    e.preventDefault();
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));

      const response = await updateUserRole(
        userId,
        userForm.isAdmin === "true"
      );

      toast.success(response.message || "User role updated successfully");
      fetchUsers(page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
      setEditingUserId(null);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers(page);
    } catch (error) {
      toast.error(error.message || "Error deleting user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username &&
        user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Manage Users</h3>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
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
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Email</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Username</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Admin</th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.username || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.isAdmin ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {editingUserId === user._id ? (
                        <form onSubmit={(e) => handleUserSubmit(e, user._id)} className="flex items-center space-x-2">
                          <select
                            value={userForm.isAdmin?.toString()}
                            onChange={(e) => setUserForm({ isAdmin: e.target.value })}
                            className="p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          >
                            <option value="true">Admin</option>
                            <option value="false">User</option>
                          </select>
                          <button
                            type="submit"
                            className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 disabled:bg-blue-400 text-sm"
                            disabled={actionLoading[user._id]}
                          >
                            {actionLoading[user._id] ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 disabled:bg-gray-400 text-sm"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user._id);
                              setUserForm({ isAdmin: user.isAdmin.toString() });
                            }}
                            className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 text-sm"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() => handleUserDelete(user._id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 text-sm"
                            disabled={actionLoading[user._id]}
                          >
                            {actionLoading[user._id] ? "Deleting..." : "Delete"}
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

export default UsersPanel;