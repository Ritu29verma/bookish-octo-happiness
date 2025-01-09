import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/all`);
        setFeedbacks(response.data.messages);
      } catch (error) {
        toast.error('Failed to fetch feedbacks');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);

  

  return (
    <div className="bg-cream min-h-screen py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin-slow border-brown"></div>
        </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="text-center text-coffee">No feedbacks available.</div>
            ) : (
              feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-brown text-cream p-4 rounded-lg shadow-md hover:bg-coffee transition duration-300"
                >
                  <div className="justify-between items-center mb-2">
                    <span className="text-xs text-cream">{new Date(feedback.createdAt).toLocaleString()}</span>
                    <h3 className="text-lg font-semibold">{feedback.message}</h3>
                  </div>
                  <div className="text-cream text-sm">From: {feedback.name} {feedback.email}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
