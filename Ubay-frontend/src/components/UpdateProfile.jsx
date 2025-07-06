import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../src/Services/api";
import { FaUpload } from "react-icons/fa";

const UpdateProfile = () => {
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);
  const [preview, setPreview] = useState(currentUser.avatar?.url);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await apiRequest.put(`/user/${currentUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      updateUser({
        ...currentUser,
        ...res.data.user,
      });
      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-navy-800 rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="flex flex-col items-start space-y-6">
                <div className="flex justify-between items-center w-full">
                  <h1 className="font-serif text-2xl font-bold text-orange-500 hover:text-orange-400 transition-colors">
                    Edit Profile
                  </h1>
                </div>

                <div className="w-full flex flex-col items-center">
                  <div className="mb-6 relative">
                    {preview ? (
                      <img
                        src={preview}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg hover:border-orange-400 transition duration-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-orange-500 shadow-lg flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <label
                        htmlFor="avatar-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-black rounded-md border border-orange-500 hover:bg-orange-500 hover:border-orange-400 transition-colors cursor-pointer"
                      >
                        <span>Upload </span>
                        <FaUpload className="ml-1" />
                      </label>
                      <input
                        type="file"
                        id="avatar-upload"
                        name="avatar"
                        accept="image/png/jpeg/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-6">
                  <div className="border-b border-navy-600 pb-4">
                    <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      defaultValue={currentUser.username}
                      className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-black placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="border-b border-navy-600 pb-4">
                    <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={currentUser.email}
                      className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-black placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="border-b border-navy-600 pb-4">
                    <label className="block text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-black placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                      placeholder="Enter new password"
                    />
                  </div>

                  {Error && <p className="text-orange-400">{Error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3 bg-orange-600 text-black font-medium rounded-lg hover:bg-orange-500 transition duration-200 shadow-md hover:shadow-lg ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
