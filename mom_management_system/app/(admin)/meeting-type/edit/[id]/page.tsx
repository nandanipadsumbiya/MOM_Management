import React from 'react'
import { prisma } from '@/lib/prisma';
import { EditMeetingTypeAction } from '@/app/actions/EditMeetingTypeAction';
import { notFound } from 'next/navigation';

export default async function EditMeetingType({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const typeId = parseInt(id);
    const meetingType = await prisma.meetingtype.findUnique({
        where: { MeetingTypeID: typeId },
    });

    if (!meetingType) {
        notFound();
    }

    const updateMeetingTypeWithId = EditMeetingTypeAction.bind(null, typeId);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Meeting Type</h2>
                <form action={updateMeetingTypeWithId} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Type Name</label>
                        <input name="MeetingTypeName" type="text" defaultValue={meetingType.MeetingTypeName} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Remarks</label>
                        <textarea name="Remarks" defaultValue={meetingType.Remarks || ''} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-slate-900 transition font-medium">
                            Update Meeting Type
                        </button>
                        <a href="/meeting-type" className="w-full text-center py-2 text-slate-500 hover:text-slate-700 text-sm transition">
                            Back to List
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
