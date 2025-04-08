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
import { FaTimesCircle } from 'react-icons/fa';

export default function Result() {
    const dispatch = useDispatch();
    const { questions: { queue, answers }, result: { result, userId } } = useSelector(state => state);
    const [apiResult, setApiResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Result component mounted with data:", { result, userId, queue, answers });
        
        // Fetch result from API
        const fetchResult = async () => {
            try {
                setLoading(true);
                
                // Get the selected subject ID from localStorage
                const selectedSubjectId = localStorage.getItem("selectedSubjectId");
                if (!selectedSubjectId) {
                    throw new Error("No subject selected");
                }
                
                // Get the token from localStorage
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }
                
                // Make API request to get the result
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URI}/api/result/filter?rollNumber=${userId}&subjectId=${selectedSubjectId}`,
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
            <h1 className='text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8'>Your Result</h1>

            <div className='bg-white p-4 md:p-6 rounded-md shadow-lg border border-gray-200 w-full max-w-md md:max-w-3xl mb-6 md:mb-8'>
                <div className='flex justify-between mb-4'>
                    <span className='text-sm md:text-lg text-tertiary'>Username</span>
                    <span className='font-bold text-sm md:text-lg text-gray-800'>{userId || ""}</span>
                </div>
                
                {apiResult && apiResult.length > 0 ? (
                    <>
                        <div className='flex justify-between mb-4'>
                            <span className='text-sm md:text-lg text-tertiary'>Subject:</span>
                            <span className='font-bold text-sm md:text-lg text-gray-800'>{apiResult[0].subject?.name || ""}</span>
                        </div>
                        <div className='flex justify-between mb-4'>
                            <span className='text-sm md:text-lg text-tertiary'>Total Questions:</span>
                            <span className='font-bold text-sm md:text-lg text-gray-800'>{apiResult[0].result?.length || 0}</span>
                        </div>
                        <div className='flex justify-between mb-4'>
                            <span className='text-sm md:text-lg text-tertiary'>Questions Attempted:</span>
                            <span className='font-bold text-sm md:text-lg text-gray-800'>{apiResult[0].attempts || 0}</span>
                        </div>
                        <div className='flex justify-between mb-4'>
                            <span className='text-sm md:text-lg text-tertiary'>Your Marks:</span>
                            <span className='font-bold text-sm md:text-lg text-gray-800'>{apiResult[0].points || 0}</span>
                        </div>
                        <div className='flex justify-between mb-4'>
                            <span className='text-sm md:text-lg text-tertiary'>Quiz Result:</span>
                            <span style={{ color: `${apiResult[0].achieved === "Passed" ? "#10B981" : "#ff2a66"}` }} className='font-bold'>{apiResult[0].achieved || ""}</span>
                        </div>
                    </>
                ) : (
                    <>
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
                    </>
                )}
                
                {apiResult && apiResult.length > 1 && (
                    <div className='mt-6 pt-4 border-t border-gray-200'>
                        <h2 className='text-xl font-bold text-primary mb-4'>Previous Attempts</h2>
                        <div className='overflow-x-auto'>
                            <table className='min-w-full bg-white border border-gray-200'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='px-4 py-2 text-left'>Date</th>
                                        <th className='px-4 py-2 text-left'>Attempts</th>
                                        <th className='px-4 py-2 text-left'>Points</th>
                                        <th className='px-4 py-2 text-left'>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiResult.slice(1).map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className='px-4 py-2'>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className='px-4 py-2'>{item.attempts}</td>
                                            <td className='px-4 py-2'>{item.points}</td>
                                            <td className='px-4 py-2'>{item.achieved}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

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