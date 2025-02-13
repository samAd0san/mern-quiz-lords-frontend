import React, { useEffect, useState } from 'react';
import { getServerData } from '../helper/helper';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultTable() {
    const [data, setData] = useState([]);
    const [branch, setBranch] = useState('');  // Branch filter
    const [year, setYear] = useState('');      // Year filter
    const [section, setSection] = useState(''); // Section filter

    // Fetch results based on filters (branch, year, section)
    const fetchResults = () => {
        let apiUrl = `${process.env.REACT_APP_BACKEND_URI}/api/result/branch/${branch}/year/${year}`;
        if (section) {
            apiUrl += `/section/${section}`;
        }
        getServerData(apiUrl, (res) => {
            setData(res);
        });
    };

    // UseEffect to load data when filters change
    useEffect(() => {
        if (branch && year) {
            fetchResults();
        }
    }, [branch, year, section]);

    const exportToPDF = () => {
        const input = document.getElementById('result-table');
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 0.5);
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`result-table-${year}-${section}`);
        });
    };

    return (
        <div className='overflow-x-auto'>
            <div className='flex gap-4 mb-4 mt-5'>
                {/* Branch Dropdown */}
                <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className='bg-white border border-gray-300 px-4 py-2 rounded'
                >
                    <option value="">Select Branch</option>
                    <option value="cse">CSE</option>
                    <option value="ece">ECE</option>
                    <option value="mech">MECH</option>
                    {/* Add more branches as needed */}
                </select>

                {/* Year Dropdown */}
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className='bg-white border border-gray-300 px-4 py-2 rounded'
                >
                    <option value="">Select Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    {/* Add more years if needed */}
                </select>

                {/* Section Dropdown */}
                <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className='bg-white border border-gray-300 px-4 py-2 rounded'
                >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    {/* Add more sections as needed */}
                </select>

                <button
                    onClick={fetchResults}
                    className='bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600'
                >
                    Apply Filters
                </button>

                <button 
                    onClick={exportToPDF} 
                    className='bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600'
                >
                    Export to PDF
                </button>
            </div>

            <table id='result-table' className='min-w-full bg-white border border-gray-300 mt-4 mb-20'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-6 py-3 text-medium text-lg'>S.No</th>
                        <th className='px-6 py-3 text-medium text-lg'>Roll Number</th>
                        <th className='px-6 py-3 text-medium text-lg'>Name</th>
                        <th className='px-6 py-3 text-medium text-lg'>Marks</th>
                        <th className='px-6 py-3 text-medium text-lg'>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-4 font-bold text-red-500 text-2xl">No Data Found</td>
                        </tr>
                    ) : (
                        data.map((v, i) => (
                            <React.Fragment key={i}>
                                <tr 
                                    className='table-body border-b text-center cursor-pointer hover:bg-gray-100' 
                                >
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{i + 1}</td>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{v?.rollNo || ''}</td>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{v?.firstName || ''}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v?.points || 0}</td>
                                    <td className={`px-6 py-4 text-medium text-lg ${v?.achieved === 'Failed' ? 'text-red-500' : 'text-green-500'}`}>{v?.achieved}</td>
                                </tr>
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}