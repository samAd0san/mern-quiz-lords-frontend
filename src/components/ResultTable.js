import React, { useEffect } from 'react'
import { attempts_Number, earnPoints_Number, flagResult } from '../helper/helper';
import { useDispatch, useSelector } from 'react-redux';


export default function ResultTable() {

    const dispatch = useDispatch();
    const { questions : { queue ,answers}, result : { result, userId}}  = useSelector(state => state)

    useEffect(() => {
        console.log(flag)
    })
    
    const totalPoints = queue.length * 1; 
    const attempts = attempts_Number(result);
    const earnPoints = earnPoints_Number(result, answers, 1)
    const flag = flagResult(totalPoints, earnPoints)

    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-300'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Attempted</th>
                        <th className='px-4 py-2'>Marks</th>
                        <th className='px-4 py-2'>Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='border-b text-center'>
                        <td className='px-4 py-2'>Abdus Samad</td>
                        <td className='px-4 py-2'>{attempts || 0}</td>
                        <td className='px-4 py-2'>{earnPoints || 0}</td><td className={`px-4 py-2 ${flag ? 'text-green-500' : 'text-red-500 '}`}>{flag ? "Passed" : "Failed"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}