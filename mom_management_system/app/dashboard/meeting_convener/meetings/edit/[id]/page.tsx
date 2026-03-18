import React from 'react'
import { prisma } from '@/lib/prisma'
import EditMeetingAction from '@/app/actions/EditMeetingAction'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from '@/lib/auth-server'
import { Calendar, Clock, Edit } from 'lucide-react'

export default async function ConvenerEditMeeting({ params }: { params: Promise<{ id: string }> }) {
    const user = await getServerSession();
    if (!user || user.role !== 'meeting_convener') {
        redirect('/login');
    }

    const { id } = await params;
    const meetingId = parseInt(id);

    const meeting = await prisma.meetings.findUnique({
        where: { MeetingID: meetingId },
    });

    if (!meeting) {
        notFound();
    }

    const meetingTypes = await prisma.meetingtype.findMany();
    const meetingDate = new Date(meeting.MeetingDate).toISOString().split('T')[0];
   
    return (
        <div className="flex items-center justify-center p-4 animate-in fade-in duration-500 min-h-[calc(100vh-100px)]">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm w-full max-w-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <Edit size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Edit Meeting</h1>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Registry Update #M-{meeting.MeetingID}</p>
                        </div>
                    </div>

                    <form action={EditMeetingAction} className="space-y-6">
                        <input type="hidden" name="MeetingID" value={meetingId} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5">Meeting Date</label>
                                <input 
                                    name="MeetingDate" 
                                    type="date" 
                                    defaultValue={meetingDate} 
                                    required 
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-bold text-sm text-slate-900 dark:text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5">Meeting Type</label>
                                <select 
                                    name="MeetingTypeID" 
                                    defaultValue={meeting.MeetingTypeID} 
                                    required 
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-bold text-sm text-slate-900 dark:text-white appearance-none"
                                >
                                    <option value="">Select Type</option>
                                    {meetingTypes.map(t => (
                                        <option key={t.MeetingTypeID} value={t.MeetingTypeID}>{t.MeetingTypeName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5">Meeting Description</label>
                            <textarea 
                                name="MeetingDescription" 
                                defaultValue={meeting.MeetingDescription ?? ""} 
                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-bold text-sm text-slate-900 dark:text-white" 
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5">Attached Document</label>
                            <div className="relative group">
                                <input 
                                    name="DocumentPath" 
                                    type="file" 
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all font-bold text-xs text-slate-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-black file:text-white dark:file:bg-white dark:file:text-black hover:file:opacity-80 cursor-pointer" 
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Leave empty to keep existing artifact.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <button 
                                type="submit" 
                                className="flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl hover:bg-slate-900 dark:hover:bg-slate-100 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-black/10 active:scale-[0.98]"
                            >
                                Update Registry
                            </button>
                            <Link 
                                href="/dashboard/meeting_convener/meetings" 
                                className="flex-1 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold uppercase tracking-widest text-[10px] text-center"
                            >
                                Cancel & Return
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
