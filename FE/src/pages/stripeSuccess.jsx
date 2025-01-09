import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const StripePaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCalled = useRef(false); // Ref to track if the API has been called

  useEffect(() => {
    const capturePayment = async () => {
      if (isCalled.current) return; // Prevent duplicate calls
      isCalled.current = true;

      const paymentId = searchParams.get('paymentId'); // Extract the payment ID from query params

      if (!paymentId) {
        toast.error('Payment ID missing.');
        navigate('/myappointments');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/pay/stripe-success`,
          { params: { paymentId } }
        );

        if (response.data.success) {
          toast.success(response.data.message || 'Payment successful!');
          navigate('/mypayments');
        } else {
          toast.error('Payment confirmation failed.');
          navigate('/myappointments');
        }
      } catch (error) {
        console.error('Error capturing Stripe payment:', error);
        navigate('/myappointments');
      }
    };

    capturePayment();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-green-100 min-h-screen rounded-lg shadow-lg">
      <AiOutlineCheckCircle size={80} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-semibold text-green-700">Payment Successful!</h1>
      <p className="text-lg text-gray-600">Thank you for your payment.</p>
    </div>
  );
};

export default StripePaymentSuccess;
