import React from 'react'
import { AddStaffAction } from '@/app/actions/AddStaffAction'

export default function AddStaff() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Staff Member</h2>
                <form action={AddStaffAction} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Staff Name</label>
                        <input name="StaffName" type="text" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Mobile No</label>
                            <input name="MobileNo" type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                            <input name="EmailAddress" type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Remarks</label>
                        <textarea name="Remarks" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                    </div>


                    <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold mt-4">
                        Save Staff Member
                    </button>
                </form>
            </div>
        </div>
    )
}