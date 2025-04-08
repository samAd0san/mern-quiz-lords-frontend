import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

function ManageQuestions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionPaper, setQuestionPaper] = useState(null);
  const [branches] = useState(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']);
  const [years] = useState([1, 2, 3, 4]);
  const [semesters] = useState([1, 2]);
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedYear, setSelectedYear] = useState(4);
  const [selectedSemester, setSelectedSemester] = useState(2);
  const navigate = useNavigate();

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    // Check if user is faculty
    const isFaculty = localStorage.getItem("isFaculty") === "true";
    if (!isFaculty) {
      navigate("/signin");
      return;
    }
    
    // Initial data fetch
    fetchSubjects();
  }, [navigate]);

  // Fetch subjects when branch, year, or semester changes
  useEffect(() => {
    if (selectedBranch && selectedYear && selectedSemester) {
      fetchSubjects();
    }
  }, [selectedBranch, selectedYear, selectedSemester]);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/subjects/branch/${selectedBranch}/year/${selectedYear}/semester/${selectedSemester}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubjects(response.data.data || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to fetch subjects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionPaper = async () => {
    if (!selectedSubject) {
      setError("Please select a subject first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/questions?subjectId=${selectedSubject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setQuestionPaper(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch question paper. Please try again later.");
      console.error("Error fetching question paper:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedSubject("");
    setQuestionPaper(null);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setSelectedSubject("");
    setQuestionPaper(null);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(parseInt(e.target.value));
    setSelectedSubject("");
    setQuestionPaper(null);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setQuestionPaper(null);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <button
              onClick={() => navigate("/faculty-dashboard")}
              className="mr-4 text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Get Question Paper</h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch</label>
                <select
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={getQuestionPaper}
                disabled={!selectedSubject}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  selectedSubject 
                    ? 'bg-primary hover:bg-secondary' 
                    : 'bg-gray-300 cursor-not-allowed'
                } transition-colors duration-300`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  'Get Question Paper'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Question Paper Display */}
        {questionPaper && (
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Question Paper</h2>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(questionPaper, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageQuestions;