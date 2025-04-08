import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaQuestionCircle, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const FacultyDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is faculty
    const isFaculty = localStorage.getItem('isFaculty') === 'true';
    if (!isFaculty) {
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isFaculty');
    localStorage.removeItem('facultyId');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navigateToQuestions = () => {
    navigate('/manage-questions');
  };

  const navigateToResults = () => {
    navigate('/faculty');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Faculty Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome to the Lords Quiz Faculty Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Manage Questions Card */}
          <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={navigateToQuestions}
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-4 rounded-full mr-4">
                  <FaQuestionCircle className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Manage Questions</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Add, edit, or delete quiz questions. Manage question sets and organize your content.
              </p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300">
                  Go to Questions
                </button>
              </div>
            </div>
          </div>

          {/* View Results Card */}
          <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={navigateToResults}
          >
            <div className="bg-gradient-to-r from-secondary to-primary p-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-4 rounded-full mr-4">
                  <FaChartBar className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">View Results</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                View and analyze student quiz results. Export data and generate reports.
              </p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors duration-300">
                  View Results
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard; 