import React from 'react'
import { AddMeetingTypeAction } from '@/app/actions/AddMeetingTypeAction'

export default function AddMeetingType() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Meeting Type</h2>
                <form action={AddMeetingTypeAction} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Type Name</label>
                        <input name="MeetingTypeName" type="text" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Remarks</label>
                        <textarea name="Remarks" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-slate-900 transition font-medium">
                            Save Meeting Type
                        </button>
                        <a href="/meeting-type" className="w-full text-center py-2 text-slate-500 hover:text-slate-700 text-sm transition">
                            Back to List
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
