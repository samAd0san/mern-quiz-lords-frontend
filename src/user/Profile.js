import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultTable from '../components/Result';

const Profile = () => {
  const [profile, setProfile] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    rollNo: '', 
    branch: '', 
    section: '' 
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Decode the token payload using atob
        const tokenPayload = token.split('.')[1]; // Extract the payload part
        const decodedPayload = atob(tokenPayload); // Decode base64-encoded payload
        const { email } = JSON.parse(decodedPayload); // Parse JSON from decoded payload

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/users/profile/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Ensure all properties are defined to avoid uncontrolled to controlled warning
        const profileData = {
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          rollNo: response.data.rollNo || '',
          branch: response.data.branch || '',
          section: response.data.section || ''
        };

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto p-6 bg-gray-100">
      {/* Profile Information */}
      <div className="w-full md:w-1/3 bg-gray-100 p-6 shadow-lg mb-6 md:mb-0">
        <h2 className="text-2xl font-semibold mb-6 text-primary">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-primary">First Name</label>
            <input 
              type="text" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="John" 
              value={profile.firstName}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-primary">Last Name</label>
            <input 
              type="text" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="Doe" 
              value={profile.lastName}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-primary">Roll Number</label>
            <input 
              type="text" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="123456" 
              value={profile.rollNo}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-primary">Email</label>
            <input 
              type="email" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="john.doe@example.com" 
              value={profile.email}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-primary">Branch</label>
            <input 
              type="text" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="Computer Science" 
              value={profile.branch}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-primary">Section</label>
            <input 
              type="text" 
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="A" 
              value={profile.section}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* ResultTable Component */}
      <div className="w-full md:w-2/3 bg-white p-6 shadow-lg rounded-lg">
        <ResultTable />
      </div>
    </div>
  );
};

export default Profile;
