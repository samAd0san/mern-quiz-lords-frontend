import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import ShouldRender from "../utils/ShouldRender";
import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const { isLoggedin, setLoggedin } = useContext(UserContext);
  const navigate = useNavigate();

  const onLogoutButton = () => {
      localStorage.removeItem('token');
      navigate('/signin');
      setLoggedin(false);
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (
      !isLoggedin &&
      (currentPath === "/" || currentPath === "/faculty")
    ) {
      navigate("/signin");
      toast.error("Please sign in to continue!");
    }
  }, [isLoggedin, navigate]);

  return (
    <div className="flex items-center">
      <div style={{ border: '12px solid white', height: '80px', display: 'flex', alignItems: 'center', marginRight: '16px',marginLeft: '16px' }}>
        <img 
          src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png" 
          alt="Lords Institute Logo" 
          style={{ height: '80px', width: '220px' }}
        />
      </div>
      <header className="bg-secondary h-24" style={{ flexGrow: 1, marginLeft: '12px' }}>
        <div className="container flex items-center justify-end mt-6 px-16 py-2">
          <nav>
            <ul className="flex space-x-6 text-white font-bold">
              <li className="relative group">
                <Link to = '/about' className="hover:underline">About Us</Link>
                <ul className="absolute hidden group-hover:block bg-white text-black mt-1"></ul>
              </li>
              <li className="relative group">
                <Link to = '/contact' className="hover:underline">Contact Us</Link>
              </li>
              <ShouldRender when={!isLoggedin}>
              <li className="relative group">
                <Link to = '/signin' className="border p-1 px-3 rounded">Login</Link>
              </li>
              </ShouldRender>
              <ShouldRender when={isLoggedin}>
                <li className="relative group">
                  <button onClick={onLogoutButton} className="border px-2 rounded">Logout</button>
                </li>
              </ShouldRender>
              <ShouldRender when={isLoggedin}>
              <li className=' text-2xl'>
                <Link to = '/profile' className="hover:underline"><FaUserCircle /></Link>
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
