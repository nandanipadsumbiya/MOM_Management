import React from 'react'
import { prisma } from '@/lib/prisma'
import { AddMeetingAction } from '@/app/actions/AddMeetingAction';
import AddMeetingForm from '@/app/components/AddMeetingForm';


export default async function AddMeeting() {
    const meetingTypes = await prisma.meetingtype.findMany();

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm w-full max-w-2xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Schedule New Meeting</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Add to system registry</p>
                </div>
                
                <AddMeetingForm 
                    meetingTypes={meetingTypes} 
                    backLink="/meetings" 
                />
            </div>
        </div>
    )
}
