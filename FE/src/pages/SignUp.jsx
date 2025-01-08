import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const password = watch("password", ""); // Watch the password field
  const confirmPassword = watch("confirmPassword", ""); // Watch the confirmPassword field

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, data);
      toast.success("Sign Up Successful! Please check your email for the verification code.");
      navigate("/verify", { state: { username: data.username } }); // Redirect to Verify page with username
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign Up Failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check each password rule
  const checkRule = (rule) => (rule ? "text-green-600" : "text-gray-500");

  return (
    <div className="flex justify-center items-center min-h-screen bg-cream">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-coffee mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasNumber: (value) => /\d/.test(value) || "Password must include a number",
                  hasLowercase: (value) => /[a-z]/.test(value) || "Password must include a lowercase letter",
                  hasUppercase: (value) => /[A-Z]/.test(value) || "Password must include an uppercase letter",
                  hasSymbol: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must include a symbol",
                },
              })}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            {/* Display password rules only on focus */}
            {isPasswordFocused && (
              <div className="mt-2 space-y-1 text-sm">
                <p className={checkRule(password.length >= 8)}>
                  Password must be at least 8 characters
                </p>
                <p className={checkRule(/\d/.test(password))}>
                  Use a number
                </p>
                <p className={checkRule(/[a-z]/.test(password))}>
                  Use a lowercase letter
                </p>
                <p className={checkRule(/[A-Z]/.test(password))}>
                  Use an uppercase letter
                </p>
                <p className={checkRule(/[!@#$%^&*(),.?":{}|<>]/.test(password))}>
                  Use a symbol
                </p>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", { required: "Confirm Password is required" })}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  value="admin"
                  {...register("role", { required: "Role is required" })}
                  className="mx-2"
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  value="customer"
                  {...register("role", { required: "Role is required" })}
                   className="mx-2"
                />
                Customer
              </label>
            </div>
            {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown text-white py-2 rounded-lg hover:bg-coffee transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <a href="/signin" className="text-coffee font-semibold">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
