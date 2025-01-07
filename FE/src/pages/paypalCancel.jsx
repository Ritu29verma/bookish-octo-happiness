// src/pages/PaymentCancelled.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCancellation = async () => {
      const paymentId = searchParams.get('paymentId'); // Extract the payment ID from query params

      if (!paymentId) {
        toast.error('Payment ID missing.');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/pay/paypal-fail`,
          { params: { paymentId } }
        );
        if (!response.data.success) {
          toast.info(response.data.message || 'Payment cancelled.');
        } else {
          toast.error('Unexpected success response for a cancellation.');
        }
      } catch (error) {
        console.error('Error handling PayPal cancellation:', error);
        toast.error('Failed to handle payment cancellation.');
      }
    };

    handleCancellation();
  }, [searchParams]);

  return (
    <div className="payment-cancelled">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <AiOutlineCloseCircle size={80} color="red" />
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled or could not be completed.</p>
      </div>
    </div>
  );
};

export default PaymentCancelled;
