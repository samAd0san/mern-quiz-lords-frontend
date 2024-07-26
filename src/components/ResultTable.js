import React, { useEffect, useState } from 'react';
import { getServerData } from '../helper/helper';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResultTable() {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());

    useEffect(() => {
        getServerData("https://mern-quiz-lords-backend.onrender.com/api/result", (res) => {
            setData(res);
        });
    }, []);

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

    return (
        <div className='overflow-x-auto'>
            <button 
                onClick={exportToPDF} 
                className='bg-blue-500 text-white px-4 py-2 rounded mt-2 mb-2 ml-2 hover:bg-blue-600'
            >
                Export to PDF
            </button>
            <table id='result-table' className='min-w-full bg-white border border-gray-300 mt-4 mb-20'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-6 py-3 text-medium text-lg'>SR</th>
                        <th className='px-6 py-3 text-medium text-lg'>Roll Number</th>
                        <th className='px-6 py-3 text-medium text-lg'>Attempted</th>
                        <th className='px-6 py-3 text-medium text-lg'>Total Marks</th>
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
                                    onClick={() => handleRowClick(i)}
                                >
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{i + 1}</td>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{v?.username || ''}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v?.attempts || 0}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v?.points || 0}</td>
                                </tr>
                                {expandedRows.has(i) && (
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan="4" className='p-4'>
                                                <h3 className='text-lg font-bold mb-4 text-center text-blue-600'><span className='font-semibold text-black'>Roll Number:</span> {v?.username || ''}</h3>
                                                <table className='min-w-full bg-gray-100 border'>
                                                    <thead>
                                                        <tr>
                                                            <th className='px-6 py-3 text-medium text-lg'>Q#</th>
                                                            <th className='px-6 py-3 text-medium text-lg'>Answer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {v?.result?.map((ans, idx) => (
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