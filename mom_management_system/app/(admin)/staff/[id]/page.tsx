import { prisma } from '@/lib/prisma'
import Link from 'next/link';
import React from 'react'

export default async function StaffDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const staff = await prisma.staff.findFirst({
        where: { StaffID: Number(id) }
    })

    if (!staff) return <div className="p-6">Staff member not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Staff Details</h1>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Staff Name</label>
                        <p className="text-lg text-gray-900 font-semibold">{staff.StaffName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Staff ID</label>
                        <p className="text-lg text-gray-900">#{staff.StaffID}</p>
                    </div>
                   
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Mobile No</label>
                        <p className="text-lg text-gray-900">{staff.MobileNo || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="text-lg text-gray-900">{staff.EmailAddress || 'N/A'}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-500">Remarks</label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1 min-h-[60px]">{staff.Remarks || 'No remarks provided.'}</p>
                </div>

                <div className="mt-8 flex gap-4">
                    <Link href="/staff" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
                        Back to List
                    </Link>
                    <Link href={`/staff/edit/${staff.StaffID}`} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium">
                        Edit Staff
                    </Link>
                </div>
            </div>
        </div>
    )
}