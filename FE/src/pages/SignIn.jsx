import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signin`, data);

      // Save the token and refresh token in session storage
      sessionStorage.setItem("accessToken", response.data.token);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);

      toast.success("Sign In Successful!");
      navigate("/"); // Redirect to home page
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Sign In Failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    <div className="flex justify-center items-center min-h-screen bg-cream">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-coffee mb-6">Sign In</h1>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={passwordVisible}
                onChange={() => setPasswordVisible(!passwordVisible)}
                className="h-4 w-4 text-coffee border-gray-300 rounded focus:ring focus:ring-coffee"
              />
              <span>Show Password</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown text-white py-2 rounded-lg hover:bg-coffee transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          
        </form>

        <button
           // Change the type to button
          onClick={() => (window.location.href = `${import.meta.env.VITE_BASE_URL}/api/auth/google`)}
          className="w-full flex items-center justify-center border border-gray-400 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition mt-4"
        >
          <img
            src="https://w7.pngwing.com/pngs/882/225/png-transparent-google-logo-google-logo-google-search-icon-google-text-logo-business-thumbnail.png"
            alt="Google Icon"
            className="w-5 h-5 mr-2"
          />
          Sign In with Google
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-coffee font-semibold">Sign Up</a>
        </p>
      </div>
    </div>
    </>
  );
};

export default SignIn;
