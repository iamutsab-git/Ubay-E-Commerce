import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../Services/api';

const Login = () => {
   const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {updateUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const decodeToken=(token)=>{
      try {
        const payload = split(".")[1];
        const decode =atob(payload);
        return JSON.parse(decode)
      } catch (error) {
        console.error("error decoding  token",error);
        return null;
      }
    }
     const verifyAdmin = (userData) => {
      // Check if user data contains admin role
      if (userData.role === 'admin' || userData.isAdmin === true) {
        return true;
      }

      // If there's a token, decode it to check admin status
      if (userData.token) {
        const decodedToken = decodeToken(userData.token);
        if (decodedToken && (decodedToken.role === 'admin' || decodedToken.isAdmin === true)) {
          return true;
        }
      }

      return false;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
     
      const formData = new FormData(e.target);
       const email = formData.get("email");
       const password = formData.get("password");
  
      try {
        const res = await apiRequest.post("/auth/login", {
          email,
          password,
        });
        const userData = res.data.data;
        updateUser(res.data.data  )

        if (verifyAdmin(userData)) {
          console.log('Admin user detected, redirecting to dashboard');
          navigate("/admin/dashboard");
        } else {
          console.log('Regular user, redirecting to home');
          navigate("/");
        }

      } catch (error) {
        if (error.response && error.response.data) {
        setError(error.response.data.msg); // display server error message
      } else {
        setError("Something went wrong. Please try again.");
      }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Button - Added at the top */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-orange-600 hover:text-orange-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link 
            to="/signup" 
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                 
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
               
                  required
                 
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
          

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;