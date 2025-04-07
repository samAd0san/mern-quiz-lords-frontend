import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Error from "../utils/Error";
import ShouldRender from "../utils/ShouldRender";
import Loader from "../utils/Loader";
import UserContext from "../context/UserContext";
import { FaUser, FaLock, FaGraduationCap, FaIdCard, FaEnvelope, FaArrowLeft } from "react-icons/fa";

function Signup() {
  const { setLoggedin } = useContext(UserContext);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    rollNo: "",
    branch: "",
    year: "",
    semester: "",
    section: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const branches = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
  const years = [1, 2, 3, 4];
  const semesters = [1, 2];
  const sections = ["A", "B", "C", "D", "E"];

  const validateInput = (name, value) => {
    let errorMsg = "";

    if (name === "firstName" || name === "lastName") {
      if (!value) {
        errorMsg = "This field is required";
      } else if (value.length < 3) {
        errorMsg = "Must be at least 3 characters";
      }
    }

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMsg = "This field is required";
      } else if (!emailPattern.test(value)) {
        errorMsg = "Invalid email address";
      }
    }

    if (name === "password") {
      if (!value) {
        errorMsg = "This field is required";
      } else if (value.length < 6) {
        errorMsg = "Must be at least 6 characters";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const onInputChange = (evt) => {
    const { name, value } = evt.target;
    setUser({ ...user, [name]: value });
    validateInput(name, value);
  };

  const onSignup = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setSubmitError(false);
    try {
      // First, sign up the user
      const url = `${process.env.REACT_APP_BACKEND_URI}/users/signup`;
      await axios.post(url, user);
      
      // Then automatically log in the user
      const loginUrl = `${process.env.REACT_APP_BACKEND_URI}/users/signin`;
      const loginResponse = await axios.post(loginUrl, {
        email: user.email,
        password: user.password
      });
      
      // Store authentication data
      localStorage.setItem("token", loginResponse.data.data.token);
      localStorage.setItem("userEmail", user.email);
      
      // Update login state and redirect
      setLoggedin(true);
      navigate("/");
    } catch (error) {
      setSubmitError(true);
      // Ensure we're setting a string, not an object
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          setSubmitErrorMessage(error.response.data);
        } else if (error.response.data.message) {
          setSubmitErrorMessage(error.response.data.message);
        } else if (error.response.data.error) {
          setSubmitErrorMessage(error.response.data.error);
        } else {
          setSubmitErrorMessage("Signup failed. Please try again.");
        }
      } else {
        setSubmitErrorMessage("Internal Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.values(user).every((value) => value)
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image and welcome text */}
          <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 md:p-12 flex flex-col justify-center text-white">
            <div className="mb-8">
              <img 
                src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png" 
                alt="Lords Institute Logo" 
                className="h-16 w-auto bg-white rounded-lg p-2 mb-6"
              />
              <h2 className="text-3xl font-bold mb-4">Join Lords Quiz</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Create your account to start your learning journey with our interactive quiz platform.
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaGraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Student Portal</h3>
                  <p className="text-sm text-white/80">Access quizzes and track progress</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaLock size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-sm text-white/80">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup form */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-primary">
                  Create Your Account
                </h2>
                <p className="text-lg text-gray-600">
                  Fill in your details to get started
                </p>
              </div>

              <div className="flex justify-center">
                <Link
                  to="/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-secondary hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Login
                </Link>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Academic Information</span>
                </div>
              </div>
            </div>

            <ShouldRender when={submitError}>
              <Error msg={submitErrorMessage} />
            </ShouldRender>
            
            {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-primary mb-2">Creating Your Account</h3>
                  <p className="text-gray-600">Please wait while we set up your account and log you in...</p>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={onSignup}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Information */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Branch</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="branch"
                      value={user.branch}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Year</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="year"
                      value={user.year}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Semester</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="semester"
                      value={user.semester}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      required
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Section</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="section"
                      value={user.section}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      required
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Roll Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="rollNo"
                      type="text"
                      value={user.rollNo}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="Roll number"
                      required
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Personal Information</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="firstName"
                      type="text"
                      value={user.firstName}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <ShouldRender when={errors.firstName}>
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  </ShouldRender>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="lastName"
                      type="text"
                      value={user.lastName}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="Last name"
                      required
                    />
                  </div>
                  <ShouldRender when={errors.lastName}>
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  </ShouldRender>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <ShouldRender when={errors.email}>
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  </ShouldRender>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      value={user.password}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <ShouldRender when={errors.password}>
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  </ShouldRender>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid()}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaUser className="h-5 w-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                  </span>
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
