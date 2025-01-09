import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const StripePaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCalled = useRef(false); // Ref to track if the API has been called

  useEffect(() => {
    const handleCancellation = async () => {
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
          `${import.meta.env.VITE_BASE_URL}/api/pay/stripe-fail`,
          { params: { paymentId } }
        );

        if (!response.data.success) {
          toast.info(response.data.message || 'Payment cancelled.');
        } else {
          toast.error('Unexpected success response for a cancellation.');
        }

        navigate('/myappointments');
      } catch (error) {
        console.error('Error handling Stripe cancellation:', error);
        toast.error('Failed to handle payment cancellation.');
        navigate('/myappointments');
      }
    };

    handleCancellation();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-100 min-h-screen rounded-lg shadow-lg">
      <AiOutlineCloseCircle size={80} className="text-red-500 mb-4" />
      <h1 className="text-3xl font-semibold text-red-700">Payment Cancelled</h1>
      <p className="text-lg text-gray-600">
        Your payment was cancelled or could not be completed.
      </p>
    </div>
  );
};

export default StripePaymentCancelled;
