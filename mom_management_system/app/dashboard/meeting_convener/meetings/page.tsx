import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteMeeting from '@/app/ui/DeleteMeeting'
import SearchBar from '@/app/ui/SearchBar'
import { Calendar, Clock, FileDown, Eye, Edit3, Search, Plus } from 'lucide-react'
import { getServerSession } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function ConvenerMeetingList({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>
}) {
    const user = await getServerSession();
    if (!user || user.role !== 'meeting_convener') {
        redirect('/login');
    }

    const query = (await searchParams).query || "";

    const data = await prisma.meetings.findMany({
        where: {
            OR: [
                { MeetingDescription: { contains: query } },
                { CancellationReason: { contains: query } },
            ],
        },
        orderBy: { MeetingDate: 'desc' },
        include: { meetingtype: true }
    })

    return (
        <div className="p-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Meeting Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage all scheduled meetings and their documentation.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchBar placeholder="Search meetings..." />
                    <Link
                        href="/dashboard/meeting_convener/meetings/add"
                        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm shrink-0 uppercase tracking-widest text-[10px]"
                    >
                        <Plus size={12} /> Plan Meeting
                    </Link>
                </div>
            </div>

            {/* Meeting Registry Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session Context</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Documentation</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {data.map((m) => (
                                <tr key={m.MeetingID} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">#M-{m.MeetingID}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Calendar size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{m.MeetingDescription || "General Strategic Session"}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(m.MeetingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                                            {m.meetingtype?.MeetingTypeName || "General"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {m.DocumentPath ? (
                                            <a
                                                href={m.DocumentPath}
                                                download={m.DocumentPath.split('/').pop()}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold"
                                            >
                                                <FileDown size={12} />
                                                Download
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No artifacts</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/dashboard/meeting_convener/meetings/${m.MeetingID}`} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition">View</Link>
                                            <Link href={`/dashboard/meeting_convener/meetings/edit/${m.MeetingID}`} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-100 dark:border-indigo-900 transition hover:bg-indigo-50 dark:hover:bg-indigo-900/20">Edit</Link>
                                            <DeleteMeeting id={m.MeetingID} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {data.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700 ring-1 ring-slate-100 dark:ring-slate-800">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-lg font-black text-slate-300 dark:text-slate-700 italic uppercase">No Meetings Scheduled</h3>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Registry is currently empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
