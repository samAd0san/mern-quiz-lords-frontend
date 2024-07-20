import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import ResultTable from './ResultTable';
import { useDispatch, useSelector } from 'react-redux';
import { attempts_Number, earnPoints_Number, flagResult } from '../helper/helper';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';

export default function Result() {

    const dispatch = useDispatch();
    const { questions : { queue ,answers}, result : { result, userId}}  = useSelector(state => state)

    useEffect(() => {
        console.log(flag)
    })

    const totalPoints = queue.length * 1; 
    const attempts = attempts_Number(result);
    const earnPoints = earnPoints_Number(result, answers, 1)
    const flag = flagResult(totalPoints, earnPoints)

    function onRestart(){ // Function to restart the quiz
        console.log('on Restart')
        dispatch(resetAllAction()); // reset the question state
        dispatch(resetResultAction()); // reset the result state
    }

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-bold text-secondary mb-8'>Quiz Application</h1>

            <div className='bg-white p-6 rounded-md shadow-md w-full max-w-3xl mb-8'>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Username</span>
                    <span className='font-bold text-lg text-gray-800'>Abdus Samad</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Total Marks:</span>
                    <span className='font-bold text-lg text-gray-800'>{totalPoints || 0}</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Total Questions:</span>
                    <span className='font-bold text-lg text-gray-800'>{ queue.length || 0}</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Questions Attempted:</span>
                    <span className='font-bold text-lg text-gray-800'>{attempts || 0}</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Your Marks:</span>
                    <span className='font-bold text-lg text-gray-800'>{earnPoints || 0}</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Quiz Result:</span>
                    <span style={{ color : `${flag ? "#2aff95" : "#ff2a66" }` }} className='bold'>{flag ? "Passed" : "Failed"}</span>
                </div>
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