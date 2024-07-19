import React, { useEffect, useState } from 'react';
import Questions from './Questions';
import { useDispatch, useSelector } from 'react-redux';
import { MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestions';
import { PushAnswer } from '../hooks/setResult';
import { Navigate } from 'react-router-dom';

// This component displays the quiz application
export default function Quiz() {

    const [check, setChecked] = useState(undefined)

    // Gets the state from the store
    const result = useSelector(state => state.result.result);
    const {queue, trace} = useSelector(state => state.questions);
    const dispatch = useDispatch(); // Get the dispatch function to send actions to the Redux store

    useEffect(() => {
        console.log(result)
        // console.log(queue)
        // console.log(trace) // This will give the current question index
    });

    function onNext() {
        // console.log('On next click');

        if (trace < queue.length) {
            dispatch(MoveNextQuestion());
            
            if (result.length <= trace) { // If the result array is less than the current question index
                dispatch(PushAnswer(check)) // Push the selected answer to the result array
            }
        }
        /** reset the value of the checked variable */
        setChecked(undefined)
    }

    function onPrev() {
        // console.log('On prev click');
        if (trace > 0) {
            dispatch(MovePrevQuestion());
        }
    }

    function onChecked(check) {
        console.log(check)
        setChecked(check)
    }

    if (result.length && result.length >= queue.length) { // If the result array is equal to the number of questions
        return <Navigate to={'/result'} replace={true}></Navigate>
    }

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-primary mb-8">Quiz Application</h1>

            {/* Display questions */}
            <div className="w-full max-w-3xl mb-8">
                <Questions onChecked={onChecked}/>
            </div>

            <div className="flex justify-between w-full max-w-3xl">
                {trace > 0 ? <button className="btn bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary" onClick={onPrev}>Prev</button> : <div></div> }
                <button className="btn bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary" onClick={onNext}>Next</button>
            </div>
        </div>
    );
}
