import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const username = location.state?.username;

  const handleVerify = async () => {
    if (!username) {
      toast.error("Username is missing. Please go back and sign up again.");
      return;
    }
    try {
      setLoading(true);
      console.log(verificationCode);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/confirm`, {
        username,
        confirmationCode: verificationCode,
      });
      toast.success("Verification Successful! Please log in.");
      navigate("/signin"); 
      console.log(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Verification Failed";
      toast.error(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cream">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-coffee mb-6">Verify Account</h1>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-coffee focus:outline-none"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-brown text-white py-2 rounded-lg hover:bg-coffee transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
        <p className="text-sm text-center mt-4">
          Didn't receive a code?{" "}
          <button
            onClick={async () => {
              try {
                setLoading(true);
                await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/resend-code`, { username });
                toast.success("Verification code resent successfully!");
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to resend code");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="text-coffee font-semibold hover:underline"
          >
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};

export default Verify;
