import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Swords, Trophy, Shield, Flame, Gift, Wallet,
  Users, Users2, Lightbulb, BookOpen, Gamepad2, Activity,
  Triangle, AlertCircle, Star, Heart, BarChart3, Bot, Settings,
  LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mainMenu = [
  { name: 'Dashboard',       path: '/',               icon: LayoutDashboard },
  { name: 'Challenges',      path: '/challenges',     icon: Swords },
  { name: 'Leaderboard',     path: '/leaderboard',    icon: Trophy },
  { name: 'Badges & Bosses', path: '/achievements',   icon: Shield },
  { name: 'Streaks',         path: '/streaks',        icon: Flame },
  { name: 'Rewards',         path: '/rewards',        icon: Gift },
  { name: 'Wallet',          path: '/wallet',         icon: Wallet },
  { name: 'Community',       path: '/community',      icon: Users },
  { name: 'Mentorship',      path: '/mentorship',     icon: Users2 },
];

const explore = [
  { name: 'Mystery & Loot',   path: '/mystery',  icon: Lightbulb },
  { name: 'Story / Chapters', path: '/story',    icon: BookOpen },
];

const culture = [
  { name: 'Gamer Types',       path: '/gamer-types',    icon: Gamepad2 },
  { name: 'My Activities',     path: '/goals',          icon: Activity },
  { name: '3P Culture',        path: '/wellness',       icon: Triangle },
  { name: 'Accountability',    path: '/accountability', icon: AlertCircle },
  { name: "Sergeant's Corner", path: '/sergeants',      icon: Star },
  { name: 'SPINE Wellbeing',   path: '/spine',          icon: Heart },
];

const intelligence = [
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'AI Coach',  path: '/ai-coach',  icon: Bot },
];

const admin = [
  { name: 'System Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Jira Admin', path: '/admin/jira', icon: Settings },
];

const sections = [
  { label: 'Main Menu',    items: mainMenu },
  { label: 'Explore',      items: explore },
  { label: 'Culture',      items: culture },
  { label: 'Intelligence', items: intelligence },
  { label: 'Admin',        items: admin },
];

const textCls = `inline-block max-w-0 opacity-0 pointer-events-none overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/sidebar:max-w-[200px] group-hover/sidebar:opacity-100 group-hover/sidebar:pointer-events-auto`;

function NavItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 transition-colors duration-100 group/item relative rounded-xl
         ${isActive
           ? 'text-white bg-[#1a1a1a] shadow-inner font-medium'
           : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-violet-500' : 'text-gray-500 group-hover/item:text-gray-400'}`} />
          <div className={`overflow-hidden transition-all duration-300 flex-1 ml-0 group-hover/sidebar:ml-4 ${isActive ? '' : 'group-hover/item:text-gray-300'}`}>
             <span className={`text-sm ${textCls}`}>{item.name}</span>
          </div>
          {isActive && <ChevronRight className={`w-4 h-4 text-violet-500 flex-shrink-0 ${textCls}`} />}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { logout, hasCapability } = useAuth();

  const filteredSections = sections.filter(section => {
    if (section.label === 'Admin') return hasCapability('view_admin_dashboard');
    if (section.label === 'Intelligence') return hasCapability('view_analytics');
    return true;
  });

  return (
    <nav className="
      group/sidebar fixed top-0 left-0 h-screen
      bg-[#0a0a0a] z-50 flex flex-col overflow-hidden
      w-[76px] hover:w-[260px] border-r border-white/5
      transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
    ">
      {/* Brand */}
      <div className="h-24 flex items-center px-[22px] flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-lg shadow-violet-600/20">
          S
        </div>
        <span className={`ml-0 group-hover/sidebar:ml-4 font-black text-[18px] text-white tracking-widest uppercase italic ${textCls}`}>
          Symbiote
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-2 pb-4 scrollbar-hide space-y-6">
        {filteredSections.map((section) => (
          <div key={section.label} className="mb-2">
            <div className="px-0 group-hover/sidebar:px-6 overflow-hidden max-h-0 group-hover/sidebar:max-h-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] mb-2 flex items-center">
              <span className={`text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase italic ${textCls}`}>
                {section.label}
              </span>
            </div>
            <div className="space-y-1">
              {section.items.map(item => <NavItem key={item.name} item={item} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="px-4 py-6 flex-shrink-0 border-t border-white/5">
        <div className="px-2 space-y-1">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all group/logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover/logout:scale-110 transition-transform" />
            <div className="overflow-hidden flex-1 ml-4 text-left transition-all duration-300">
              <span className={`text-sm font-black uppercase tracking-widest italic ${textCls}`}>Abort Session</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
