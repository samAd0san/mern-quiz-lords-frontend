import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestions";
import { PushAnswer, updateResult } from "../hooks/setResult";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const result = useSelector((state) => state.result.result);
  const { queue, trace, answers } = useSelector((state) => state.questions);
  const rollNumber = useSelector((state) => state.result.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Prevent navigation away from the quiz
  useEffect(() => {
    // Function to handle beforeunload event
    const handleBeforeUnload = (e) => {
      if (!quizCompleted) {
        e.preventDefault();
        e.returnValue = "You are in the middle of a quiz. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    // Function to handle navigation attempts
    const handleNavigation = (e) => {
      if (!quizCompleted) {
        e.preventDefault();
        alert("You cannot navigate away while taking the quiz. Please complete or submit the quiz first.");
        return false;
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleNavigation);

    // Clean up event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [quizCompleted]);

  useEffect(() => {
    // Get subject name from localStorage instead of making an API call
    const subjectName = localStorage.getItem("selectedSubjectName");
    if (subjectName) {
      setSubjectName(subjectName);
    } else {
      setSubjectName("Quiz");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (quizStarted && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    }

    if (timer === 0) {
      handleTimeout();
    }
  }, [timer, quizStarted]);

  useEffect(() => {
    if (!quizStarted) {
      setQuizStarted(true);
    }
  }, [quizStarted]);

  useEffect(() => {
    console.log("Quiz state:", { trace, selectedAnswers, result, queue });
  });

  function onNext() {
    if (trace < queue.length - 1) {
      // Only move to next question if not at the last question
      dispatch(MoveNextQuestion());
    }
  }

  function onPrev() {
    if (trace > 0) {
      // Only move to previous question if not at the first question
      dispatch(MovePrevQuestion());
    }
  }

  function onChecked(i) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [trace]: i,
    }));
  }

  function handleTimeout() {
    // Auto-submit when timer runs out
    handleSubmit();
  }

  function showSubmitConfirmation() {
    setShowConfirmation(true);
  }

  function cancelSubmission() {
    setShowConfirmation(false);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setShowConfirmation(false);
    
    try {
      // Get the user's roll number from Redux state
      if (!rollNumber) {
        throw new Error("No roll number found");
      }
      
      // Get the selected subject ID from localStorage
      const selectedSubjectId = localStorage.getItem("selectedSubjectId");
      if (!selectedSubjectId) {
        throw new Error("No subject selected");
      }
      
      // Calculate attempts and points
      const attempts = Object.keys(selectedAnswers).length;
      const earnPoints = Object.values(selectedAnswers).filter((answer, index) => 
        answer === answers[index]
      ).length;
      
      // Determine if passed based on points
      const totalPoints = queue.length;
      const achieved = (earnPoints / totalPoints) >= 0.5 ? "Passed" : "Failed";
      
      // Prepare the result data according to the API requirements
      const resultData = {
        result: Object.values(selectedAnswers),
        attempts: attempts,
        points: earnPoints,
        achieved: achieved
      };
      
      console.log("Submitting result:", resultData);
      
      // Submit the result to the API
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/result/${rollNumber}/${selectedSubjectId}`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Result submission response:", response.data);
      
      // Mark quiz as completed to allow navigation
      setQuizCompleted(true);
      
      // Set a flag in localStorage to indicate quiz completion
      localStorage.setItem("quizCompleted", "true");
      
      // Navigate to the profile page instead of the result page
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting result:", error);
      setError(error.message || "Failed to submit result");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary text-5xl mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your quiz...</h2>
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
              <FaTimesCircle className="text-red-500 text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-red-700">Quiz Error</h2>
            </div>
            <p className="text-gray-700 mb-4">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
              >
                Back to Home
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

  // Improved check for last question
  // Make sure queue exists, has items, and we're at the last index
  const isLastQuestion = Array.isArray(queue) && queue.length > 0 && trace === queue.length - 1;
  
  // Log the condition values for debugging
  console.log("Button rendering condition:", { 
    queueExists: Array.isArray(queue), 
    queueLength: queue?.length, 
    trace, 
    isLastQuestion 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <h1 className="text-3xl font-bold">{subjectName} Quiz</h1>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg">Question {trace + 1} of {queue?.length || 0}</p>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <p className="text-lg font-medium">Time remaining: {timer}s</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Questions
            onChecked={onChecked}
            selectedAnswer={selectedAnswers[trace]}
          />
          
          <div className="flex justify-between mt-8">
            <button
              onClick={onPrev}
              disabled={trace === 0}
              className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-300 ${
                trace === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              <FaArrowLeft className="mr-2" />
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={showSubmitConfirmation}
                disabled={isSubmitting}
                className="flex items-center px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 hover:shadow-md"
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white">
              <h2 className="text-2xl font-bold">Confirm Submission</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary bg-opacity-10 p-4 rounded-full">
                  <FaCheckCircle className="text-primary text-4xl" />
                </div>
              </div>
              
              <p className="text-center text-gray-700 mb-6 text-lg">
                Are you sure you want to submit your quiz? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelSubmission}
                  className="flex items-center px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:shadow-md"
                >
                  <FaTimesCircle className="mr-2" />
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 hover:shadow-md"
                >
                  <FaCheckCircle className="mr-2" />
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}