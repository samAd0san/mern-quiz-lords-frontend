import React from 'react';

export default function ResultTable() {
    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-300'>
                <thead className='bg-primary text-white'>
                    <tr>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Attempts</th>
                        <th className='px-4 py-2'>Earn Points</th>
                        <th className='px-4 py-2'>Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='border-b text-center'>
                        <td className='px-4 py-2'>Abdus Samad</td>
                        <td className='px-4 py-2'>03</td>
                        <td className='px-4 py-2'>20</td>
                        <td className='px-4 py-2'>Passed</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}