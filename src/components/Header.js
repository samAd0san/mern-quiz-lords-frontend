import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import ShouldRender from "../utils/ShouldRender";
import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const { isLoggedin, setLoggedin } = useContext(UserContext);
  const navigate = useNavigate();

  const onLogoutButton = () => {
    localStorage.removeItem("token");
    navigate("/signin");
    setLoggedin(false);
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!isLoggedin && currentPath === "/") {
      navigate("/signin");
      toast.error("Please sign in to continue!");
    }
  }, [isLoggedin, navigate]);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-24 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png"
                alt="Lords Institute Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="flex items-center">
            <ul className="flex items-center space-x-8">
              <li className="hidden sm:block">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-300"
                >
                  <FaHome className="text-xl" />
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link 
                  to="/about" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-300"
                >
                  <FaInfoCircle className="text-xl" />
                  <span className="font-medium">About</span>
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link 
                  to="/contact" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-300"
                >
                  <FaEnvelope className="text-xl" />
                  <span className="font-medium">Contact</span>
                </Link>
              </li>

              {/* Auth Buttons */}
              <ShouldRender when={!isLoggedin}>
                <div className="flex items-center space-x-4">
                  <li>
                    <Link 
                      to="/signin" 
                      className="inline-flex items-center px-4 py-2 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/signup" 
                      className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Sign Up
                    </Link>
                  </li>
                </div>
              </ShouldRender>

              <ShouldRender when={isLoggedin}>
                <div className="flex items-center space-x-4">
                  <li>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-300"
                    >
                      <FaUserCircle className="text-2xl" />
                      <span className="font-medium hidden sm:inline">Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={onLogoutButton}
                      className="inline-flex items-center px-4 py-2 border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </div>
              </ShouldRender>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;