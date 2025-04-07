import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Error from "../utils/Error";
import ShouldRender from "../utils/ShouldRender";
import Loader from "../utils/Loader";
import UserContext from "../context/UserContext";

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
      const url = `${process.env.REACT_APP_BACKEND_URI}/users/signup`;
      const response = await axios.post(url, user);
      
      // Automatically log in after successful signup
      const loginUrl = `${process.env.REACT_APP_BACKEND_URI}/users/signin`;
      const loginResponse = await axios.post(loginUrl, {
        email: user.email,
        password: user.password
      });
      
      localStorage.setItem("token", loginResponse.data.token);
      setLoggedin(true);
      navigate("/");
    } catch (error) {
      setSubmitError(true);
      setSubmitErrorMessage(error.response?.data || "Internal Server Error");
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <ShouldRender when={submitError}>
          <Error msg={submitErrorMessage} />
        </ShouldRender>
        
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-primary hover:text-secondary">
              Sign in
            </Link>
          </p>
        </div>

        {loading && <Loader />}

        <form className="mt-8 space-y-6" onSubmit={onSignup}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Information */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <select
                    name="year"
                    value={user.year}
                    onChange={onInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <select
                    name="semester"
                    value={user.semester}
                    onChange={onInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <select
                    name="branch"
                    value={user.branch}
                    onChange={onInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section</label>
                  <select
                    name="section"
                    value={user.section}
                    onChange={onInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Section</option>
                    {sections.map((section) => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    value={user.firstName}
                    onChange={onInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                  <ShouldRender when={errors.firstName}>
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  </ShouldRender>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    value={user.lastName}
                    onChange={onInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                  <ShouldRender when={errors.lastName}>
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  </ShouldRender>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                name="rollNo"
                type="text"
                value={user.rollNo}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={user.email}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
              <ShouldRender when={errors.email}>
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              </ShouldRender>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={user.password}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
              <ShouldRender when={errors.password}>
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              </ShouldRender>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid()}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
