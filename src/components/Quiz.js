import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestions";
import { PushAnswer } from "../hooks/setResult";
import { Navigate } from "react-router-dom";

// This component displays the quiz application
export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Gets the state from the store
  const result = useSelector((state) => state.result.result);
  const { queue, trace } = useSelector((state) => state.questions);
  const dispatch = useDispatch(); // Get the dispatch function to send actions to the Redux store

  useEffect(() => {
    console.log(result);
  });

  function onNext() {
    if (trace < queue.length) {
      dispatch(MoveNextQuestion());
      if (result.length <= trace) {
        dispatch(PushAnswer(selectedAnswers[trace]));
      }
    }
  }

  function onPrev() {
    if (trace > 0) {
      dispatch(MovePrevQuestion());
    }
  }

  function handleAnswerChange(answer) {
    setSelectedAnswers({
      ...selectedAnswers,
      [trace]: answer,
    });
  }

  if (result.length && result.length >= queue.length) {
    return <Navigate to={"/result"} replace={true}></Navigate>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-secondary mb-8">
        Compiler Design
      </h1>

      <div className="w-full max-w-3xl mb-8">
        <Questions
          onChecked={handleAnswerChange}
          selectedAnswer={selectedAnswers[trace]}
        />
      </div>

      <div className="flex justify-between w-full max-w-3xl">
        {trace > 0 ? (
          <button
            className="btn bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
            onClick={onPrev}
          >
            Prev
          </button>
        ) : (
          <div></div>
        )}
        <button
          className="btn bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
