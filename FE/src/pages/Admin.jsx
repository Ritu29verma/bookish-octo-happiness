import React, { useState } from "react";
import AppointmentsTable from "../components/Allappointments";
import AllUsers from "../components/Allusers";
import AllNotification from "../components/AllNotification";
import AllPayments from "../components/Allpayments";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Feedbacks from "../components/Feedbacks";

const AdminAppointmentsPage = () => {
  const [activeView, setActiveView] = useState("appointments");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderView = () => {
    switch (activeView) {
      case "appointments":
        return <AppointmentsTable />;

      case "users":
        return <AllUsers />;

      case "notifications":
        return <AllNotification/>;
      case "payments":
            return <AllPayments/>;
      case "feedbacks":
              return <Feedbacks/>;

      default:
        return <p>Select an option from the menu.</p>;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken"); // Clear token
    setUserInfo(null); // Reset user info
    navigate("/signin");
  };

  return (
    <div className="bg-gray-100 min-h-screen scrollbar-hide">
      {/* Navbar */}
      <nav className="bg-coffee text-cream py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Admin Dashboard Title */}
          <div className="text-lg font-bold">Admin Dashboard</div>

          {/* Hamburger Icon for Small Screens */}
          <div className="md:hidden flex items-center ml-auto">
            <button onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

 {/* Sidebar for Small Screens */}
 <div
          className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/5 bg-coffee text-cream z-40 transition-transform duration-300 transform ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
        >
          <div className="flex justify-end p-4">
            <button
              className="text-2xl focus:outline-none"
              onClick={toggleSidebar}
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <button
               className={'text-left w-full'}
              onClick={() => {
                setActiveView("appointments");
                toggleSidebar();
              }}
            >
              All Appointments
            </button>
            <button
                className={'text-left w-full'}
              onClick={() => {
                setActiveView("users");
                toggleSidebar();
              }}
            >
              All Users
            </button>
            <button
              className={'text-left w-full'}
              onClick={() => {
                setActiveView("notifications");
                toggleSidebar();
              }}
            >
              Notifications
            </button>
            <button
              className={'text-left w-full'}
              onClick={() => {
                setActiveView("payments");
                toggleSidebar();
              }}
            >
              Payments
            </button>
            <button
              className={'text-left w-full'}
              onClick={() => {
                setActiveView("feedbacks");
                toggleSidebar();
              }}
            >
              Feedbacks
            </button>
            <button
              className="w-full text-left text-white py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

 {/* Regular Menu for Larger Screens */}
 <div className="hidden md:flex space-x-4 justify-center mt-4 items-center">
          <button
            className={`bg-brown px-4 py-2 rounded ${
              activeView === "appointments" ? "bg-[#a74835]"  : ""
            }`}
            onClick={() => setActiveView("appointments")}
          >
            All Appointments
          </button>
          <button
            className={`bg-brown px-4 py-2 rounded ${
              activeView === "users" ? "bg-[#a74835]"  : ""
            }`}
            onClick={() => setActiveView("users")}
          >
            All Users
          </button>
          <button
            className={`bg-brown px-4 py-2 rounded ${
              activeView === "notifications" ? "bg-[#a74835]" : ""
            }`}
            onClick={() => setActiveView("notifications")}
          >
            Notifications
          </button>
          <button
            className={`bg-brown px-4 py-2 rounded ${
              activeView === "payments" ? "bg-[#a74835]" : ""
            }`}
            onClick={() => setActiveView("payments")}
          >
            Payments
          </button>
          <button
            className={`bg-brown px-4 py-2 rounded ${
              activeView === "feedbacks" ? "bg-[#a74835]" : ""
            }`}
            onClick={() => setActiveView("feedbacks")}
          >
            Feedbacks
          </button>
          <button
            className="bg-brown text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        </div>    
      </nav>
  
    {/* Content */}
    <div className="container mx-auto mt-8 px-4 bg-cream m-2 p-2 rounded-lg shadow-md min-h-screen">
      <div className="min-h-screen sm:h-[80vh] md:h-[70vh] lg:h-[60vh] overflow-y-auto scrollbar-hide p-4">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        {(() => {
            switch (activeView) {
            case "appointments":
                return "All Appointments";
            case "users":
                return "All Users";
            case "notifications":
                return "Notifications";
            case "payments":
                return "All Payments";
                case "feedbacks":
                  return "All Feedbacks";
            default:
                return "Select an option from the menu.";
            }
        })()}
        </h1>
        <div className=" ">
          {renderView()}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default AdminAppointmentsPage;
