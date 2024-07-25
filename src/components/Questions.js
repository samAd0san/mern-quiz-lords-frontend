import React, { useEffect } from "react";
import { useFetchQuestion } from "../hooks/FetchQuestions";
import { useSelector } from "react-redux";
import Loader from "../utils/Loader";
import Error from "../utils/Error"

export default function Questions({ onChecked, selectedAnswer }) {
  const { trace } = useSelector((state) => state.questions);
  const [{ isLoading, apiData, serverError }, setGetData] = useFetchQuestion();

  const questions = useSelector(
    (state) => state.questions.queue[state.questions.trace]
  );

  useEffect(() => {
    if (selectedAnswer !== undefined) {
      onChecked(selectedAnswer);
    }
  }, [selectedAnswer]);

  function onSelect(i) {
    onChecked(i);
  }

  if(isLoading) return <h3 className='text-light'><Loader /></h3>
  if(serverError) return <h3 className='text-light'><Error/></h3>

  // Display the question and options 
  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-secondary mb-4">
        {questions?.question}
      </h2>

      <ul key={questions?.id} className="space-y-4">
        {questions?.options.map((q, i) => (
          <li key={i} className="flex items-center">
            <input
              type="radio"
              value={q}
              name={`options-${questions?.id}`}
              id={`q${i}-option`}
              onChange={() => onSelect(i)}
              checked={selectedAnswer === i}
              className="mr-2"
            />
            <label className="text-lg text-tertiary" htmlFor={`q${i}-option`}>
              {q}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
