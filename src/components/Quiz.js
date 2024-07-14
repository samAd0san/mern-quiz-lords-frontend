import React from 'react';
import Questions from './Questions';

export default function Quiz() {
    function onNext() {
        console.log('On next click');
    }

    function onPrev() {
        console.log('On prev click');
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
