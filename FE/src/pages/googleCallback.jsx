import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Callback = () => {
  const navigate = useNavigate();
  const apiCalledRef = useRef(false); // Ref to track if API has been called

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !apiCalledRef.current) { // Check if code exists and API hasn't been called
      apiCalledRef.current = true; // Mark the API as called
      handleGoogleCallback(code);
    } else if (!code) {
      console.error("Authorization code not found in URL");
      navigate("/");
    }
  }, [navigate]); // Dependency only includes navigate

  const handleGoogleCallback = async (code) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/callback`,
        { code }
      );

      if (response.status === 200 && response.data?.token) {
        // Save tokens and navigate
        const { token, refreshToken } = response.data;
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("refreshToken", refreshToken);
        navigate("/");
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during Google callback.";
      toast.error(errorMessage);
      console.error("Error during Google callback:", error);

      if (error.response?.status === 404) {
        navigate("/");
      } else if (error.response?.status === 400) {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Processing your login...
        </h1>
        <p className="text-gray-600">
          Please wait while we process your authentication.
        </p>
      </div>
    </div>
  );
};

export default Callback;
