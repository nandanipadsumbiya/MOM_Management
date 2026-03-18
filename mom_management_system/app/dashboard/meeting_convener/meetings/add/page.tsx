import React from 'react'
import { prisma } from '@/lib/prisma'
import AddMeetingForm from '@/app/components/AddMeetingForm';
import { Calendar } from 'lucide-react';

export default async function AddMeetingConvener() {
    const meetingTypes = await prisma.meetingtype.findMany();

    return (
        <div className="flex items-center justify-center p-4 animate-in fade-in duration-500 min-h-[calc(100vh-100px)]">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm w-full max-w-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <Calendar size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Schedule Meeting</h1>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Initialize System Registry Entry</p>
                        </div>
                    </div>

                    <AddMeetingForm 
                        meetingTypes={meetingTypes} 
                        backLink="/dashboard/meeting_convener/meetings" 
                    />
                </div>
            </div>
        </div>
    )
}
