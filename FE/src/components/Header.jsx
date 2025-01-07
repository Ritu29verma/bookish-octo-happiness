import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import MyAppointments from "../pages/MyAppointments";

const Header = () => {
  const [scrolling, setScrolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem("accessToken"); // Replace with your token storage logic
        if (!token) return;

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/getUserInfo`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setUserInfo(response.data);
        
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const token = sessionStorage.getItem("accessToken");
    if (token) {
      fetchUserInfo();
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken"); // Clear token
    setUserInfo(null); // Reset user info
    navigate("/signin");
  };

  const isAuthenticated = sessionStorage.getItem("accessToken");

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-4 transition-colors duration-500 ${scrolling ? "bg-coffee text-cream" : "bg-white text-coffee"}`}
    >
      <div className="container mx-auto flex items-center px-4 lg:px-16 justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">BarberShop</h1>

        <div className="flex space-x-3">
          {/* Navbar (Laptop/Tablet View) */}
          <nav className="hidden lg:flex space-x-6 text-md items-center">
            <a href="/" className="hover:text-brown">Home</a>
            <a className="hover:text-brown cursor-pointer"
            onClick={() => navigate("/aboutus")}
            >About Us</a>
             <Link to="/#services" className="text-md hover:text-brown">
        Services
      </Link>
            <Link to="/#contact" className="text-md hover:text-brown">
        Contact Us
      </Link>
          </nav>

          {/* User-specific Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {userInfo == null ?
              (
                <div className="hidden sm:flex items-center space-x-4">
                  {/* Loader (Spinner) */}
                  <div className="loader">Loading...</div> 
                </div>
              ):
              (
                <>
                  <span className="hidden sm:block text-md font-medium">
                    Welcome, {userInfo.username}!
                  </span>
                </>
              )}
              <div className="flex items-center space-x-2">
              <button
                  className="bg-brown sm:block hidden text-white rounded-lgtext-white py-1 px-2 md:py-2 md:px-4 rounded-lg "
                  onClick={() => navigate('/myappointments')}
                >
                   My Appointments
                </button>
                <button
                  className="bg-brown sm:block hidden text-white rounded-lgtext-white py-1 px-2 md:py-2 md:px-4 rounded-lg "
                  onClick={() => navigate('/mypayments')}
                >
                   My Payments
                </button>
                <button
                  className="bg-brown text-white py-1 px-2 md:py-2 md:px-4 rounded-lg "
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                className="bg-brown text-cream py-2 px-2 md:py-2 md:px-4 rounded-lg"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>

              <button
                className="bg-brown text-cream py-2 px-2 md:py-2 md:px-4 rounded-lg"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Hamburger Icon (Mobile View) */}
          <button
            className="block lg:hidden text-2xl focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>

        {/* Sidebar (Mobile View) */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/5 bg-coffee text-cream z-40 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Close Icon */}
          <div className="flex justify-end p-4">
            <button
              className="text-2xl focus:outline-none"
              onClick={toggleSidebar}
            >
              <FaTimes />
            </button>
          </div>

          {/* Sidebar Content */}
          <nav className="flex flex-col items-start space-y-6 mt-4 ml-6">
          {isAuthenticated && (
              <>
                <span className="text-md font-medium">
                  Welcome, {userInfo?.username}!
                </span>
                <a
                  className=" text-white  "
                  onClick={() => navigate('/myappointments')}
                >
                   My Appointments
                </a>
                <a
                  className=" text-white "
                  onClick={() => navigate('/mypayments')}
                >
                   My Payments
                </a>
              </>
            )}
            <a
              href="#home"
              className="text-lg hover:text-brown"
              onClick={() => navigate('/')}
            >
              Home
            </a>
            <a
  className="text-lg hover:text-brown"
  onClick={(e) => {
    e.preventDefault(); 
    toggleSidebar();
    navigate('/aboutus'); 
  }}
>
  About Us
</a>

<Link to="/#services" className="text-lg hover:text-brown">
        Services
      </Link>
            <Link to="/#contact" className="text-lg hover:text-brown">
        Contact Us
      </Link>
            
            
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
