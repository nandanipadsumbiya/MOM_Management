'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut, LayoutDashboard, CalendarDays,
  Settings2, Users, UserCheck, Shield
} from "lucide-react";

export default function ConvenerSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    const logoutUrl = `http://localhost:3000/auth/logout?redirect=${encodeURIComponent(window.location.origin + '/login')}`;
    window.location.href = logoutUrl;
  };

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 rounded-3xl flex flex-col overflow-hidden hidden md:flex shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 mb-4">
        <div className="w-10 h-10 bg-black dark:bg-slate-800 rounded-2xl flex items-center justify-center">
          <CalendarDays size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white uppercase tracking-tight">MoM.AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 mt-4">Management Portal</p>
        <SidebarLink href="/dashboard/meeting_convener" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === '/dashboard/meeting_convener'} />
        <SidebarLink href="/dashboard/meeting_convener/meetings" icon={<CalendarDays size={18} />} label="Meetings" active={pathname.startsWith('/dashboard/meeting_convener/meetings')} />
        <SidebarLink href="/dashboard/meeting_convener/staff" icon={<Users size={18} />} label="Staff Registry" active={pathname.startsWith('/dashboard/meeting_convener/staff')} />
        <SidebarLink href="/dashboard/meeting_convener/settings" icon={<Settings2 size={18} />} label="Settings" active={pathname.startsWith('/dashboard/meeting_convener/settings')} />
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-500 hover:text-rose-600 px-5 py-3 w-full rounded-xl transition-all text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 group"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all group ${active
        ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
      <span className={`${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 scale-110'} transition-all`}>
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900"></span>}
    </Link>
  );
}
