import React, { useEffect, useState } from 'react';
import { useFetchQuestion } from '../hooks/FetchQuestions';
import { useDispatch, useSelector } from 'react-redux';
import { updateResult } from '../hooks/setResult';

// This component displays the questions and options, it is a usable component
export default function Questions({ onChecked }) {
    const [checked, setChecked] = useState(undefined); // State to track the selected radio button option
    const { trace } = useSelector(state => state.questions) // Get the current question index from the Redux store
    const result = useSelector(state => state.result.result);
    const [{ isLoading, apiData, serverError }, setGetData] = useFetchQuestion(); // Use custom hook to fetch questions

    // Select the current question from Redux store
    const questions = useSelector(state => state.questions.queue[state.questions.trace]) // instead of giving [0] we are giving trace
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log(questions); // This will give only the current question
        dispatch(updateResult({trace, checked})) // Update the result array with the current question and selected option
    }, [checked]);

    function onSelect(i) {
        // console.log('radio button change');
        onChecked(i);
        setChecked(i);
        dispatch(updateResult({ trace, checked}));
    }

    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-secondary mb-4">{questions?.question}</h2>

            <ul key={questions?.id} className="space-y-4">
                {questions?.options.map((q, i) => (
                    <li key={i} className="flex items-center">
                        <input 
                            type="radio"
                            value={q}
                            name="options"
                            id={`q${i}-option`}
                            onChange={() => onSelect(i)}
                            className="mr-2"
                        />
                        <label className="text-lg text-tertiary" htmlFor={`q${i}-option`}>{q}</label>
                        <div className={`check ${result[trace] == i ? 'checked' : ''}`}></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}