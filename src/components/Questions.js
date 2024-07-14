import React, { useEffect, useState } from 'react';
import data from '../database/data';

export default function Questions() {
    const [checked, setChecked] = useState(undefined);

    const question = data[0];

    useEffect(() => {
        console.log(question);
    }, [question]);

    function onSelect(e) {
        setChecked(e.target.value);
        console.log('radio button change');
    }

    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-primary mb-4">{question.question}</h2>

            <ul key={question.id} className="space-y-4">
                {question.options.map((q, i) => (
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