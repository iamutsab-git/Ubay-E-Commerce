import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../Services/api";
import { Link, useNavigate } from "react-router-dom";


const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle avatar error if image fails to load
  const [avatarError, setAvatarError] = useState(false);
  
  const logout = async () => {
    try {
      setLoading(true);
      const res = await apiRequest.post("/auth/logout");
      
     
        setCurrentUser(null);
        navigate("/");

    } catch (error) {
      console.error("Logout error:", error);
      setError(error.response?.data?.message || "An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);


  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex flex-col items-start space-y-6">
            {/* Header with logout button */}
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-bold text-orange-600">My Profile</h1>
              <button
                onClick={logout}
                disabled={loading}
                className={`px-4 py-2 bg-orange-600 text-white font-medium rounded-lg transition duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-700'
                }`}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Avatar section */}
            <div className="w-full flex flex-col items-center">
              <div className="mb-6 relative">
                <img
                  src={currentUser.avatar || "https://images.icon-icons.com/3446/PNG/512/account_profile_user_avatar_icon_219236.png" }
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md hover:border-red-500 transition duration-200"
                  onError={() => setAvatarError(true)}
                />
              </div>
            </div>

            {/* User info */}
            <div className="w-full space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </h2>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {currentUser.username || "Not set"}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </h2>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {currentUser.email}
                </p>
              </div>

              {/* Additional e-commerce specific fields */}
              {currentUser.phone && (
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </h2>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    {currentUser.phone}
                  </p>
                </div>
              )}

              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </h2>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                to="/edit-profile"
                className="flex-1 text-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition duration-200"
              >
                Edit Profile
              </Link>
              <Link
                to="/orders"
                className="flex-1 text-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-green-700 transition duration-200"
              >
                My Orders
              </Link>
            </div>

            {/* Additional e-commerce links */}
            <div className="w-full mt-4 space-y-2">
              <Link 
                to="/wishlist" 
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                My Wishlist
              </Link>
              <Link 
                to="/addresses" 
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                Saved Addresses
              </Link>
              <Link 
                to="/payment-methods" 
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                Payment Methods
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;