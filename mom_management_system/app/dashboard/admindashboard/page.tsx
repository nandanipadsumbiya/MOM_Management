'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users, Settings2, CalendarDays,
  LogOut, Plus, Search, CheckCircle2, Clock, FileText,
  ClipboardCheck, LayoutDashboard,
  CalendarIcon, UserCheck
} from 'lucide-react';

import AdminCalendar from '@/app/ui/AdminCalendar';

interface StatItem {
  label: string;
  value: string;
  color: string;
}

interface DashboardUIProps {
  stats?: StatItem[];
}

export default function DashboardUI({ stats: initialStats }: DashboardUIProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<StatItem[]>(initialStats || []);
  const [pendingMeetings, setPendingMeetings] = useState<any[]>([]);
  const [allMeetings, setAllMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(!initialStats);

  const iconMap: Record<string, any> = {
    'Total Meetings': FileText,
    'Pending Approval': Clock,
    'Actions Closed': CheckCircle2,
    'Staff Members': Users,
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch("http://localhost:3000/dashboard/stats");
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats([
            {
              label: "Total Meetings", value: data.totalMeetings.toString(), color: "text-blue-600",
            },
            {
              label: "Pending Approval", value: data.pendingMeetings.toString(), color: "text-yellow-600",
            },
            {
              label: "Actions Closed", value: data.completedMeetings.toString(), color: "text-green-600",
            },
            {
              label: "Staff Members", value: data.totalStaff.toString(), color: "text-indigo-600",
            },
          ]);
        }

        const meetingsRes = await fetch("http://localhost:3000/dashboard/pending-meetings");
        if (meetingsRes.ok) {
          const meetingsData = await meetingsRes.json();
          setPendingMeetings(meetingsData);
        }

        const allMeetingsRes = await fetch("http://localhost:3000/dashboard/all-meetings");
        if (allMeetingsRes.ok) {
          const allMeetingsData = await allMeetingsRes.json();
          setAllMeetings(allMeetingsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialStats || initialStats.length === 0) {
      fetchDashboardData();
    }
  }, [initialStats]);

  const handleMarkComplete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/dashboard/mark-complete/${id}`, {
        method: 'POST',
      });
      if (res.ok) {
        // Refresh data
        const statsRes = await fetch("http://localhost:3000/dashboard/stats");
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats([
            { label: "Total Meetings", value: data.totalMeetings.toString(), color: "text-blue-600" },
            { label: "Pending Approval", value: data.pendingMeetings.toString(), color: "text-yellow-600" },
            { label: "Actions Closed", value: data.completedMeetings.toString(), color: "text-green-600" },
            { label: "Staff Members", value: data.totalStaff.toString(), color: "text-indigo-600" },
          ]);
        }
        const meetingsRes = await fetch("http://localhost:3000/dashboard/pending-meetings");
        if (meetingsRes.ok) {
          const meetingsData = await meetingsRes.json();
          setPendingMeetings(meetingsData);
        }
        const allMeetingsRes = await fetch("http://localhost:3000/dashboard/all-meetings");
        if (allMeetingsRes.ok) {
          const allMeetingsData = await allMeetingsRes.json();
          setAllMeetings(allMeetingsData);
        }
      }
    } catch (error) {
      console.error("Failed to mark meeting as complete:", error);
    }
  };

  const handleLogout = () => {
    const logoutUrl = `http://localhost:3000/auth/logout?redirect=${encodeURIComponent(window.location.origin + '/login')}`;
    window.location.href = logoutUrl;
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans p-4 lg:p-6 gap-6 overflow-hidden">
      {/* Sidebar - Simple Modern Design */}
      <aside className="w-72 bg-white dark:bg-[#0f172a] rounded-3xl flex flex-col overflow-hidden hidden md:flex shrink-0 border border-slate-200/60 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-slate-900" />
          <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">MoM.AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4">Intelligence Center</p>
          <SidebarLink href="/dashboard/admindashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={true} />
          <SidebarLink href="/staff" icon={<Users size={18} />} label="Staff" active={pathname === '/staff'} />
          <SidebarLink href="/meeting-type" icon={<Settings2 size={18} />} label="Meeting-type" active={pathname === '/meeting-type'} />
          <SidebarLink href="/meetings" icon={<CalendarDays size={18} />} label="Meetings" active={pathname === '/meetings'} />
          <SidebarLink href="/staff-attendance" icon={<ClipboardCheck size={18} />} label="Attendance" active={pathname.startsWith('/staff-attendance')} />
          <SidebarLink href="/calendar" icon={<CalendarIcon size={18} />} label="Calendar" active={pathname === '/calendar'} />
          <SidebarLink href="/meeting-member" icon={<UserCheck size={18} />} label="Meeting Member" active={pathname === '/meeting-member' || pathname.startsWith('/meeting-member/')} />
          <SidebarLink href="/settings" icon={<Settings2 size={18} />} label="Settings" active={pathname.startsWith('/settings')} />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-rose-600 px-5 py-3 w-full rounded-xl transition-all text-sm font-medium hover:bg-rose-50 group"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <header className="bg-white border border-slate-200/60 rounded-[2rem] px-8 py-6 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-xs font-bold text-slate-400 mt-1 tracking-widest uppercase">Operational Overview</p>
          </div>
          <button onClick={() => router.push("/meetings/add")} className="bg-black text-white px-8 py-3 rounded-2xl shadow-sm hover:bg-slate-900 transition-all flex items-center gap-2 text-sm font-bold tracking-wide">
            <Plus size={18} />
            DISPATCH MEETING
          </button>
        </header>

        <div className="flex flex-col gap-8 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = iconMap[stat.label] || FileText;
              return (
                <div key={i} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                    {loading ? <span className="animate-pulse">---</span> : stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-2 shadow-sm">
            <AdminCalendar meetings={allMeetings} />
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg tracking-tight">Active Operations</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Session Registry</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  className="pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-60"
                />
              </div>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="px-6 py-3 text-left font-bold uppercase tracking-widest text-[10px]">Session Title</th>
                    <th className="px-6 py-3 text-left font-bold uppercase tracking-widest text-[10px]">Scheduled</th>
                    <th className="px-6 py-3 text-left font-bold uppercase tracking-widest text-[10px]">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingMeetings.length > 0 ? (
                    pendingMeetings.map((meeting: any) => (
                      <tr key={meeting.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 font-semibold text-slate-700">{meeting.title}</td>
                        <td className="px-6 py-5 text-slate-500 font-medium">{new Date(meeting.date).toLocaleDateString()}</td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => handleMarkComplete(meeting.id)}
                            className="px-4 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-all border border-orange-100"
                          >
                            Pending Review
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <p className="text-slate-400 font-medium italic">No session backlog detected</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all group ${active
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
      <span className={`${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} transition-all`}>
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
    </a>
  );
}