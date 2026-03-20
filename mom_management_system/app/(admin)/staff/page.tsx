import React from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteStaff from '@/app/ui/DeleteStaff'

import { FaPlus, FaUser } from 'react-icons/fa'

import SearchBar from '@/app/ui/SearchBar'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const staffList = await prisma.staff.findMany()

export default async function StaffList({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>
}) {
    const query = (await searchParams).query || "";

    const data = await prisma.staff.findMany({
        where: {
            OR: [
                { StaffName: { contains: query } },
                { EmailAddress: { contains: query } },
                { Remarks: { contains: query } },
            ],
        },
    })

    return (
        <div className="p-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage all authorized staff members and their system access.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <SearchBar placeholder="Search staff by name or email..." />
                    <Link
                        href="/staff/add"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-all shadow-sm shrink-0"
                    >
                        <FaPlus size={12} /> Add Personnel
                    </Link>
                </div>
            </div>

            {/* Directory Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Identity</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((s: staff) => (
                                <tr key={s.StaffID} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">#{s.StaffID}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FaUser size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{s.StaffName}</div>
                                                <div className="text-xs text-slate-500">{s.Remarks || 'No designated role'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 font-medium">{s.EmailAddress || '-'}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{s.MobileNo || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/staff/${s.StaffID}`} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition">View</Link>
                                            <Link href={`/staff/edit/${s.StaffID}`} className="px-3 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100 hover:bg-indigo-50 transition">Edit</Link>
                                            <DeleteStaff id={s.StaffID} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
