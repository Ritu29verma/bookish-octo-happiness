import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
    return (
      <footer className="bg-[#ac8764] text-coffee py-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className='font-bold'>
            <p>© {new Date().getFullYear()} BarberShop. All rights reserved.</p>
          </div>
          <div className="flex space-x-4 p-4">
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
          </div>
          <div className="flex justify-center items-center ">
          <div className="flex justify-center items-center space-x-8">
      {/* Apple Icon */}
      <div className="relative group">
        <FaInstagram className="text-black text-4xl cursor-pointer" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-40px] transition-all duration-300">
          Instagram 
          <span className="absolute w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800 bottom-[-4px] left-1/2 -translate-x-1/2"></span>
        </span>
      </div>

      {/* Twitter Icon */}
      <div className="relative group">
        <FaTwitter className="text-blue-500 text-4xl cursor-pointer" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-40px] transition-all duration-300">
          Twitter 
          <span className="absolute w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800 bottom-[-4px] left-1/2 -translate-x-1/2"></span>
        </span>
      </div>

      {/* Facebook Icon */}
      <div className="relative group">
        <FaFacebook className="text-blue-800 text-4xl cursor-pointer" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-[-40px] transition-all duration-300">
          Facebook 
          <span className="absolute w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800 bottom-[-4px] left-1/2 -translate-x-1/2"></span>
        </span>
      </div>
    </div>
    </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;