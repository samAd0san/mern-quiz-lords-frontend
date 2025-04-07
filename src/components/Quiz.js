import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestions";
import { PushAnswer, updateResult } from "../hooks/setResult";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  const result = useSelector((state) => state.result.result);
  const { queue, trace } = useSelector((state) => state.questions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjectInfo = async () => {
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

          setSubjectName(subjectResponse.data.name || "Subject");
        } catch (error) {
          console.error("Error fetching subject info:", error);
          // If the API call fails, try to get the subject name from localStorage
          const subjectName = localStorage.getItem("selectedSubjectName");
          if (subjectName) {
            setSubjectName(subjectName);
          } else {
            setSubjectName("Quiz");
          }
        }
      } catch (error) {
        console.error("Error in fetchSubjectInfo:", error);
        setSubjectName("Quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectInfo();
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
    console.log(trace, selectedAnswers, result);
  });

  function onNext() {
    if (trace < queue.length - 1) {
      // Only move to next question if not at the last question
      dispatch(MoveNextQuestion());

      if (selectedAnswers[trace] !== undefined) {
        dispatch(updateResult({ trace, checked: selectedAnswers[trace] }));
      } else {
        dispatch(updateResult({ trace, checked: undefined }));
      }
    }
  }

  function onPrev() {
    if (trace > 0) {
      dispatch(MovePrevQuestion());

      if (selectedAnswers[trace] !== undefined) {
        dispatch(updateResult({ trace, checked: selectedAnswers[trace] }));
      }
    }
  }

  function handleAnswerChange(answer) {
    setSelectedAnswers({
      ...selectedAnswers,
      [trace]: answer,
    });

    dispatch(updateResult({ trace, checked: answer }));
  }

  function handleSubmit() {
    setIsSubmitting(true);
    const updatedAnswers = queue.map((_, index) =>
      selectedAnswers[index] !== undefined ? selectedAnswers[index] : undefined
    );
    dispatch(PushAnswer(updatedAnswers));
    navigate("/result");
  }

  function handleTimeout() {
    const unansweredQuestions = queue.map((_, index) =>
      selectedAnswers[index] !== undefined ? selectedAnswers[index] : undefined
    );
    dispatch(PushAnswer(unansweredQuestions));
    navigate("/result");
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Only navigate if explicitly submitting or time runs out
  if (isSubmitting && result.length && result.length >= queue.length) {
    return <Navigate to={"/result"} replace={true} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-primary text-5xl mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">Loading quiz...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            {subjectName}
          </h1>
        </div>
        
        {quizStarted && (
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="text-lg font-medium text-gray-700">
              Question {trace + 1} of {queue.length}
            </div>
            <div className="bg-primary/10 px-4 py-2 rounded-full">
              <span className="text-primary font-bold">Time left: {formatTime(timer)}</span>
            </div>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-b-lg shadow-lg">
          <div className="mb-6">
            <Questions
              onChecked={handleAnswerChange}
              selectedAnswer={selectedAnswers[trace]}
            />
          </div>

          <div className="flex justify-between">
            {trace > 0 ? (
              <button
                className="btn bg-gray-200 transition-all duration-300 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={onPrev}
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            {trace === queue.length - 1 ? (
              <button
                className="btn bg-green-500 transition-all duration-300 text-white font-bold py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                className="btn bg-primary transition-all duration-300 text-white font-bold py-2 px-6 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                onClick={onNext}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}