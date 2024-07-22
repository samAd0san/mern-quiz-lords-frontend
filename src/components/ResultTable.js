import React, { useEffect, useState } from 'react'
import { getServerData } from '../helper/helper'


export default function ResultTable() {

    const [data, setData] = useState([])

    useEffect(() => {
        getServerData("https://mern-quiz-lords-backend.onrender.com/api/result", (res) => {
            setData(res)
        })
    })

    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-300 mt-20 mb-20'>
                <thead className='bg-secondary text-white'>
                    <tr>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Attempted</th>
                        <th className='px-4 py-2'>Marks</th>
                        <th className='px-4 py-2'>Result</th>
                    </tr>
                </thead>
                <tbody>
                { !data ?? <div>No Data Found </div>}
                {
                    data.map((v, i) => (
                        <tr className='table-body border-b text-center' key={i}>
                            <td>{v?.username || ''}</td>
                            <td>{v?.attempts || 0}</td>
                            <td>{v?.points || 0}</td>
                            <td>{v?.achived || ""}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}