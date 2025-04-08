import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBook, FaSpinner, FaArrowRight, FaChevronDown, FaGraduationCap, FaLock } from 'react-icons/fa';
import Loader from '../utils/Loader';
import Error from '../utils/Error';
import UserContext from '../context/UserContext';

const Home = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        branch: '',
        year: '',
        semester: ''
    });
    const [selectedSubject, setSelectedSubject] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const { isLoggedin, setLoggedin } = useContext(UserContext);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        // Check if the user has completed a quiz
        const isQuizCompleted = localStorage.getItem("quizCompleted") === "true";
        setQuizCompleted(isQuizCompleted);
        
        const fetchUserInfo = async () => {
            try {
                // Get user email from localStorage
                const email = localStorage.getItem('userEmail');
                if (!email) {
                    throw new Error('No user email found');
                }

                // Fetch user profile with the email
                console.log('Fetching user profile for email:', email);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URI}/users/profile/${email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('User profile response:', response.data);

                // Check if the response has the expected structure
                if (!response.data || !response.data.data) {
                    throw new Error('Invalid user profile response structure');
                }

                const { branch, year, semester } = response.data.data;
                if (!branch || !year || !semester) {
                    throw new Error('Missing required user information (branch, year, or semester)');
                }

                setUserInfo({ branch, year, semester });

                // Fetch subjects based on user info
                console.log('Fetching subjects for:', { branch, year, semester });
                const subjectsResponse = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URI}/api/subjects/branch/${branch}/year/${year}/semester/${semester}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Subjects response:', subjectsResponse.data);

                // Check if the subjects response has the expected structure
                if (!subjectsResponse.data || !subjectsResponse.data.data) {
                    throw new Error('Invalid subjects response structure');
                }

                setSubjects(subjectsResponse.data.data);
                setLoggedin(true); // Set logged in state to true after successful fetch
            } catch (error) {
                console.error('Error fetching user info or subjects:', error.response || error);
                setError('Failed to load subjects. Please try again later.');
                
                // If token is invalid or expired, redirect to login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userEmail');
                    navigate('/signin');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate, setLoggedin]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubjectSelect = (subjectId, subjectName) => {
        setSelectedSubject(subjectId);
        setShowDropdown(false);
        
        // Store the selected subject ID and name in localStorage
        localStorage.setItem('selectedSubjectId', subjectId);
        localStorage.setItem('selectedSubjectName', subjectName);
    };

    const startQuiz = () => {
        if (selectedSubject) {
            navigate('/main');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-primary text-5xl mb-4 mx-auto" />
                    <h2 className="text-xl font-semibold text-gray-700">Loading your subjects...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <FaSpinner className="text-red-500 text-3xl mr-3" />
                            <h2 className="text-2xl font-bold text-red-700">Ops! No subjects found</h2>
                        </div>
                        <p className="text-gray-700 mb-4">
                            {error}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => navigate('/signin')} 
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        If the problem persists, please contact your administrator.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        Welcome to Lords Quiz
            </h1>
                    <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
                Select a subject to begin your test. You can explore various subjects and take interactive quizzes to assess your knowledge.
            </p>
                </div>

                {quizCompleted ? (
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
                        <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                            <div className="flex items-center justify-center mb-4">
                                <FaLock className="text-red-500 text-3xl mr-3" />
                                <h2 className="text-2xl font-bold text-red-700">Quiz Already Completed</h2>
                            </div>
                            <p className="text-gray-700 mb-4">
                                You have already completed a quiz in this session.
                            </p>
                            <button 
                                onClick={() => navigate('/profile')} 
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300"
                            >
                                Go to Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100">
                        <div className="bg-gradient-to-r from-primary to-secondary p-6">
                            <div className="flex items-center">
                                <div className="bg-white/20 p-3 rounded-full mr-4">
                                    <FaGraduationCap className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Available Subjects</h2>
                                    <p className="text-white/80 mt-1">
                                        {userInfo.branch} - Year {userInfo.year}, Semester {userInfo.semester}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {subjects.length > 0 ? (
                            <div className="p-8">
                                <div className="mb-8">
                                    <label htmlFor="subject-select" className="block text-lg font-medium text-gray-700 mb-3">
                                        Select a Subject
                                    </label>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            id="subject-select"
                                            type="button"
                                            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            <span className="text-gray-700 font-medium">
                                                {selectedSubject 
                                                    ? subjects.find(s => s._id === selectedSubject)?.name || 'Select a subject'
                                                    : 'Select a subject'}
                                            </span>
                                            <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} />
                                        </button>
                                        
                                        {showDropdown && (
                                            <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                                {subjects.map((subject) => (
                                                    <div
                                                        key={subject._id}
                                                        className={`px-5 py-4 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-200 ${
                                                            selectedSubject === subject._id ? 'bg-primary/5 border-l-4 border-primary' : ''
                                                        }`}
                                                        onClick={() => handleSubjectSelect(subject._id, subject.name)}
                                                    >
                                                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                                                            <FaBook className="text-primary text-lg" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-800 text-lg">{subject.name}</div>
                                                            {subject.code && (
                                                                <div className="text-sm text-gray-500 mt-1">Code: {subject.code}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        className={`inline-flex items-center px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                                            selectedSubject
                                                ? 'bg-primary text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        onClick={startQuiz}
                                        disabled={!selectedSubject}
                                    >
                                        Start Test <FaArrowRight className="ml-3" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <FaBook className="text-blue-500 text-3xl mr-3" />
                                        <h2 className="text-2xl font-bold text-blue-700">No Subjects Available</h2>
                                    </div>
                                    <p className="text-gray-700 mb-4">
                                        There are currently no subjects available for your academic details.
                                    </p>
                                    <p className="text-gray-600 text-sm mb-6">
                                        This could be because:
                                    </p>
                                    <ul className="text-left text-gray-600 mb-6 max-w-md mx-auto">
                                        <li className="flex items-center mb-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            The semester hasn't started yet
                                        </li>
                                        <li className="flex items-center mb-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            Subjects haven't been assigned to your branch/year/semester
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            There might be a temporary issue with the system
                                        </li>
                                    </ul>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                                        >
                                            Refresh Page
                                        </button>
                                        <button 
                                            onClick={() => navigate('/profile')} 
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                                        >
                                            Go to Profile
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-3">
                                    If you believe this is an error, please contact your administrator.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
