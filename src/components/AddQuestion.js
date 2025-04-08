import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

function AddQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [questionData, setQuestionData] = useState({
    subject: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is faculty
    const isFaculty = localStorage.getItem("isFaculty");
    if (!isFaculty) {
      navigate("/login");
      return;
    }

    // Fetch subjects
    fetchSubjects();
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/subjects`);
      setSubjects(response.data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData((prev) => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!questionData.subject || !questionData.question) {
      setError("Please fill in all required fields");
      return;
    }

    if (questionData.options.some(option => !option)) {
      setError("Please fill in all options");
      return;
    }

    setLoading(true);
    setError(false);

    try {
      // Use the correct API endpoint to insert a question
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/questions/subject/${questionData.subject}`,
        questionData
      );
      navigate("/faculty");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
      console.error("Error adding question:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Add New Question</h1>
              <button
                onClick={() => navigate("/faculty")}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-300"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <Error message={error} />}

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                name="subject"
                value={questionData.subject}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Question</label>
              <textarea
                name="question"
                value={questionData.question}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <div className="mt-2 space-y-2">
                {questionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={questionData.correctAnswer === index}
                      onChange={() =>
                        setQuestionData((prev) => ({ ...prev, correctAnswer: index }))
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Points</label>
              <input
                type="number"
                name="points"
                value={questionData.points}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion; 