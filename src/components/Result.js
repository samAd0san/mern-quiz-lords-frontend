import React from 'react'
import { Link } from 'react-router-dom';
import ResultTable from './ResultTable';
import { useDispatch } from 'react-redux';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';

export default function Result() {

    const dispatch = useDispatch();

    function onRestart(){ // Function to restart the quiz
        console.log('on Restart')
        dispatch(resetAllAction()); // reset the question state
        dispatch(resetResultAction()); // reset the result state
    }

    return (
        <div className='min-h-screen bg-gray-200 flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-bold text-primary mb-8'>Quiz Application</h1>

            <div className='bg-white p-6 rounded-md shadow-md w-full max-w-3xl mb-8'>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Username</span>
                    <span className='font-bold text-lg text-gray-800'>Abdus Samad</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Total Quiz Points:</span>
                    <span className='font-bold text-lg text-gray-800'>50</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Total Questions:</span>
                    <span className='font-bold text-lg text-gray-800'>05</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Total Attempts:</span>
                    <span className='font-bold text-lg text-gray-800'>03</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Total Earn Points:</span>
                    <span className='font-bold text-lg text-gray-800'>30</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg text-tertiary'>Quiz Result:</span>
                    <span className='font-bold text-lg text-gray-800'>Passed</span>
                </div>
            </div>

            {/* Restart Button */}
            <div className='mb-8'>
                <Link to={'/'} onClick={onRestart} className='btn bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary'>Restart</Link>
            </div>

            {/* Displaying the Result Table */}
            <div className='w-full max-w-4xl'>
                <ResultTable />
            </div>
        </div>
    )
}