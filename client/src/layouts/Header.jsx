import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Dynamic Title Logic
  const getTitle = (path) => {
    const routeMap = {
      '/': 'Command Center',
      '/dashboard': 'Command Center',
      '/challenges': 'Mission Intel',
      '/leaderboard': 'Global Rankings',
      '/achievements': 'Trophies & Badges',
      '/streaks': 'Consistency Pulse',
      '/rewards': 'Marketplace',
      '/wallet': 'Internal Assets',
      '/community': 'Squad Hub',
      '/mentorship': 'Mentorship Nodes',
      '/analytics': 'Predictive Analytics',
      '/admin/jira': 'System Integration',
      '/mystery': 'The Void / Mystery',
      '/story': 'Campaign Chapters',
      '/goals': 'Behavior Tracking',
      '/wellness': 'SPINE Wellbeing',
      '/accountability': 'Trust Network',
      '/sergeants': "Sergeant's Corner"
    };
    return routeMap[path] || 'Intelligence Node';
  };

  return (
    <header className="h-20 bg-[#030303] border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-10 shadow-2xl">
      <div className="flex flex-col">
        <h1 className="text-xl font-black text-white tracking-tight uppercase italic">{getTitle(location.pathname)}</h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Secure Session Active</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
          <input
            type="text"
            className="bg-[#0a0a0a] border border-white/5 text-zinc-200 text-xs rounded-2xl pl-11 pr-4 py-2.5 w-64 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all placeholder:text-zinc-700 font-medium"
            placeholder="Search Intelligence..."
          />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white leading-none">{user?.name}</p>
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-tighter mt-1">{user?.role}</p>
           </div>
           
           <div className="relative group">
              <div className="w-10 h-10 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all cursor-pointer">
                 <UserIcon className="w-5 h-5" />
              </div>
           </div>

           <button 
             onClick={logout}
             className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
             title="Logout"
           >
             <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>
    </header>
  );
}
