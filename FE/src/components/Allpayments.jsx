import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/pay/get-all-payments`,
        );
        setPayments(response.data.payments || []);
        console.log(response.data.payments);
      } catch (err) {
        console.error('Error fetching payments:', err);
        toast.error('Unable to fetch payments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brown"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-cream min-h-screen py-2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-4">
            {payments.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No payments found at this time.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {payments.map((payment) => (
                  <li key={payment.id} className="bg-cream p-2 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-brown">
                        Payment from {payment.User?.username} ({payment.User?.email}) for Appointment ID: {payment.appointment_id} on{' '}
                        {new Date(payment.Appointment?.appointment_date).toLocaleString('en-US')}
                      </span>
                      <span className="text-brown">£{payment.amount}</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Status: {payment.payment_status} | Method: {payment.payment_method || 'N/A'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPayments;
