import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaSpinner, FaFilter, FaDownload, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ResultTable() {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        year: '',
        semester: '',
        branch: '',
        section: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        years: [],
        semesters: [],
        branches: [],
        sections: []
    });
    const userId = useSelector(state => state.result.userId);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data on component mount
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const isFaculty = localStorage.getItem('isFaculty') === 'true';
                
                if (!token && !isFaculty) {
                    throw new Error('Authentication required');
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
                    
                    // Extract unique filter options from the data
                    const years = [...new Set(resultResponse.data.data.map(item => item.user?.year).filter(Boolean))];
                    const semesters = [...new Set(resultResponse.data.data.map(item => item.user?.semester).filter(Boolean))];
                    const branches = [...new Set(resultResponse.data.data.map(item => item.user?.branch).filter(Boolean))];
                    const sections = [...new Set(resultResponse.data.data.map(item => item.user?.section).filter(Boolean))];
                    
                    setFilterOptions({
                        years: years.sort((a, b) => a - b),
                        semesters: semesters.sort((a, b) => a - b),
                        branches: branches.sort(),
                        sections: sections.sort()
                    });
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Build query string from filters
            const queryParams = new URLSearchParams();
            if (filters.year) queryParams.append('year', filters.year);
            if (filters.semester) queryParams.append('semester', filters.semester);
            if (filters.branch) queryParams.append('branch', filters.branch);
            if (filters.section) queryParams.append('section', filters.section);

            const queryString = queryParams.toString();
            const url = queryString 
                ? `${process.env.REACT_APP_BACKEND_URI}/api/result/filter?${queryString}`
                : `${process.env.REACT_APP_BACKEND_URI}/api/result`;

            // Fetch filtered results
            const resultResponse = await axios.get(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Filtered Result API response:", resultResponse.data);
            
            if (resultResponse.data && resultResponse.data.status === "success") {
                // Handle both response formats (data array or data object)
                const resultData = Array.isArray(resultResponse.data.data) 
                    ? resultResponse.data.data 
                    : [resultResponse.data.data];
                
                setData(resultData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error applying filters:', error);
            setError(error.message || 'Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            year: '',
            semester: '',
            branch: '',
            section: ''
        });
        // Fetch all results again
        window.location.reload();
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
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Quiz Results</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className="bg-white/20 text-white px-3 py-1 rounded-md hover:bg-white/30 transition-colors duration-300 flex items-center"
                    >
                        <FaFilter className="mr-1" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                    </button>
            {data.length > 0 && (
                <button 
                    onClick={exportToPDF} 
                            className="bg-white/20 text-white px-3 py-1 rounded-md hover:bg-white/30 transition-colors duration-300 flex items-center"
                        >
                            <FaDownload className="mr-1" />
                            Export PDF
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">All Years</option>
                                {filterOptions.years.map(year => (
                                    <option key={year} value={year}>Year {year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                            <select
                                name="semester"
                                value={filters.semester}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">All Semesters</option>
                                {filterOptions.semesters.map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                            <select
                                name="branch"
                                value={filters.branch}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">All Branches</option>
                                {filterOptions.branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                            <select
                                name="section"
                                value={filters.section}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">All Sections</option>
                                {filterOptions.sections.map(section => (
                                    <option key={section} value={section}>Section {section}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button 
                            onClick={resetFilters} 
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                        >
                            Reset
                        </button>
                        <button 
                            onClick={applyFilters} 
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-300 flex items-center"
                        >
                            <FaSearch className="mr-1" />
                            Apply Filters
                </button>
                    </div>
                </div>
            )}

            <div className='overflow-x-auto'>
                <table id='result-table' className='min-w-full bg-white border border-gray-300'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-6 py-3 text-medium text-lg'>SR</th>
                            <th className='px-6 py-3 text-medium text-lg'>Roll Number</th>
                            <th className='px-6 py-3 text-medium text-lg'>Student Name</th>
                            <th className='px-6 py-3 text-medium text-lg'>Subject</th>
                            <th className='px-6 py-3 text-medium text-lg'>Set</th>
                        <th className='px-6 py-3 text-medium text-lg'>Date</th>
                        <th className='px-6 py-3 text-medium text-lg'>Attempted</th>
                        <th className='px-6 py-3 text-medium text-lg'>Points</th>
                        <th className='px-6 py-3 text-medium text-lg'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                                <td colSpan="9" className="text-center py-4 font-bold text-red-500 text-2xl">No Results Found</td>
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
                                            {v.rollNumber || v.user?.rollNo || "N/A"}
                                        </td>
                                        <td className='px-6 py-4 font-bold text-medium text-lg'>
                                            {v.user ? `${v.user.firstName} ${v.user.lastName}` : "N/A"}
                                        </td>
                                        <td className='px-6 py-4 font-bold text-medium text-lg'>
                                            {v.subject?.name || "N/A"}
                                        </td>
                                        <td className='px-6 py-4 font-bold text-medium text-lg'>
                                            {v.set || "N/A"}
                                        </td>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>
                                        {new Date(v.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v.attempts || 0}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v.points || 0}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                v.achieved === 'Pass' || v.achieved === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {v.achieved || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                                {expandedRows.has(i) && (
                                    <React.Fragment>
                                        <tr>
                                                <td colSpan="9" className='p-4 bg-gray-50'>
                                                    <div className="bg-white rounded-lg shadow-sm p-4">
                                                <h3 className='text-lg font-bold mb-4 text-center text-blue-600'>
                                                    <span className='font-semibold text-black'>Result Details:</span> {new Date(v.createdAt).toLocaleString()}
                                                </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <h4 className="font-semibold text-gray-700 mb-2">Student Information</h4>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="text-gray-600">Name:</div>
                                                                    <div className="font-medium">{v.user ? `${v.user.firstName} ${v.user.lastName}` : "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Roll Number:</div>
                                                                    <div className="font-medium">{v.rollNumber || v.user?.rollNo || "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Branch:</div>
                                                                    <div className="font-medium">{v.user?.branch || "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Year:</div>
                                                                    <div className="font-medium">{v.user?.year || "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Semester:</div>
                                                                    <div className="font-medium">{v.user?.semester || "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Section:</div>
                                                                    <div className="font-medium">{v.user?.section || "N/A"}</div>
                                                                </div>
                                                            </div>
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <h4 className="font-semibold text-gray-700 mb-2">Quiz Information</h4>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="text-gray-600">Subject:</div>
                                                                    <div className="font-medium">{v.subject?.name || "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Set:</div>
                                                                    <div className="font-medium">{v.set || "N/A"}</div>
                                                                    
                                                                    <div className="text-gray-600">Date:</div>
                                                                    <div className="font-medium">{new Date(v.createdAt).toLocaleString()}</div>
                                                                    
                                                                    <div className="text-gray-600">Attempts:</div>
                                                                    <div className="font-medium">{v.attempts || 0}</div>
                                                                    
                                                                    <div className="text-gray-600">Points:</div>
                                                                    <div className="font-medium">{v.points || 0}</div>
                                                                    
                                                                    <div className="text-gray-600">Status:</div>
                                                                    <div className="font-medium">
                                                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                                            v.achieved === 'Pass' || v.achieved === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                            {v.achieved || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <table className='min-w-full bg-gray-100 border rounded-lg overflow-hidden'>
                                                            <thead className="bg-gray-200">
                                                        <tr>
                                                            <th className='px-6 py-3 text-medium text-lg'>Q#</th>
                                                            <th className='px-6 py-3 text-medium text-lg'>Answer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {v.result && v.result.map((ans, idx) => (
                                                                    <tr key={idx} className='text-center border-t border-gray-200'>
                                                                <td className='px-6 py-4 border text-medium text-lg'>{idx + 1}</td>
                                                                <td className='px-6 py-4 border text-medium text-lg'>{ans !== null ? ans : 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                    </div>
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
        </div>
    );
}