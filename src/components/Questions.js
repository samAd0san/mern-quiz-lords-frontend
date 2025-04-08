import React, { useEffect } from "react";
import { useFetchQuestion } from "../hooks/FetchQuestions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";
import Error from "../utils/Error";
import { FaQuestionCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Questions({ onChecked, selectedAnswer }) {
  const [{ isLoading, apiData, serverError }] = useFetchQuestion();
  const trace = useSelector((state) => state.questions.trace);
  const questions = apiData[trace] || { options: [] }; // Use apiData from the hook
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
      <div className="text-center">
        <Loader />
        <h2 className="text-xl font-semibold text-gray-700 mt-4">Loading questions...</h2>
      </div>
    </div>
  );

  if (serverError) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-red-700">Error Loading Questions</h2>
          </div>
          <p className="text-gray-700 mb-4">
            {serverError}
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {apiData.length > 0 ? (
        <>
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4 mt-1">
                <FaQuestionCircle className="text-primary text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {questions?.question || "No question available"}
              </h2>
            </div>
          </div>

          <div className="p-6">
            <ul className="space-y-4">
              {questions?.options && questions.options.length > 0 ? (
                questions.options.map((q, i) => (
                  <li
                    key={i}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedAnswer === i
                        ? 'bg-primary/10 border-primary text-primary font-medium shadow-sm'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                    onClick={() => onSelect(i)}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center mr-4 ${
                        selectedAnswer === i
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-gray-700 text-lg">{q}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic p-4">No options available</li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-lg">No questions available</p>
        </div>
      )}
    </div>
  );
}
