import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    CalendarDays, CheckCircle2, Clock, ArrowRight,
    User, Mail, Shield, AlertCircle, Plus, Users, FileText
} from 'lucide-react';

export default async function MeetingConvenerDashboard() {
    const user = await getServerSession();
    if (!user || user.role !== 'meeting_convener') {
        redirect('/login');
    }

    // Fetch stats for all meetings since convener oversees them
    const totalMeetings = await prisma.meetings.count();
    const completedMeetings = await prisma.meetings.count({ where: { IsCancelled: true } });
    const pendingMeetings = totalMeetings - completedMeetings;

    // Fetch upcoming meetings
    const upcomingMeetings = await prisma.meetings.findMany({
        where: { MeetingDate: { gte: new Date() } },
        orderBy: { MeetingDate: 'asc' },
        take: 5,
        include: { meetingtype: true }
    });

    // Greeting Logic
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    if (hour >= 17) greeting = "Good Evening";

    return (
        <div className="space-y-10 pb-10">
            {/* Modern Header - Matching Staff Dashboard style */}
            <header className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] px-8 py-6 flex items-center justify-between sticky top-0 z-20">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Convener Hub</h1>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 tracking-widest uppercase">
                        {greeting}, {user.name.split(' ')[0]} — Oversight Dashboard
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/meeting_convener/meetings/add"
                        className="h-11 px-6 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={14} />
                        <span>Plan Meeting</span>
                    </Link>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 pl-4 pr-2 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none">{user.name}</p>
                            <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-0.5">Management Registry</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardMetric
                    title="Total Registry"
                    value={totalMeetings}
                    icon={<FileText size={20} />}
                    detail="All Scheduled Sessions"
                    color="text-indigo-600 dark:text-indigo-400"
                />
                <DashboardMetric
                    title="Active Pipeline"
                    value={pendingMeetings}
                    icon={<Clock size={20} />}
                    detail="Upcoming Engagements"
                    color="text-amber-600 dark:text-amber-400"
                />
                <DashboardMetric
                    title="Finalized"
                    value={completedMeetings}
                    icon={<CheckCircle2 size={20} />}
                    detail="Verified Records"
                    color="text-emerald-600 dark:text-emerald-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* Main Content: Upcoming Meetings */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Upcoming Sessions</h2>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Priority Pipeline</p>
                            </div>
                            <Link href="/dashboard/meeting_convener/meetings" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                                View Repository →
                            </Link>
                        </div>

                        {upcomingMeetings.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingMeetings.map((m: any) => (
                                    <div
                                        key={m.MeetingID}
                                        className="group flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-3xl transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-black dark:bg-slate-700 flex flex-col items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                                                <span className="text-[9px] font-black uppercase tracking-widest leading-none opacity-60">
                                                    {new Date(m.MeetingDate).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-xl font-black leading-none mt-1">
                                                    {new Date(m.MeetingDate).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{m.MeetingDescription}</h3>
                                                <div className="flex items-center gap-4 mt-1.5">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                                                        <Clock size={12} /> {new Date(m.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                                                        {m.meetingtype?.MeetingTypeName || 'General Session'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/dashboard/meeting_convener/meetings/${m.MeetingID}`}
                                            className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black group-hover:border-transparent transition-all"
                                        >
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-slate-50/20 dark:bg-slate-800/10">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <CalendarDays size={32} className="text-slate-300 dark:text-slate-600" />
                                </div>
                                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No Scheduled Engagements</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar: Convener Tools */}
                <div className="space-y-6">
                    <div className="bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 dark:shadow-none">
                        <div className="w-12 h-12 bg-white/10 dark:bg-black/5 rounded-2xl flex items-center justify-center mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">Oversight Access</h3>
                        <p className="text-white/60 dark:text-black/60 text-xs font-medium leading-relaxed mb-8">
                            As a Meeting Convener, you have authority to organize sessions, manage participants, and verify minutes.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            <SidebarActionLink label="Staff Registry" icon={<Users size={16} />} href="/dashboard/meeting_convener/staff" />
                            <SidebarActionLink label="Session Types" icon={<Shield size={16} />} href="/meeting-type" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">System Registry</h4>
                        <div className="space-y-8">
                            <MetadataItem icon={<User size={18} />} label="Registry ID" value={`CONV-${user.user_id}`} />
                            <MetadataItem icon={<Mail size={18} />} label="Channel" value={user.email} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardMetric({ title, value, icon, detail, color = "text-slate-900" }: { title: string, value: string | number, icon: React.ReactNode, detail: string, color?: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-slate-900/10 dark:hover:border-white/10 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center ${color} group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-all`}>
                    {icon}
                </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</h3>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{detail}</p>
        </div>
    );
}

function SidebarActionLink({ label, icon, href }: { label: string, icon: React.ReactNode, href: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-2xl transition-all group">
            <div className="flex items-center gap-3">
                <span className="opacity-60">{icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
    );
}

function MetadataItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 border border-slate-100 dark:border-slate-800">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 shadow-sm leading-none">{label}</p>
                <p className="text-sm font-bold break-all">{value}</p>
            </div>
        </div>
    );
}