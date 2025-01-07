import React, { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const capturePayment = async () => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error('Payment token missing.');
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/pay/paypal-success?token=${token}`
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Payment successful!');
        navigate("/mypayments");
      } else {
        toast.error('Payment confirmation failed.');
        navigate("/myappointments");
      }
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      navigate("/myappointments");
    }
  };
  useEffect(() => {
    capturePayment();
  }, []); // Empty dependency array ensures this runs only once
  
  return (
    <div className="flex flex-col  items-center justify-center p-8 bg-green-100 min-h-screen rounded-lg shadow-lg">
    <AiOutlineCheckCircle size={80} className="text-green-500 mb-4" />
    <h1 className="text-3xl font-semibold text-green-700">Payment Successful!</h1>
    <p className="text-lg text-gray-600">Thank you for your payment.</p>
  </div>

  );
};

export default PaymentSuccess;
