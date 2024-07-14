import React, { useEffect } from 'react';
import Questions from './Questions';
import { useDispatch, useSelector } from 'react-redux';
import { MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestions';
import { PushAnswer } from '../hooks/setResult';

// This component displays the quiz application
export default function Quiz() {

    // Gets the state from the store
    const state = useSelector(state => state)
    const {queue, trace} = useSelector(state => state.questions)
    const dispatch = useDispatch(); // Get the dispatch function to send actions to the Redux store

    useEffect(() => {
        console.log(state)
        // console.log(queue)
        // console.log(trace) // This will give the current question index
    });

    function onNext() {
        // console.log('On next click');

        if (trace < queue.length) {
            dispatch(MoveNextQuestion());
            dispatch(PushAnswer(1)) // Basically 1 will be added as the answer as we go next...
        }
    }

    function onPrev() {
        // console.log('On prev click');

        if (trace > 0) {
            dispatch(MovePrevQuestion());
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-primary mb-8">Quiz Application</h1>

            {/* Display questions */}
            <div className="w-full max-w-3xl mb-8">
                <Questions />
            </div>

            <div className="flex justify-between w-full max-w-3xl">
                <button className="btn bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary" onClick={onPrev}>Prev</button>
                <button className="btn bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary" onClick={onNext}>Next</button>
            </div>
        </div>
    );
}
