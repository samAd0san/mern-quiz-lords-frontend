import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ResultTable() {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector(state => state.result.userId);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data on component mount
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                // Fetch all results from the API
                const resultResponse = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URI}/api/result`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Result API response:", resultResponse.data);
                
                if (resultResponse.data && resultResponse.data.status === "success" && resultResponse.data.data) {
                    setData(resultResponse.data.data);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleRowClick = (index) => {
        setExpandedRows(prevState => {
            const newExpandedRows = new Set(prevState);
            if (newExpandedRows.has(index)) {
                newExpandedRows.delete(index);
            } else {
                newExpandedRows.add(index);
            }
            return newExpandedRows;
        });
    };

    const exportToPDF = () => {
        const input = document.getElementById('result-table');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('result-table.pdf');
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                <div className="flex items-center justify-center mb-4">
                    <FaSpinner className="text-red-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-bold text-red-700">Unable to Load Results</h2>
                </div>
                <p className="text-gray-700 mb-4">
                    {error}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => navigate('/')} 
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                    >
                        Back to Home
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                    If the problem persists, please contact your administrator.
                </p>
            </div>
        );
    }

    return (
        <div className='overflow-x-auto'>
            {data.length > 0 && (
                <button 
                    onClick={exportToPDF} 
                    className='bg-blue-500 text-white px-4 py-2 rounded mt-2 mb-2 ml-2 hover:bg-blue-600'
                >
                    Export to PDF
                </button>
            )}
            <table id='result-table' className='min-w-full bg-white border border-gray-300 mt-4 mb-20'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-6 py-3 text-medium text-lg'>SR</th>
                        <th className='px-6 py-3 text-medium text-lg'>Subject</th>
                        <th className='px-6 py-3 text-medium text-lg'>Date</th>
                        <th className='px-6 py-3 text-medium text-lg'>Attempted</th>
                        <th className='px-6 py-3 text-medium text-lg'>Points</th>
                        <th className='px-6 py-3 text-medium text-lg'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4 font-bold text-red-500 text-2xl">No Results Found</td>
                        </tr>
                    ) : (
                        data.map((v, i) => (
                            <React.Fragment key={i}>
                                <tr 
                                    className='table-body border-b text-center cursor-pointer hover:bg-gray-100' 
                                    onClick={() => handleRowClick(i)}
                                >
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{i + 1}</td>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>
                                        {v.subject?.name || "N/A"}
                                    </td>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>
                                        {new Date(v.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v.attempts || 0}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v.points || 0}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                            v.achieved === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {v.achieved || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                                {expandedRows.has(i) && (
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan="6" className='p-4'>
                                                <h3 className='text-lg font-bold mb-4 text-center text-blue-600'>
                                                    <span className='font-semibold text-black'>Result Details:</span> {new Date(v.createdAt).toLocaleString()}
                                                </h3>
                                                <table className='min-w-full bg-gray-100 border'>
                                                    <thead>
                                                        <tr>
                                                            <th className='px-6 py-3 text-medium text-lg'>Q#</th>
                                                            <th className='px-6 py-3 text-medium text-lg'>Answer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {v.result && v.result.map((ans, idx) => (
                                                            <tr key={idx} className='text-center'>
                                                                <td className='px-6 py-4 border text-medium text-lg'>{idx + 1}</td>
                                                                <td className='px-6 py-4 border text-medium text-lg'>{ans !== null ? ans : 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}