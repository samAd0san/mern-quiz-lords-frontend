import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="flex items-center">
      <div style={{ border: '12px solid white', height: '80px', display: 'flex', alignItems: 'center', marginRight: '16px', marginLeft: '16px' }}>
        <img
          src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png"
          alt="Lords Institute Logo"
          style={{ height: '80px', width: '220px' }}
        />
      </div>
      <header className="bg-primary h-24" style={{ flexGrow: 1, marginLeft: '12px' }}>
        <div className="container flex items-center justify-end mt-6 px-16 py-2">
          <nav>
            <ul className="flex space-x-6 text-white font-bold">
              <li className="relative group">
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li className="relative group">
                <Link to="/contact" className="hover:underline">Contact Us</Link>
              </li>
              <li className="relative group">
                <Link to="/signup" className="hover:underline">Signup</Link>
              </li>
              <li className="relative group">
                <Link to="/signin" className="hover:underline">Login</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
