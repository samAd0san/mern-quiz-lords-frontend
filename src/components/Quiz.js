import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestions";
import { PushAnswer, updateResult } from "../hooks/setResult"; // Import updateResult
import { Navigate } from "react-router-dom";

// This component displays the quiz application
export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState([]); // State to store the selected answers

  // Gets the state from the store
  const result = useSelector((state) => state.result.result);
  const { queue, trace } = useSelector((state) => state.questions);
  const dispatch = useDispatch(); // Get the dispatch function to send actions to the Redux store

  useEffect(() => {
    console.log(trace, selectedAnswers, result);
  });

  function onNext() {
    if (trace < queue.length) {
      dispatch(MoveNextQuestion());

      // Update the result with the selected answer
      if (selectedAnswers[trace] !== undefined) {
        dispatch(updateResult({ trace, checked: selectedAnswers[trace] }));
      } else if (result.length <= trace) {
        dispatch(PushAnswer(selectedAnswers));
      }
    }
  }

  function onPrev() {
    if (trace > 0) {
      dispatch(MovePrevQuestion());
      
      // Update the result with the selected answer
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

    // Update the result immediately when the answer changes
    dispatch(updateResult({ trace, checked: answer }));
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