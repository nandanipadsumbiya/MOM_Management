import React from 'react'
import { prisma } from '@/lib/prisma';
import { EditStaffAction } from '@/app/actions/EditStaffAction';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditStaff({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const staffId = parseInt(id);
    const staff = await prisma.staff.findUnique({
        where: { StaffID: staffId },
    });

    if (!staff) {
        notFound();
    }

    const updateStaffWithId = EditStaffAction.bind(null, staffId);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Staff Member</h2>
                <form action={updateStaffWithId} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Staff Name</label>
                        <input name="StaffName" type="text" defaultValue={staff.StaffName} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Mobile No</label>
                            <input name="MobileNo" type="text" defaultValue={staff.MobileNo || ''} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                            <input name="EmailAddress" type="email" defaultValue={staff.EmailAddress || ''} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Remarks</label>
                        <textarea name="Remarks" defaultValue={staff.Remarks || ''} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                    </div>



                    <div className="flex gap-4 items-center">
                        <Link href="/staff" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-center flex-1">
                            Back to List
                        </Link>
                        <button type="submit" className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold">
                            Update Staff Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}