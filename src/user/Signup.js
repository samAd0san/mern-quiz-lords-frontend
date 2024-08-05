import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Error from "../utils/Error";
import ShouldRender from "../utils/ShouldRender";
import Loader from "../utils/Loader";

function Signup() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    rollNo: "",
    Branch: "",
    Section: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      await axios.post(url, user);
      navigate("/signin");
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
    <div className="flex items-center justify-center mt-8 mb-8 bg-white rounded">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md w-1/4 border border-secondary">
        <ShouldRender when={submitError}>
          <Error msg={submitErrorMessage} />
        </ShouldRender>
        <h1 className="font-bold text-2xl mb-8 text-primary text-center">
          Create Your Account
        </h1>

        {loading && <Loader />}

        <form onSubmit={onSignup}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-primary">First Name</label>
            <input
              name="firstName"
              type="text"
              value={user.firstName}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.firstName}>
              <div className="text-sm text-red-500 mt-1">
                {errors.firstName}
              </div>
            </ShouldRender>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-primary">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={user.lastName}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.lastName}>
              <div className="text-sm text-red-500 mt-1">{errors.lastName}</div>
            </ShouldRender>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-primary">Roll Number</label>
            <input
              name="rollNo"
              type="number"
              value={user.rollNo}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.rollNo}>
              <div className="text-sm text-red-500 mt-1">{errors.rollNo}</div>
            </ShouldRender>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-primary">Branch</label>
            <input
              name="Branch"
              type="text"
              value={user.Branch}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.Branch}>
              <div className="text-sm text-red-500 mt-1">{errors.Branch}</div>
            </ShouldRender>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-primary">Section</label>
            <input
              name="Section"
              type="text"
              value={user.Section}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.Section}>
              <div className="text-sm text-red-500 mt-1">{errors.Section}</div>
            </ShouldRender>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-primary">Email</label>
            <input
              name="email"
              type="email"
              value={user.email}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.email}>
              <div className="text-sm text-red-500 mt-1">{errors.email}</div>
            </ShouldRender>
          </div>

          <div className="mb-8">
            <label className="block mb-1 font-semibold text-primary">Password</label>
            <input
              name="password"
              type="password"
              value={user.password}
              onChange={onInputChange}
              className="block border border-gray-300 w-full rounded-lg p-2"
              required
            />
            <ShouldRender when={errors.password}>
              <div className="text-sm text-red-500 mt-1">{errors.password}</div>
            </ShouldRender>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg focus:outline-none"
              disabled={!isFormValid()}
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:text-secondary">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
