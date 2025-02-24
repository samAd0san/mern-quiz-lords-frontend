import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestions";
import { PushAnswer, updateResult } from "../hooks/setResult";
import { useNavigate, Navigate } from "react-router-dom";

// This component displays the quiz application
export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(1800); // Timer state for 30 minutes (1min = 60 here)
  const [quizStarted, setQuizStarted] = useState(false);

  // Gets the state from the store
  const result = useSelector((state) => state.result.result);
  const { queue, trace } = useSelector((state) => state.questions);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

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
    // Start the timer when the quiz starts
    if (!quizStarted) {
      setQuizStarted(true);
    }
  }, [quizStarted]);

  useEffect(() => {
    console.log(trace, selectedAnswers, result);
  });

  function onNext() {
    if (trace < queue.length - 1) {
      dispatch(MoveNextQuestion());

      // Update the result with the selected answer
      if (selectedAnswers[trace] !== undefined) {
        dispatch(updateResult({ trace, checked: selectedAnswers[trace] }));
      } else {
        // Set the result to undefined if no answer is selected
        dispatch(updateResult({ trace, checked: undefined }));
      }
    }
  }

  // handles updating the result when clicking the next button and then moving to the previous question
  function onPrev() {
    if (trace > 0) {
      dispatch(MovePrevQuestion());

      // Update the result with the selected answer
      if (selectedAnswers[trace] !== undefined) {
        // Update the result in the Redux store with the selected answer for the current question.
        dispatch(updateResult({ trace, checked: selectedAnswers[trace] }));
      }
    }
  }

  function handleSubmit() {
    const confirmation = window.confirm("Are you sure you want to submit?");
    if (!confirmation) {
      return; // If the user clicks 'No', do nothing and return.
    }
  
    // Update the result for the last question if needed
    if (selectedAnswers[trace] !== undefined) {
      dispatch(updateResult({ trace, checked: selectedAnswers[trace] }));
    }

    // Create a result array that includes undefined for unselected answers
    const updatedAnswers = queue.map((_, index) =>
      selectedAnswers[index] !== undefined ? selectedAnswers[index] : undefined
    );

    dispatch(PushAnswer(updatedAnswers));
    navigate("/result");
  }

  function handleAnswerChange(answer) {
    setSelectedAnswers({
      ...selectedAnswers,
      [trace]: answer,
    });

    // Update the result immediately when the answer changes (or) Dispatch is done immediately when the answer changes.
    dispatch(updateResult({ trace, checked: answer }));
  }

  function handleTimeout() {
    const unansweredQuestions = queue.map((_, index) =>
      selectedAnswers[index] !== undefined ? selectedAnswers[index] : undefined
    );
    dispatch(PushAnswer(unansweredQuestions));
    navigate("/result"); // Use navigate for redirecting
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Remove the automatic navigation when result length equals queue length
  // if (result.length && result.length >= queue.length) {
  //   return <Navigate to={"/result"} replace={true} />;
  // }

  const isLastQuestion = trace === queue.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8 text-center">
        Assessment Test
      </h1>
      {quizStarted && (
        <div className="mb-4">
          <h2 className="text-lg md:text-xl text-red-500">Time left: {formatTime(timer)}</h2>
        </div>
      )}
      <div
        className="w-full max-w-md md:max-w-3xl mb-6 md:mb-8 select-none border border-4 rounded-xl shadow-lg border-secondary"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Questions
          onChecked={handleAnswerChange}
          selectedAnswer={selectedAnswers[trace]}
        />
      </div>

      <div className="flex justify-between w-full max-w-md md:max-w-3xl">
        {trace > 0 ? (
          <button
            className="btn bg-primary transition-all duration-300 text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
            onClick={onPrev}
          >
            Prev
          </button>
        ) : (
          <div></div>
        )}

        {isLastQuestion ? (
          <button
            className="btn bg-green-600 transition-all duration-300 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <button
            className="btn bg-primary transition-all duration-300 text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
