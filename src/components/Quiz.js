import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestions";
import { PushAnswer, updateResult } from "../hooks/setResult";
import { useNavigate, Navigate } from "react-router-dom";

export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const result = useSelector((state) => state.result.result);
  const { queue, trace } = useSelector((state) => state.questions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8 text-center">
        Compiler Design
      </h1>
      {quizStarted && (
        <div className="mb-4">
          <h2 className="text-lg md:text-xl">Time left: {formatTime(timer)}</h2>
        </div>
      )}
      <div className="w-full max-w-md md:max-w-3xl mb-6 md:mb-8">
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
        {trace === queue.length - 1 ? (
          <button
            className="btn bg-green-500 transition-all duration-300 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
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