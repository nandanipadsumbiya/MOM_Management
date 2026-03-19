import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteMeeting from '@/app/ui/DeleteMeeting'

import { FaPlus, FaCalendarAlt, FaFileDownload, FaClock } from 'react-icons/fa'

import SearchBar from '@/app/ui/SearchBar'
import { meetings } from '@prisma/client'

async function MeetingList({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const query = (await searchParams).query || "";

  const data = await prisma.meetings.findMany({
    where: {
      OR: [
        { MeetingDescription: { contains: query } },
        { CancellationReason: { contains: query } },
      ],
    },
    orderBy: { MeetingDate: 'desc' }
  })

    return (
        <div className="p-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meeting Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage all scheduled meetings and their documentation.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchBar placeholder="Search meetings..." />
                    <Link
                        href="/meetings/add"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-all shadow-sm shrink-0"
                    >
                        <FaPlus size={12} /> Add Meeting
                    </Link>
                </div>
            </div>

            {/* Meeting Registry Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session Context</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Documentation</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((m: meetings) => (
                                <tr key={m.MeetingID} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#M-{m.MeetingID}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FaCalendarAlt size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{m.MeetingDescription || "General Strategic Session"}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <FaClock size={10} />
                                                    {new Date(m.MeetingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {m.DocumentPath ? (
                                            <a
                                                href={m.DocumentPath}
                                                download
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold"
                                            >
                                                <FaFileDownload size={12} />
                                                Download
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No artifacts</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/meetings/${m.MeetingID}`} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition">View</Link>
                                            <Link href={`/meetings/edit/${m.MeetingID}`} className="px-3 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-50 transition">Edit</Link>
                                            <DeleteMeeting id={m.MeetingID} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {data.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300 ring-1 ring-slate-100">
                                <FaCalendarAlt size={24} />
                            </div>
                            <h3 className="text-lg font-black text-slate-300 italic">No Meetings Scheduled</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize scheduler to begin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default MeetingList
