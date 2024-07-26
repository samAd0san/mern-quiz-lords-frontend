import React, { useEffect, useState } from 'react';
import { getServerData } from '../helper/helper';

export default function ResultTable() {
    const [data, setData] = useState([]);
    
    /** 
     * Initially, if expandedRow is null and you click on a row, the handleRowClick function will set expandedRow to the index of the clicked row.
     * So, if you click on a row with index 2, the value of expandedRow will be 2.
     */
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        getServerData("https://mern-quiz-lords-backend.onrender.com/api/result", (res) => {
            setData(res);
        });
    }, []);

    const handleRowClick = (index) => {J
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-300 mt-20 mb-20'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-6 py-3 text-medium text-lg'>Roll Number</th>
                        <th className='px-6 py-3 text-medium text-lg'>Attempted</th>
                        <th className='px-6 py-3 text-medium text-lg'>Total Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center py-4 text-medium text-lg">No Data Found</td>
                        </tr>
                    ) : (
                        data.map((v, i) => (
                            <React.Fragment key={i}>
                                <tr className='table-body border-b text-center cursor-pointer hover:bg-gray-200' onClick={() => handleRowClick(i)}>
                                    <td className='px-6 py-4 font-bold text-medium text-lg'>{v?.username || ''}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v?.attempts || 0}</td>
                                    <td className='px-6 py-4 text-medium text-lg'>{v?.points || 0}</td>
                                </tr>
                                {expandedRow === i && (
                                    <tr>
                                        <td colSpan="3" className='p-4'>
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
                                                            <td className='px-6 py-4 border text-medium text-lg'>{idx}</td>
                                                            <td className='px-6 py-4 border text-medium text-lg'>{ans !== null ? ans : 'N/A'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}