import React from 'react'
import { prisma } from '@/lib/prisma'

import Link from 'next/link'
import DeleteMeetingType from '@/app/ui/DeleteMeetingType'
import { FaPlus, FaLayerGroup } from 'react-icons/fa'
import { meetingtype } from '@prisma/client'
import SearchBar from '@/app/ui/SearchBar'

async function MeetingTypeList({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>
}) {
    const query = (await searchParams).query || "";

    const data = await prisma.meetingtype.findMany({
        where: {
            OR: [
                { MeetingTypeName: { contains: query } },
                { Remarks: { contains: query } },
            ],
        },
    })

    return (
        <div className="p-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meeting Classifications</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage meeting categories and their procedural standards.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchBar placeholder="Search classifications..." />
                    <Link
                        href="/meeting-type/add"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-all shadow-sm shrink-0"
                    >
                        <FaPlus size={12} /> Add Category
                    </Link>
                </div>
            </div>

            {/* Classification Registry Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Classification</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Procedural Context</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((m: meetingtype) => (
                                <tr key={m.MeetingTypeID} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#T-{m.MeetingTypeID}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FaLayerGroup size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{m.MeetingTypeName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-slate-500 font-medium italic">
                                            {m.Remarks || 'Standard organizational procedural structure.'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/meeting-type/${m.MeetingTypeID}`} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition">View</Link>
                                            <Link href={`/meeting-type/edit/${m.MeetingTypeID}`} className="px-3 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-50 transition">Edit</Link>
                                            <DeleteMeetingType id={m.MeetingTypeID} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300 ring-1 ring-slate-100">
                            <FaLayerGroup size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-300 italic">No Classifications Found</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize system registry to begin</p>
                    </div>
                )}
            </div>
        </div>
    )
}


export default MeetingTypeList
