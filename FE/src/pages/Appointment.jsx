import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TimePicker from '../components/TimePicker';
const AppointmentModal = ({ show, onClose }) => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetTime, setResetTime] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Appointment Time:', appointmentTime);
    if (!appointmentDate || !appointmentTime) {
      toast.error('Please select both date and time!');
      resetFields();
      return;
    }
    const [hour, minute] = appointmentTime.split(':').map((t) => parseInt(t, 10));
  
    // Create a new Date object with the selected date and time
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hour, minute, 0, 0); // Set time for the selected appointment
  
    const currentDateTime = new Date();
  
    console.log('Current Time:', currentDateTime);
    console.log('Selected Appointment Time:', appointmentDateTime);
  
    if (appointmentDateTime <= currentDateTime) {
      toast.error("You cannot select a past time on today's date.");
      resetFields();
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/appointments/book`,
        { appointment_date: appointmentDateTime.toISOString() },
        {
          headers: {
            Authorization: `${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(response.data.message || 'Appointment booked successfully!');
      resetFields();
      setAppointmentDate('');
      setAppointmentTime('');
      onClose(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while booking.');
      resetFields();
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reset fields
  const resetFields = () => {
    setAppointmentDate('');
    setAppointmentTime('');
    setResetTime(true); 
      setTimeout(() => setResetTime(false), 0); 
  };  

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-brown bg-opacity-50 z-50">
      <div className="bg-cream m-2 w-full max-w-md p-6 rounded-lg shadow-lg sm:p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-coffee sm:text-lg md:text-xl lg:text-2xl">
            Book Appointment
          </h2>
          <button
            className="text-coffee hover:text-brown"
            onClick={() => {
              onClose(); // Close the modal
              resetFields(); // Reset fields
            }}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-coffee"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              className="mt-1 w-full p-2 border border-coffee rounded focus:outline-none focus:ring focus:ring-brown"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-coffee"
            >
              Time
            </label>
            {/* <select
              type="time"
              id="time"
              className="mt-1 w-full p-2 border border-coffee rounded focus:outline-none focus:ring focus:ring-brown"
              value={appointmentTime}
              onChange={(e) => {
                setAppointmentTime(e.target.value);
                // validateTime();
              }}
            >
               <option value="" disabled>Select Time</option>
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select> */}
        <TimePicker setAppointmentTime={setAppointmentTime} resetTime={resetTime} />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-coffee text-cream px-4 py-2 rounded hover:bg-brown disabled:opacity-50 sm:px-3 sm:py-1 md:px-4 md:py-2 lg:px-5 lg:py-2"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
