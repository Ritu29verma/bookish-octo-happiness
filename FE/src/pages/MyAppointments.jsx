import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGatewayDialog, setShowGatewayDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      setError('Access token is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/myappointments`,
        {
          headers: { Authorization: token },
        }
      );

      setAppointments(response.data.appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Unable to fetch appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const initiateStripePayment = async (appointmentId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/pay/init-stripe`,
        { appointment_id: appointmentId },
        {
          headers: { Authorization: `${token}` },
        }
      );
  
      const { url } = response.data;
  
      if (url) {
        // Redirect the user to the Stripe Checkout page
        window.location.href = url;
      } else {
        toast.error('Failed to get Stripe checkout URL.');
      }
    } catch (error) {
      console.error('Error initiating Stripe payment:', error);
      toast.error('Failed to initiate Stripe payment. Please try again.');
    }
  };
  

  const initiateRazorpayPayment = async (appointmentId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/pay/init-payment`,
        { appointment_id: appointmentId },
        {
          headers: { Authorization: `${token}` },
        }
      );

      const { paymentId, orderId, amount } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'GBP',
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.patch(
              `${import.meta.env.VITE_BASE_URL}/api/pay/update-payment-status`,
              {
                payment_id: paymentId,
                appointment_id: appointmentId,
                razorpay_payment_id: response.razorpay_payment_id,
              }
            );
            fetchAppointments();
            toast.success('Payment successful!');
          } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Payment succeeded, but failed to update status. Please contact support.');
          }
        },
        prefill: {
          name: 'Owner',
          email: 'Owner@gmail.com',
          contact: 'xxxxxxxxxx',
        },
        theme: {
          color: '#5C3D2E',
        },
        modal: {
          ondismiss: async () => {
            try {
              await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/api/pay/set-payment-failed`,
                { payment_id: paymentId }
              );
              toast.warning('Payment was not completed. Status updated to failed.');
            } catch (error) {
              console.error('Error updating failed payment status:', error);
              toast.error('Failed to update payment status. Please contact support.');
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      toast.error('Failed to initiate Razorpay payment. Please try again.');
    }
  };

  const initiatePayPalPayment = async (appointmentId) => {
    try {
      // Retrieve the token from session storage
      const token = sessionStorage.getItem('accessToken');
  
      // Make the POST request to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/pay/init-paypal`,
        { 
          appointment_id: appointmentId // Pass the appointment ID as required by the backend 
        },
        {
          headers: { 
            Authorization: `${token}` // Use Bearer token format for Authorization header
          },
        }
      );
  
      // Extract the PayPal approval URL from the response
      const { approvalUrl } = response.data;
  
      if (approvalUrl) {
        // Redirect the user to PayPal for payment approval
        window.location.href = approvalUrl;
      } else {
        // Show error toast if approval URL is not received
        toast.error('Failed to get PayPal approval URL.');
      }
    } catch (error) {
      // Log the error and show an error toast
      console.error('Error initiating PayPal payment:', error);
      toast.error('Failed to initiate PayPal payment. Please try again.');
    }
  };
  

  const handlePayment = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowGatewayDialog(true);
  };

  const handleGatewaySelection = (gateway) => {
    setShowGatewayDialog(false);
    if (gateway === 'razorpay') {
      initiateRazorpayPayment(selectedAppointment);
    } else if (gateway === 'paypal') {
      initiatePayPalPayment(selectedAppointment);
    } else if (gateway === 'stripe') {
      initiateStripePayment(selectedAppointment);
    }
  };
  

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-brown"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <>
      <Header />
      <div className="bg-cream mt-16 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-coffee mb-6">My Appointments</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-brown mb-4">Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500">No appointments yet</p>
            ) : (
              <ul className="space-y-4">
                {appointments.map((appointment, index) => (
                  <li
                    key={index}
                    className="bg-cream p-4 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="text-coffee block">
                        Appointment ID: {appointment.id}  on{' '}
                        {new Date(appointment.appointment_date).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                      <small className="text-gray-500">
                        Created at:{' '}
                        {new Date(appointment.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </small>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className={`${getStatusColor(appointment.status)} text-white px-4 py-1 rounded-lg`}
                      >
                        {appointment.status}
                      </button>
                      {appointment.status === 'confirmed' && (
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                          onClick={() => handlePayment(appointment.id)}
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
      </div>

      {showGatewayDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Select Payment Gateway</h2>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleGatewaySelection('razorpay')}
              >
                Razorpay
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleGatewaySelection('paypal')}
              >
                PayPal
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleGatewaySelection('stripe')}
              >
                Stripe
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default MyAppointments;
