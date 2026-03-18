import { prisma } from '@/lib/prisma'
import Link from 'next/link';
import React from 'react'

export default async function MeetingTypeDetails({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const type = await prisma.meetingtype.findFirst({
        where: { MeetingTypeID: Number(id) }
    })

    if (!type) return <div className="p-6">Meeting Type not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Meeting Type Details</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Type Name</label>
                        <p className="text-lg text-gray-900">{type.MeetingTypeName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Remarks</label>
                        <p className="text-lg text-gray-900">{type.Remarks || 'N/A'}</p>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Link href={`/meeting-type/edit/${id}`} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-slate-900 transition font-medium">
                        Edit
                    </Link>
                    <Link href="/meeting-type" className="px-6 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition font-medium">
                        Back to List
                    </Link>
                </div>
            </div>
        </div>
    )
}
