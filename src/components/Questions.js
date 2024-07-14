import React, { useEffect, useState } from 'react';
import { useFetchQuestion } from '../hooks/FetchQuestions';
import { useSelector } from 'react-redux';

// This component displays the questions and options, it is a usable component
export default function Questions() {
    const [checked, setChecked] = useState(undefined); // State to track the selected radio button option
    const [{ isLoading, apiData, serverError }, setGetData] = useFetchQuestion(); // Use custom hook to fetch questions

    // Select the current question from Redux store
    const questions = useSelector(state => state.questions.queue[state.questions.trace]) // instead of giving [0] we are giving trace


    useEffect(() => {
        // console.log(questions); // This will give only the current question
    }, [questions]);

    function onSelect(e) {
        // console.log('radio button change');
    }

    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-primary mb-4">{questions?.question}</h2>

            <ul key={questions?.id} className="space-y-4">
                {questions?.options.map((q, i) => (
                    <li key={i} className="flex items-center">
                        <input 
                            type="radio"
                            value={q}
                            name="options"
                            id={`q${i}-option`}
                            onChange={onSelect}
                            className="mr-2"
                        />
                        <label className="text-lg text-tertiary" htmlFor={`q${i}-option`}>{q}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
}