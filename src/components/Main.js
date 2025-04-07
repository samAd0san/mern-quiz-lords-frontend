import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserId } from "../redux/result_reducer";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";

const Main = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState("");
  const [subjectInfo, setSubjectInfo] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndSubjectInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Get selected subject ID from localStorage
        const selectedSubjectId = localStorage.getItem("selectedSubjectId");
        if (!selectedSubjectId) {
          throw new Error("No subject selected");
        }

        // Get user email using a more robust approach
        let email;
        try {
          // First try to decode the token payload
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
          }
          
          // Try to decode the payload
          const tokenPayload = tokenParts[1];
          // Replace URL-safe characters and add padding if needed
          const base64 = tokenPayload.replace(/-/g, '+').replace(/_/g, '/');
          const padding = '='.repeat((4 - base64.length % 4) % 4);
          const decodedPayload = atob(base64 + padding);
          const payload = JSON.parse(decodedPayload);
          email = payload.email;
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          // If decoding fails, try to get the email from localStorage
          const storedEmail = localStorage.getItem('userEmail');
          if (storedEmail) {
            email = storedEmail;
          } else {
            throw new Error('Could not retrieve user email');
          }
        }

        if (!email) {
          throw new Error('Could not retrieve user email');
        }

        // Fetch user profile
        const userResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/users/profile/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rollNumber = userResponse.data.rollNo || "";
        setRollNo(rollNumber);
        if (inputRef.current) {
          inputRef.current.value = rollNumber;
        }

        // Fetch subject details
        try {
          const subjectResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URI}/api/subjects/${selectedSubjectId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSubjectInfo({
            name: subjectResponse.data.name || "Subject",
            code: subjectResponse.data.code || "",
          });
        } catch (subjectError) {
          console.error("Error fetching subject details:", subjectError);
          // If API call fails, try to get subject name from localStorage
          const subjectName = localStorage.getItem("selectedSubjectName");
          if (subjectName) {
            setSubjectInfo({
              name: subjectName,
              code: "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user or subject info:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubjectInfo();
  }, []);

  const startQuiz = () => {
    if (inputRef.current?.value) {
      dispatch(setUserId(inputRef.current?.value));
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary text-5xl mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">Loading quiz information...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={goBack} 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <h1 className="text-3xl font-bold text-white text-center">
            {subjectInfo.name}
          </h1>
          {subjectInfo.code && (
            <p className="text-white/80 text-center mt-1">Code: {subjectInfo.code}</p>
          )}
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border-l-4 border-primary p-4 mb-6">
            <h2 className="text-lg font-semibold text-primary mb-2">Quiz Instructions</h2>
            <ol className="list-decimal list-inside text-md text-gray-700 space-y-1">
              <li>You will be asked multiple questions one after another.</li>
              <li>One Mark is awarded for the correct answer.</li>
              <li>The result will be declared at the end of the quiz.</li>
              <li>You cannot go back to previous questions once answered.</li>
              <li>Ensure you have a stable internet connection.</li>
            </ol>
          </div>

          <form id="form" className="w-full mb-6">
            <div className="mb-4">
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                id="rollNo"
                ref={inputRef}
                type="text"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                readOnly
                value={rollNo}
              />
            </div>
          </form>

          <div className="flex justify-center">
            <Link
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              to={"/quiz"}
              onClick={startQuiz}
            >
              Start Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
