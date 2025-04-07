import React, { useEffect } from "react";
import { useFetchQuestion } from "../hooks/FetchQuestions";
import { useSelector } from "react-redux";
import Loader from "../utils/Loader";
import Error from "../utils/Error";
import { FaQuestionCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Questions({ onChecked, selectedAnswer }) {
  const [{ isLoading, apiData, serverError }] = useFetchQuestion();
  const trace = useSelector((state) => state.questions.trace);
  const questions = apiData[trace] || { options: [] }; // Use apiData from the hook

  const state = useSelector(state => state)
  useEffect(() => {
    console.log("Current state:", state.questions)
  })

  useEffect(() => {
    if (selectedAnswer !== undefined) {
      onChecked(selectedAnswer);
    }
  }, [selectedAnswer, onChecked]);

  const onSelect = (i) => {
    onChecked(i);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader />
      <p className="mt-4 text-gray-600">Loading questions...</p>
    </div>
  );
  
  if (serverError) return (
    <div className="p-6 bg-red-50 rounded-lg border border-red-200">
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-red-500 text-xl mr-2" />
        <h3 className="text-lg font-semibold text-red-700">Error Loading Questions</h3>
      </div>
      <p className="text-red-600">{serverError}</p>
      <p className="mt-4 text-gray-600 text-sm">
        Please check your connection and try again. If the problem persists, contact support.
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {apiData.length > 0 ? (
        <>
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                <FaQuestionCircle className="text-primary text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {questions?.question || "No question available"}
              </h2>
            </div>
          </div>
          
          <div className="p-4">
            <ul className="space-y-3">
              {questions?.options && questions.options.length > 0 ? (
                questions.options.map((q, i) => (
                  <li 
                    key={i} 
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedAnswer === i 
                        ? 'bg-primary/10 border-primary text-primary font-medium' 
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelect(i)}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                        selectedAnswer === i 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-gray-700">{q}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No options available</li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500">No questions available</p>
        </div>
      )}
    </div>
  );
}
