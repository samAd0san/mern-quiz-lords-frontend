import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
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
    <div className="flex items-center">
      <div className="border-8 border-white h-20 flex items-center mx-4 sm:mx-0 w-1/2 sm:w-auto">
        <img
          src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png"
          alt="Lords Institute Logo"
          className="h-20 w-full ml-3 sm:w-56 object-contain" //Adjust this margin acc
        />
      </div>
      {/*Adjust this margin acc*/}
      <header className="bg-secondary h-24 flex-grow ml-6">
        <div className="flex items-center justify-end mt-6 px-4 sm:px-16 py-2">
          <nav>
            <ul className="flex space-x-4 sm:space-x-6 text-white font-bold">
              <li className="relative group hidden sm:block">
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li className="relative group hidden sm:block">
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <ShouldRender when={!isLoggedin}>
                <li className="relative group">
                  <Link to="/signin" className="border p-1 px-3 rounded">
                    Login
                  </Link>
                </li>
              </ShouldRender>
              <ShouldRender when={isLoggedin}>
                <li className="relative group">
                  <button
                    onClick={onLogoutButton}
                    className="border px-2 rounded"
                  >
                    Logout
                  </button>
                </li>
              </ShouldRender>
              <ShouldRender when={isLoggedin}>
                <li className="text-2xl">
                  <Link to="/profile" className="hover:underline">
                    <FaUserCircle />
                  </Link>
                </li>
              </ShouldRender>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;