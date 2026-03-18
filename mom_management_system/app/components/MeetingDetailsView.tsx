import React from 'react';
import Link from 'next/link';
import { Clock, FileText, ArrowLeft, Edit, Download, Calendar } from 'lucide-react';

interface Meeting {
    MeetingID: number;
    MeetingDate: Date;
    MeetingDescription: string | null;
    DocumentPath: string | null;
    meetingtype?: {
        MeetingTypeName: string;
    } | null;
}

interface MeetingDetailsViewProps {
    meeting: Meeting;
    backLink: string;
    editLink?: string;
    reportLink?: string;
}

export default function MeetingDetailsView({ meeting, backLink, editLink, reportLink }: MeetingDetailsViewProps) {
    return (
        <div className="flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm w-full max-w-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <Calendar size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Meeting Details</h1>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Registry #M-{meeting.MeetingID}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5">Meeting Date</label>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">
                                        {new Date(meeting.MeetingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                                        <Clock size={10} /> {new Date(meeting.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Meeting Type</label>
                            <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">{meeting.meetingtype?.MeetingTypeName || "General Strategic Session"}</p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Description</label>
                            <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">{meeting.MeetingDescription || 'No description provided for this session.'}</p>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Attached Document</label>
                            {meeting.DocumentPath ? (
                                <a
                                    href={meeting.DocumentPath}
                                    download={meeting.DocumentPath.split('/').pop()}
                                    className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/5"
                                >
                                    <Download size={14} />
                                    Download Document
                                </a>
                            ) : (
                                <p className="text-slate-400 italic text-xs font-medium bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No session artifacts attached to this record.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                        {editLink && (
                            <Link href={editLink} className="flex-1 bg-black text-white py-3 rounded-xl hover:bg-slate-900 transition-all font-bold uppercase tracking-widest text-[9px] text-center shadow-lg shadow-black/5">
                                Edit Meeting Info
                            </Link>
                        )}
                        <Link href={backLink} className="flex-1 bg-white text-slate-400 hover:text-slate-900 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-all font-bold uppercase tracking-widest text-[9px] text-center">
                            Back to List
                        </Link>
                        {reportLink && (
                            <Link href={reportLink} className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-emerald-500/10">
                                <FileText size={14} />
                                Generate Report
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetadataTag({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
            <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-widest uppercase">{value}</span>
        </div>
    );
}
