'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LogOut, LayoutDashboard, CalendarDays, 
  Settings2
} from "lucide-react";

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 rounded-3xl flex flex-col overflow-hidden hidden md:flex shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 mb-4">
        <div className="w-10 h-10 bg-black dark:bg-slate-800 rounded-2xl flex items-center justify-center">
          <CalendarDays size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white uppercase">MoM.AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 mt-4">Personnel Portal</p>
        <SidebarLink href="/personnel/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === '/personnel/dashboard'} />
        <SidebarLink href="/personnel/meetings" icon={<CalendarDays size={18} />} label="Meetings" active={pathname.startsWith('/personnel/meetings')} />
        <SidebarLink href="/personnel/settings" icon={<Settings2 size={18} />} label="Settings" active={pathname.startsWith('/personnel/settings')} />
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <form action={`http://localhost:3000/auth/logout?redirect=${encodeURIComponent('http://localhost:3000/login')}`} method="GET">
          <button 
            type="submit"
            className="flex items-center gap-3 text-slate-500 hover:text-rose-600 px-5 py-3 w-full rounded-xl transition-all text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 group"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all group ${
        active 
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
