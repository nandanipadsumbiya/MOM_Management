import React from 'react'
import { prisma } from '@/lib/prisma'
import EditMeetingAction from '@/app/actions/EditMeetingAction'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditMeeting({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const meetingId = parseInt(id);

    const meeting = await prisma.meetings.findUnique({
        where: { MeetingID: meetingId },
    });

    if (!meeting) {
        notFound();
    }

    const meetingTypes = await prisma.meetingtype.findMany();

    // Format date and times for input defaults
    const meetingDate = new Date(meeting.MeetingDate).toISOString().split('T')[0];
   
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Meeting Details</h2>
                <form action={EditMeetingAction} className="space-y-4">
                    <input type="hidden" name="MeetingID" value={meetingId} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Meeting Date</label>
                            <input name="MeetingDate" type="date" defaultValue={meetingDate} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Meeting Type</label>
                            <select name="MeetingTypeID" defaultValue={meeting.MeetingTypeID} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Type</option>
                                {meetingTypes.map(t => (
                                    <option key={t.MeetingTypeID} value={t.MeetingTypeID}>{t.MeetingTypeName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                

                   

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Meeting Description</label>
                        <input name="MeetingDescription" type="text" defaultValue={meeting.MeetingDescription ?? ""} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                  

                    <div className="grid grid-cols-2 gap-4">
                       
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Attach New Document (Optional)</label>
                            <input name="DocumentPath" type="file" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-6">
                        <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-slate-900 transition font-semibold">
                            Update Meeting
                        </button>
                        <Link href="/meetings" className="w-full text-center py-2 text-slate-500 hover:text-slate-700 text-sm transition font-medium">
                            Back to List
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
