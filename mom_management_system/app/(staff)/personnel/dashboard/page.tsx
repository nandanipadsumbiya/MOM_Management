import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays, CheckCircle2, Clock, ArrowRight,
  MapPin, User, Mail, Shield, AlertCircle
} from 'lucide-react';

export default async function StaffDashboard() {
  const user = await getServerSession();
  if (!user) {
    redirect('/login');
  }

  const staff = await prisma.staff.findFirst({
    where: { EmailAddress: user.email }
  });

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md shadow-sm">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personnel Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your account ({user.email}) is not linked to any profile in our registry.</p>
        </div>
      </div>
    );
  }

  // Fetch Attendance Records
  const rawMembers = await prisma.meetingmember.findMany({
    where: { StaffID: staff.StaffID }
  });

  const meetingIds = rawMembers.map(m => m.MeetingID);

  const meetings = await prisma.meetings.findMany({
    where: { MeetingID: { in: meetingIds } },
    orderBy: { MeetingDate: 'desc' }
  });

  const meetingTypes = await prisma.meetingtype.findMany();

  const meetingMembers = rawMembers.map(m => {
    const meeting = meetings.find(mtg => mtg.MeetingID === m.MeetingID);
    const meetingType = meeting ? meetingTypes.find(t => t.MeetingTypeID === meeting.MeetingTypeID) : null;
    return {
      ...m,
      meetings: meeting ? { ...meeting, meetingtype: meetingType } : null
    };
  }).filter(m => m.meetings !== null);

  // Stats Logic
  const totalMeetings = meetingMembers.length;
  const attendedCount = meetingMembers.filter(m => m.IsPresent).length;
  const attendanceRate = totalMeetings > 0 ? Math.round((attendedCount / totalMeetings) * 100) : 0;

  // Greeting Logic
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  if (hour >= 17) greeting = "Good Evening";

  // Split Meetings
  const now = new Date();
  const upcomingMeetings = meetingMembers.filter(m => {
    if (!m.meetings) return false;
    return new Date(m.meetings.MeetingDate) >= now;
  });
  const pastMeetings = meetingMembers.filter(m => {
    if (!m.meetings) return false;
    return new Date(m.meetings.MeetingDate) < now;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header - Matching Admin style */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] px-8 py-6 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Personnel Dashboard</h1>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 tracking-widest uppercase">
            {greeting}, {staff.StaffName.split(' ')[0]} — Assigned Portfolio
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 pl-4 pr-2 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-none">{staff.StaffName}</p>
            <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight mt-0.5">Personnel Registry</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="space-y-8 pb-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DashboardMetric title="Assignments" value={totalMeetings} icon={<CalendarDays size={18} />} detail="Total Registry" color="text-blue-600 dark:text-blue-400" />
          <DashboardMetric title="Attendance" value={attendedCount} icon={<CheckCircle2 size={18} />} detail="Verified Presence" color="text-green-600 dark:text-green-400" />
          <DashboardMetric title="Compliance" value={`${attendanceRate}%`} icon={<Shield size={18} />} detail="Performance Index" color="text-indigo-600 dark:text-indigo-400" />
          <DashboardMetric title="Clearance" value={attendanceRate >= 75 ? "Active" : "Standard"} icon={<Clock size={18} />} detail="System Status" color="text-orange-600 dark:text-orange-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Meetings */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Scheduled Sessions</h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Upcoming Engagements</p>
                </div>
              </div>

              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map(m => (
                    <Link
                      key={m.MeetingMemberID}
                      href={`/personnel/meetings/${m.MeetingID}`}
                      className="group flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl transition-all block"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 flex flex-col items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                          <span className="text-[8px] font-black uppercase tracking-widest leading-none opacity-60">
                            {new Date(m.meetings!.MeetingDate).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-lg font-black leading-none mt-0.5">
                            {new Date(m.meetings!.MeetingDate).getDate()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{m.meetings?.MeetingDescription}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                              <Clock size={10} /> {new Date(m.meetings!.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                              {m.meetings?.meetingtype?.MeetingTypeName || 'General Session'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/30 dark:bg-slate-800/30">
                  <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">No upcoming sessions detected</p>
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Activity History</h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Verified Records</p>
                </div>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 dark:text-slate-600 border-b border-slate-50 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Target Session</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Timestamp</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {pastMeetings.map((m) => (
                      <tr key={m.MeetingMemberID} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-5">
                          <Link href={`/personnel/meetings/${m.MeetingID}`} className="block group">
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{m.meetings?.MeetingDescription}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight mt-0.5">REF: #{m.MeetingID}</p>
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                            {new Date(m.meetings!.MeetingDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight ${m.IsPresent
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10'
                            : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/10'
                            }`}>
                            {m.IsPresent ? 'Verified Presence' : 'Marked Absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Info Cards */}
          <div className="space-y-6">
            <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 dark:shadow-none">
              <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Compliance Status</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 opacity-80">
                Maintain your presence index above 75% for quarterly clearance procedures.
              </p>
              <div className="space-y-4">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Current Level</span>
                  <span>{attendanceRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">Personnel Metadata</h4>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 border border-slate-100 dark:border-slate-800">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 leading-none">Primary Registry</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white break-all">{staff.EmailAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 border border-slate-100 dark:border-slate-800">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 leading-none">Sector Alignment</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{staff.Remarks || 'Operational Standard'}</p>
                  </div>
                </div>
              </div>
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