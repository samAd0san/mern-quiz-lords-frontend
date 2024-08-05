import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setSelectedSubject(event.target.value);
        if (event.target.value === 'CD') {
            navigate('/main'); // Redirect to Main component
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
                Welcome to the Student Portal
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-8 text-center max-w-lg">
                Select a subject to begin your test. You can explore various subjects and take interactive quizzes to assess your knowledge.
            </p>

            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Select Subject</h2>
                <select
                    value={selectedSubject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                    <option value="">-- Select an Option --</option>
                    <option value="CD">Compiler Design</option>
                    <option value="DS">Data Structures</option>
                    <option value="AL">Algorithms</option>
                    {/* Add more options here as needed */}
                </select>
            </div>
        </div>
    );
};

export default Home;
