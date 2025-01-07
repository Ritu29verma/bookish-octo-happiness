// homepage.jsx
import React, { useState,useEffect }from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import image from '../assets/1.jpg';
import icon3 from '../assets/icon3.png'
import icon2 from '../assets/icon2.png'
import icon1 from '../assets/icon1.png'
import ContactUs from '../components/ContactUs';
import AppointmentModal from './Appointment';
import { Navigate,useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#contact') {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    if (location.hash === '#services') {
      document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const handleBookNowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
<div className="bg-coffee min-h-screen flex flex-col">
  <Header />

  {/* Hero Section */}
  <section className="bg-white text-coffee py-36 text-left flex flex-wrap items-center">
    <div className="w-full lg:w-1/2 px-6 lg:pl-24 lg:pr-12">
      <h1 className="text-5xl font-bold mb-6">
      Effortless Online Appointments,<span className="text-brown"> Anytime! </span>
      </h1>
      <p className="text-lg mb-8">
        Schedule your barbershop appointment 24/7 with just a few clicks!
      </p>
      <div className="space-x-4">
      <button
              onClick={handleBookNowClick}
              className="bg-brown text-cream py-3 px-6 rounded-lg"
            >
              Book Now
             
            </button>
        <button className="bg-cream text-coffee py-3 px-6 rounded-lg"
         onClick={() => navigate('/aboutus')}>
          Explore Services
        </button>
      </div>
    </div>
    <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
      <img
        src={image}
        alt="Hero Image"
        className="w-4/5 max-w-md lg:max-w-lg"
      />
    </div>
  </section>

   {/* Features Section */}
   <section id='services'>
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 ">
          <Card 
            icon="📅" 
            title="24/7 Booking System" 
            description="Book appointments anytime, anywhere." 
            
          />
          <Card 
            icon="🔒" 
            title="Secure Payments" 
            description="Multiple payment options with encryption." 
          />
          <Card 
            icon="🔔" 
            title="Notifications & Reminders" 
            description="Never miss your appointment." 
          />
          {/* <Card 
            icon="📊" 
            title="User-Friendly Dashboard" 
            description="Manage bookings and payments easily." 
          /> */}
          <Card 
            icon="⚡" 
            title="Fast and Reliable" 
            description="Optimized for performance and scalability." 
          />
        </div>
      </section>

     

      {/* How It Works Section */}
      <section className=" py-10 my-20 rounded-lg shadow-2xl w-4/5 mx-auto flex items-center justify-center
       h-4/5 border-t-[2px] border-l-[2px] border-white/50 bg-white/25 overflow-hidden backdrop-blur-sm
      ">
  <div className="container text-center px-4">
    {/* Section Title */}
    <h2 className="text-cream text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
    <p className="text-cream text-base md:text-lg mb-12">
      You control the user experience & we handle the backend.
    </p>

    {/* Features Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Step 1 */}
      <div className="flex flex-col items-center text-center">
        <img
          src={icon1} 
          alt="Sign Up"
        />
        <h3 className="text-cream text-xl font-semibold ">Sign Up</h3>
        <p className="text-cream text-sm md:text-base">
          Create your account in seconds.
        </p>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center text-center">
        <img
          src={icon2} 
          alt="Book Appointment"
        />
        <h3 className="text-cream text-xl font-semibold ">
          Book Appointment
        </h3>
        <p className="text-cream text-sm md:text-base">
          Choose your time and services.
        </p>
      </div>

      {/* Step 3 */}
      <div className="flex flex-col items-center text-center">
        <img
          src={icon3} 
          alt="Get Notified"
        />
        <h3 className="text-cream text-xl font-semibold ">Get Notified</h3>
        <p className="text-cream text-sm md:text-base">
          Receive reminders and updates.
        </p>
      </div>
    </div>
  </div>
</section>


<ContactUs/>
      <Footer />

      <AppointmentModal show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default HomePage;
