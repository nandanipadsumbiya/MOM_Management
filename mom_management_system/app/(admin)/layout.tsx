'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users, Settings2, CalendarDays, LogOut, LayoutDashboard, ClipboardCheck, Calendar as CalendarIcon, UserCheck
} from 'lucide-react';
import { getSettings } from '../actions/SettingsActions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [systemName, setSystemName] = useState('MoM.AI');

  useEffect(() => {
    async function load() {
      const dbSettings = await getSettings();
      if (dbSettings.systemName) {
        setSystemName(dbSettings.systemName);
      }
      // Always force light mode — dark mode removed
      document.documentElement.classList.remove('dark');
    }
    load();
  }, []);

  const handleLogout = () => {
    // A direct GET via window.location is the most reliable way to clear 
    // cross-origin cookies on localhost.
    const logoutUrl = `http://localhost:3000/auth/logout?redirect=${encodeURIComponent(window.location.origin + '/login')}`;
    window.location.href = logoutUrl;
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900 font-sans p-4 lg:p-6 gap-6 overflow-hidden">
      {/* Sidebar - Simple Modern Design */}
      <aside className="w-72 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md rounded-3xl flex flex-col overflow-hidden hidden md:flex shrink-0 border border-slate-200/60 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-slate-800" />
          <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">{systemName}</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4">Navigation</p>
          <SidebarLink href="/dashboard/admindashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === '/dashboard/admindashboard'} />
          <SidebarLink href="/staff" icon={<Users size={18} />} label="Staff" active={pathname === '/staff' || pathname.startsWith('/staff/')} />
          <SidebarLink href="/staff-attendance" icon={<ClipboardCheck size={18} />} label="Attendance" active={pathname.startsWith('/staff-attendance')} />
          <SidebarLink href="/meeting-type" icon={<Settings2 size={18} />} label="Meeting-Type" active={pathname.startsWith('/meeting-type')} />
          <SidebarLink href="/meetings" icon={<CalendarDays size={18} />} label="Meeting" active={pathname.startsWith('/meetings')} />
          <SidebarLink href="/calendar" icon={<CalendarIcon size={18} />} label="Calendar" active={pathname === '/calendar'} />
          <SidebarLink href="/meeting-member" icon={<UserCheck size={18} />} label="Meeting member" active={pathname === '/meeting-member' || pathname.startsWith('/meeting-member/')} />
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        {children}
      </main>
    </div>
  );
}

// SidebarLink Helper using Next.js Link
function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
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
    </Link>
  );
}