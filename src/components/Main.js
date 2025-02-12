import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setUserId } from "../redux/result_reducer";

const Main = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [rollNo, setRollNo] = useState("");

  useEffect(() => {
    const fetchRollNo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Decode the token payload using atob
        const tokenPayload = token.split(".")[1]; // Extract the payload part
        const decodedPayload = atob(tokenPayload); // Decode base64-encoded payload
        const { email } = JSON.parse(decodedPayload); // Parse JSON from decoded payload

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/users/profile/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rollNumber = response.data.rollNo || "";
        setRollNo(rollNumber);
        if (inputRef.current) {
          inputRef.current.value = rollNumber;
        }
      } catch (error) {
        console.error("Error fetching roll number:", error);
      }
    };

    fetchRollNo();
  }, []);

  const startQuiz = () => {
    if (inputRef.current?.value) {
      dispatch(setUserId(inputRef.current?.value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold text-primary mb-4 mt-4 text-center">
        Assessment Test
      </h1>

      <ol className="list-decimal list-inside text-md text-black font-medium space-y-1 mb-8 max-w-xs md:max-w-md lg:max-w-lg">
        <li>You will be asked 30 questions one after another.</li>
        <li>One Mark is awarded for the correct answer.</li>
        <li>The result will be declared at the end of the quiz.</li>
      </ol>

      <form id="form" className="w-full max-w-xs mb-8">
        <input
          ref={inputRef}
          type="text"
          placeholder="Roll number"
          className="w-full px-3 py-2 bg-gray-100 border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          readOnly
          value={rollNo}
        />
      </form>

      <div>
        <Link
          className="btn inline-block px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition-all duration-300"
          to={"/quiz"}
          onClick={startQuiz}
        >
          Start Test
        </Link>
      </div>
    </div>
  );
};

export default Main;
