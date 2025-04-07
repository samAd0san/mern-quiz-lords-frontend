// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          {/* Logo and Description */}
          <div className="space-y-6">
            <img 
              src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png" 
              alt="Lords Institute Logo" 
              className="h-20 w-auto bg-white rounded-lg p-2"
            />
            <p className="text-gray-200 text-sm leading-relaxed">
              Lords Institute of Engineering & Technology is committed to academic excellence and preparing students for successful careers in technology and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 border-b-2 border-white/20 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.lords.ac.in/overview/" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Overview</span>
                </a>
              </li>
              <li>
                <a href="https://www.lords.ac.in/campus-life/events/" target="_blank" rel="noopener noreferrer"
                   className="text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Events</span>
                </a>
              </li>
              <li>
                <a href="https://www.lords.ac.in/infrastructure/world-class-facilities/" target="_blank" rel="noopener noreferrer"
                   className="text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Facilities</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Admissions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 border-b-2 border-white/20 pb-2">Admissions</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.lords.ac.in/domestic/courses-offered/" target="_blank" rel="noopener noreferrer"
                   className="text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Courses Offered</span>
                </a>
              </li>
              <li>
                <a href="https://www.lords.ac.in/nri/courses-offered/" target="_blank" rel="noopener noreferrer"
                   className="text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>NRI Admissions</span>
                </a>
              </li>
              <li>
                <a href="https://www.lords.ac.in/international/courses-offered/" target="_blank" rel="noopener noreferrer"
                   className="text-gray-200 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>International Students</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 border-b-2 border-white/20 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaPhone className="text-gray-200" />
                <span className="text-gray-200">+91-6309012442/43</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-200" />
                <a href="mailto:principal@lords.ac.in" className="text-gray-200 hover:text-white transition-colors duration-300">
                  principal@lords.ac.in
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-gray-200 mt-1" />
                <span className="text-gray-200">
                  Himayathsagar Road, Hyderabad, Telangana - 500091
                </span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="flex space-x-4 pt-4">
              <a href="https://www.facebook.com/lordsinstitute/" target="_blank" rel="noopener noreferrer"
                 className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="https://x.com/lords_institute/" target="_blank" rel="noopener noreferrer"
                 className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com/school/lords-institute-of-engineering-&-technology/" target="_blank" rel="noopener noreferrer"
                 className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors duration-300">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/10 py-8 text-center">
          <p className="text-gray-200 text-sm">
            © {new Date().getFullYear()} Lords Institute of Engineering and Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
