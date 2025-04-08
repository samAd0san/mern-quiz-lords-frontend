import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaList, FaSignOutAlt, FaUserGraduate, FaChartBar } from "react-icons/fa";
import Loader from "../utils/Loader";
import Error from "../utils/Error";

function Faculty() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is faculty
    const isFaculty = localStorage.getItem("isFaculty");
    if (!isFaculty) {
      navigate("/login");
      return;
    }

    // Fetch results
    fetchResults();
  }, [navigate]);

  const fetchResults = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/result`);
      setResults(response.data.data);
    } catch (err) {
      setError(true);
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isFaculty");
    localStorage.removeItem("facultyId");
    navigate("/login");
  };

  const handleAddQuestion = () => {
    navigate("/add-question");
  };

  if (loading) return <Loader />;
  if (error) return <Error message="Failed to load faculty dashboard" />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Faculty Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <button
                onClick={handleAddQuestion}
                className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaPlus className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Question</h3>
                  <p className="text-sm text-gray-500">Create new quiz questions</p>
                </div>
              </button>

              <div className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <FaList className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Manage Questions</h3>
                  <p className="text-sm text-gray-500">View and edit existing questions</p>
                </div>
              </div>

              <div className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <FaChartBar className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-500">View quiz performance metrics</p>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Quiz Results</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FaUserGraduate className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {result.username || "Anonymous"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.points} points</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.points >= 80
                              ? "bg-green-100 text-green-800"
                              : result.points >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {result.points >= 80
                              ? "Excellent"
                              : result.points >= 60
                              ? "Good"
                              : "Needs Improvement"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faculty; 