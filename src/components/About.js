import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0 mt-28 h-20">
          <img
            src="https://www.lords.ac.in/wp-content/uploads/2024/03/Main-SliderBuilding.jpg"
            alt="Lords Institute"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-2/3 md:pl-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-primary">About Us</h2>
            <p className="text-gray-700 mb-4">
              Lords Institute of Engineering & Technology (LRDS) was established in the year 2003 under the aegis of Lords Educational Society spearheaded by Chairman, Sri T. Muralidhar Goud, and Secretary, Smt. K. Ratna Devi.
            </p>
            <p className="text-gray-700 mb-4">
              The Institution is accredited by NAAC with 'A' Grade, NBA for CSE, ECE, and Mechanical, approved by AICTE, and permanently affiliated to Osmania University, Hyderabad. Recognized under Section 2(f) & 12(B) of UGC Act, 1956.
            </p>
            <p className="text-gray-700 mb-4">
              The college offers UG & PG programs in Engineering and Management, providing an excellent academic environment, and has a dynamic and dedicated team of faculty.
            </p>
            <p className="text-gray-700 mb-4">
              Lords Institute is one of the top-rated engineering institutions in Hyderabad known for its quality education, and student-centric initiatives, aiming at overall development of students.
            </p>
            <p className="text-gray-700 mb-4">
              With state-of-the-art infrastructure, modern laboratories, digital library, and various other amenities, the institute provides an exceptional learning environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
