import React, { useEffect } from "react";
import { useFetchQuestion } from "../hooks/FetchQuestions";
import { useSelector } from "react-redux";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

export default function Questions({ onChecked, selectedAnswer }) {
  const [{ isLoading, apiData, serverError }] = useFetchQuestion();
  const trace = useSelector((state) => state.questions.trace);
  const questions = apiData[trace] || { options: [] }; // Use apiData from the hook

  const state = useSelector(state => state)
  useEffect(() => {
    console.log(state.questions)
  })

  useEffect(() => {
    if (selectedAnswer !== undefined) {
      onChecked(selectedAnswer);
    }
  }, [selectedAnswer, onChecked]);

  const onSelect = (i) => {
    onChecked(i);
  };

  if (isLoading) return <h3 className='text-light'><Loader /></h3>;
  if (serverError) return <h3 className='text-light'><Error /></h3>;

  return (
    <div className="p-6 bg-white rounded-md shadow-md h-80 overflow-y-auto">
      {apiData.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-black mb-4">
            {questions?.question || "No question available"}
          </h2>
          <ul key={questions?.id || "none"} className="space-y-4">
            {questions?.options.length > 0 ? (
              questions.options.map((q, i) => (
                <li key={i} className="flex items-center">
                  <input
                    type="radio"
                    value={q}
                    name={`options-${questions?.id || "none"}`}
                    id={`q${i}-option`}
                    onChange={() => onSelect(i)}
                    checked={selectedAnswer === i}
                    className="mr-2"
                  />
                  <label className="text-lg text-tertiary" htmlFor={`q${i}-option`}>
                    {q}
                  </label>
                </li>
              ))
            ) : (
              <li className="text-lg text-tertiary">No options available</li>
            )}
          </ul>
        </>
      ) : (
        <p className="text-lg text-tertiary">No questions available</p>
      )}
    </div>
  );
}
