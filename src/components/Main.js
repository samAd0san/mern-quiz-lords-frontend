import React, { useRef } from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { setUserId } from '../redux/result_reducer'

const Main = () => {
    const inputRef = useRef(null);
    const dispatch = useDispatch()

    function startQuiz(){
        if(inputRef.current?.value){
            dispatch(setUserId(inputRef.current?.value))
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-secondary mb-4 mt-4">Quiz Application</h1>

            <ol className="list-decimal list-inside text-lg text-black font-medium space-y-1 mb-8">
                <li>You will be asked 30 questions one after another.</li>
                <li>One Mark is awarded for the correct answer.</li>
                <li>The result will be declared at the end of the quiz.</li>
            </ol>

            <form id="form" className="w-full max-w-sm mb-8">
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder='Enter your name' 
                    className="w-full px-3 py-2 bg-gray-100 border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
            </form>

            <form id="form" className="w-full max-w-sm mb-8">
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder='Roll number' 
                    className="w-full px-3 py-2 bg-gray-100 border border-secondary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
            </form>

            <div>
                <Link 
                    className='btn inline-block px-6 py-3 bg-secondary text-white font-bold rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50'
                    to={'/quiz'}
                    onClick={startQuiz}
                >
                    Start Quiz
                </Link>
            </div>
        </div>
    );
}

export default Main;