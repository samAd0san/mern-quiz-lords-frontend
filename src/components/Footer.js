// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="hidden sm:block">
        <img 
            src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png" 
            alt="Lords Institute Logo" 
            className="mt-4 h-24 w-54"
          />
        </div>
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold mb-4">About Lords</h2>
          <ul>
            <li><a href="https://www.lords.ac.in/overview/" target="_blank" className="hover:underline">Overview</a></li>
            <li><a href="https://www.lords.ac.in/campus-life/events/" target="_blank" className="hover:underline">Events</a></li>
            <li><a href="https://www.lords.ac.in/infrastructure/world-class-facilities/" target="_blank" className="hover:underline">Facilities</a></li>
          </ul>
        </div>
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold mb-4">Admissions</h2>
          <ul>
            <li><a href="https://www.lords.ac.in/domestic/courses-offered/"  target="_blank" className="hover:underline">Courses Offered</a></li>
            <li><a href="https://www.lords.ac.in/nri/courses-offered/" target="_blank" className="hover:underline">NRI Admissions</a></li>
            <li><a href="https://www.lords.ac.in/international/courses-offered/" target="_blank" className="hover:underline">International Students</a></li>
          </ul>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-bold mb-4">Contact</h2>
          <p className="mb-4">
            +91-6309012442/43<br />
            <a href="mailto:principal@lords.ac.in" className="hover:underline">principal@lords.ac.in</a>
          </p>
          <div className="flex justify-center sm:justify-start space-x-4 sm:ml-4">
            <a href="https://www.facebook.com/lordsinstitute/" target="_blank" className="hover:text-primary">
              <FaFacebook size={24} />
            </a>
            <a href="https://x.com/lords_institute/" target="_blank" className="hover:text-primary">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.linkedin.com/school/lords-institute-of-engineering-&-technology/" target="_blank" className="hover:text-primary">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center border-t border-white-100 pt-4">
        <p>&copy; 2024 Lords Institute of Engineering and Technology. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
