import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        // Redirect to "/" if accessToken is not found
        navigate("/");
        setLoading(false);
        return;
      }

      try {
        // Fetch user info if accessToken is found
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/getUserInfo`,
          {
            headers: {
              Authorization: `${accessToken}`,
            },
          }
        );

        const { groups } = response.data;

        // Check the role and decide the redirect path
        if (groups.includes("customer")) {
          navigate("/");
        } else if (groups.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/unauthorized"); // Handle other roles
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/"); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-brown"></div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
