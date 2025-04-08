import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ResultTable from './ResultTable';
import { useDispatch, useSelector } from 'react-redux';
import { attempts_Number, earnPoints_Number, flagResult } from '../helper/helper';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';
import { usePublishResult } from '../hooks/setResult';
import axios from 'axios';
import Loader from '../utils/Loader';
import Error from '../utils/Error';
import { FaTimesCircle, FaSpinner, FaChevronUp, FaChevronDown } from 'react-icons/fa';

export default function Result() {
    const dispatch = useDispatch();
    const { questions: { queue, answers }, result: { result, userId } } = useSelector(state => state);
    const [apiResult, setApiResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());

    useEffect(() => {
        console.log("Result component mounted with data:", { result, userId, queue, answers });
        
        // Fetch result from API
        const fetchResult = async () => {
            try {
                setLoading(true);
                
                // Get the token from localStorage
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }
                
                // Make API request to get all results
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URI}/api/result`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                console.log("API Result response:", response.data);
                
                if (response.data && response.data.status === "success" && response.data.data) {
                    setApiResult(response.data.data);
                    
                    // If we have results, use the most recent one to update the UI
                    if (response.data.data.length > 0) {
                        const latestResult = response.data.data[0];
                        // Update the result state with the latest result
                        dispatch(resetResultAction());
                        dispatch({
                            type: 'PUSH_RESULT_ACTION',
                            payload: latestResult.result
                        });
                    }
                } else {
                    throw new Error("Invalid response format from API");
                }
            } catch (error) {
                console.error("Error fetching result from API:", error);
                setError(error.message || "Failed to fetch result from API");
            } finally {
                setLoading(false);
            }
        };
        
        fetchResult();
    }, [userId, dispatch]);

    const totalPoints = queue.length * 1;
    const attempts = attempts_Number(result);
    const earnPoints = earnPoints_Number(result, answers, 1);
    const flag = flagResult(totalPoints, earnPoints);
    
    // Determine grade based on points earned
    const getGrade = (points, total) => {
        const percentage = (points / total) * 100;
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    };
    
    const grade = getGrade(earnPoints, totalPoints);

    /** store user result */
    usePublishResult({
        result,
        username: userId,
        attempts,
        points: earnPoints,
        achived: grade
    });

    function onRestart() { // Function to restart the quiz
        console.log('on Restart');
        dispatch(resetAllAction()); // reset the question state
        dispatch(resetResultAction()); // reset the result state
    }

    const handleRowClick = (index) => {
        setExpandedRows(prevState => {
            const newExpandedRows = new Set(prevState);
            if (newExpandedRows.has(index)) {
                newExpandedRows.delete(index);
            } else {
                newExpandedRows.add(index);
            }
            return newExpandedRows;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-6">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-6">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <FaTimesCircle className="text-red-500 text-3xl mr-3" />
                            <h2 className="text-2xl font-bold text-red-700">Result Error</h2>
                        </div>
                        <p className="text-gray-700 mb-4">
                            {error}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                            >
                                Try Again
                            </button>
                            <Link 
                                to={'/'} 
                                onClick={onRestart} 
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        If the problem persists, please contact your administrator.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex flex-col justify-center items-center p-4 md:p-6'>
            <h1 className='text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8'>Your Results</h1>

            {apiResult && apiResult.length > 0 ? (
                <div className='bg-white p-4 md:p-6 rounded-md shadow-lg border border-gray-200 w-full max-w-4xl mb-6 md:mb-8'>
                    <h2 className='text-xl font-bold text-primary mb-4'>All Quiz Results</h2>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white border border-gray-300'>
                            <thead className='bg-secondary text-white'>
                                <tr>
                                    <th className='px-6 py-3 text-medium text-lg'>Sr. No.</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Subject</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Date</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Set</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Attempts</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Points</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Status</th>
                                    <th className='px-6 py-3 text-medium text-lg'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiResult.map((result, index) => (
                                    <>
                                        <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(index)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.subject?.name || "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(result.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {result.set || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.attempts || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.points || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    result.achieved === "A" ? "bg-green-100 text-green-800" :
                                                    result.achieved === "B" ? "bg-blue-100 text-blue-800" :
                                                    result.achieved === "C" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}>
                                                    {result.achieved || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {expandedRows.has(index) ? <FaChevronUp /> : <FaChevronDown />}
                                            </td>
                                        </tr>
                                        {expandedRows.has(index) && (
                                            <React.Fragment>
                                                <tr>
                                                    <td colSpan="6" className='p-4'>
                                                        <h3 className='text-lg font-bold mb-4 text-center text-blue-600'>
                                                            <span className='font-semibold text-black'>Result Details:</span> {new Date(result.createdAt).toLocaleString()}
                                                        </h3>
                                                        <table className='min-w-full bg-gray-100 border'>
                                                            <thead>
                                                                <tr>
                                                                    <th className='px-6 py-3 text-medium text-lg'>Q#</th>
                                                                    <th className='px-6 py-3 text-medium text-lg'>Answer</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {result.result && result.result.map((ans, idx) => (
                                                                    <tr key={idx} className='text-center'>
                                                                        <td className='px-6 py-4 border text-medium text-lg'>{idx + 1}</td>
                                                                        <td className='px-6 py-4 border text-medium text-lg'>{ans !== null ? ans : 'N/A'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className='bg-white p-4 md:p-6 rounded-md shadow-lg border border-gray-200 w-full max-w-md md:max-w-3xl mb-6 md:mb-8'>
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Username</span>
                        <span className='font-bold text-sm md:text-lg text-gray-800'>{userId || ""}</span>
                    </div>
                    
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Total Marks:</span>
                        <span className='font-bold text-sm md:text-lg text-gray-800'>{totalPoints || 0}</span>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Total Questions:</span>
                        <span className='font-bold text-sm md:text-lg text-gray-800'>{queue.length || 0}</span>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Questions Attempted:</span>
                        <span className='font-bold text-sm md:text-lg text-gray-800'>{attempts || 0}</span>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Your Marks:</span>
                        <span className='font-bold text-sm md:text-lg text-gray-800'>{earnPoints || 0}</span>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Quiz Result:</span>
                        <span style={{ color: `${flag ? "#10B981" : "#ff2a66"}` }} className='font-bold'>{flag ? "Passed" : "Failed"}</span>
                    </div>
                    <div className='flex justify-between mb-4'>
                        <span className='text-sm md:text-lg text-tertiary'>Grade:</span>
                        <span className='font-bold text-sm md:text-lg text-gray-800'>{grade}</span>
                    </div>
                </div>
            )}

            {/* Restart Button */}
            <div className='mb-8'>
                <Link to={'/'} onClick={onRestart} className='btn bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary'>Restart</Link>
            </div>

            {/* Displaying the Result Table */}
            <div className='w-full max-w-4xl'>
                <ResultTable />
            </div>
        </div>
    )
}