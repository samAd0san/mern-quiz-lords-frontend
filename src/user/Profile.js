import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetAllAction } from '../redux/question_reducer';
import { pushResultAction } from '../redux/result_reducer';
import { FaSpinner, FaUser, FaGraduationCap, FaEnvelope, FaIdCard, FaCommentAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    rollNo: '', 
    branch: '', 
    section: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Get user email from localStorage
        const email = localStorage.getItem('userEmail');
        if (!email) {
          throw new Error('No user email found');
        }

        // Fetch user profile
        const profileResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/users/profile/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!profileResponse.data || !profileResponse.data.data) {
          throw new Error('Invalid profile response');
        }

        const profileData = profileResponse.data.data;
        setProfile(profileData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="mt-2 opacity-90">Welcome back, {profile.firstName}!</p>
          </div>
          
          {/* Profile Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-primary/10 p-3 rounded-full mr-3">
                    <FaUser className="text-primary text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800 font-medium">{profile.firstName} {profile.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-800 font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-primary/10 p-3 rounded-full mr-3">
                    <FaIdCard className="text-primary text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Academic Information</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Roll Number</label>
                    <p className="text-gray-800 font-medium">{profile.rollNo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Branch</label>
                    <p className="text-gray-800 font-medium">{profile.branch}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Section</label>
                    <p className="text-gray-800 font-medium">{profile.section}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feedback Section */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <FaCommentAlt className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-blue-800">Share Your Feedback</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  We value your opinion! Help us improve your learning experience by sharing your feedback.
                </p>
                
                <p className="text-gray-700">
                  Your insights help us create better quizzes and enhance the platform for all students.
                </p>
                
                <Link 
                  to="/contact" 
                  state={{ from: "profile" }}
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FaEnvelope className="mr-2" />
                  Give Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
