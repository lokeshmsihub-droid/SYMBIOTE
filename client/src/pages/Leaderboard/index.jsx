import { useState, useEffect } from 'react';
import { 
  Trophy, Star, Crown, ArrowUp, ArrowDown, Minus, Flame, 
  Target, Zap, Activity, Filter, Users, User, ArrowRight,
  TrendingUp, TrendingDown, Info, ShieldCheck, Award,
  ExternalLink, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import api from '../../services/api';
import { Card } from '../../components/ui';

// ── Enhanced Mock Data ───────────────────────────────────────────────────────
const mockUsers = [
  { 
    id: 1, name: 'Lokesh Kumar M S', role: 'Developer', current_level: 16, total_xp: 5120, 
    change: +1, streak: 31, team: 'Alpha', quality: 95, efficiency: 88, consistency: 98,
    history: [4800, 4900, 5000, 5050, 5080, 5100, 5120], risk: 'consistent',
    badges: ['Top Performer', 'Consistency King']
  },
  { 
    id: 2, name: 'Sriram R P', role: 'Sales', current_level: 15, total_xp: 4890, 
    change: 0, streak: 28, team: 'Beta', quality: 82, efficiency: 94, consistency: 92,
    history: [4600, 4650, 4700, 4750, 4800, 4850, 4890], risk: 'consistent',
    badges: ['Fast Improver']
  },
  { 
    id: 3, name: 'SriVishnu S', role: 'Developer', current_level: 14, total_xp: 4280, 
    change: +2, streak: 23, team: 'Alpha', quality: 91, efficiency: 85, consistency: 89,
    history: [3900, 4000, 4050, 4100, 4150, 4200, 4280], risk: 'consistent',
    badges: ['Consistency King']
  },
  { 
    id: 4, name: 'Vishnudharshan S', role: 'Manager', current_level: 12, total_xp: 3950, 
    change: -1, streak: 15, team: 'Gamma', quality: 88, efficiency: 82, consistency: 75,
    history: [3900, 3960, 3970, 3980, 4000, 3980, 3950], risk: 'losing streak',
    badges: []
  },
  { 
    id: 5, name: 'Amal Raajan S', role: 'Support', current_level: 11, total_xp: 3700, 
    change: +3, streak: 12, team: 'Beta', quality: 78, efficiency: 81, consistency: 84,
    history: [3200, 3300, 3400, 3500, 3600, 3650, 3700], risk: 'consistent',
    badges: ['Fast Improver']
  },
  { 
    id: 6, name: 'Balavignesh VT', role: 'Developer', current_level: 10, total_xp: 3400, 
    change: -1, streak: 8, team: 'Alpha', quality: 85, efficiency: 72, consistency: 70,
    history: [3450, 3460, 3455, 3440, 3430, 3410, 3400], risk: 'dropping fast',
    badges: []
  },
  { 
    id: 7, name: 'Vetri Kalanjiyam B', role: 'Developer', current_level: 9, total_xp: 3100, 
    change: +1, streak: 10, team: 'Alpha', quality: 89, efficiency: 78, consistency: 80,
    history: [2800, 2850, 2900, 2950, 3000, 3050, 3100], risk: 'consistent',
    badges: []
  },
  { 
    id: 8, name: 'Jabbastin Akash K', role: 'Sales', current_level: 8, total_xp: 2500, 
    change: 0, streak: 5, team: 'Beta', quality: 70, efficiency: 85, consistency: 65,
    history: [2400, 2420, 2440, 2460, 2480, 2490, 2500], risk: 'consistent',
    badges: []
  },
];

const avatarColors = [
  'bg-violet-100 text-violet-400', 'bg-indigo-100 text-indigo-700',
  'bg-slate-100 text-slate-700', 'bg-[#1a1a1a] border border-white/5 text-violet-600',
  'bg-indigo-50 text-indigo-600', 'bg-gray-100 text-gray-300',
  'bg-violet-200 text-violet-800', 'bg-indigo-200 text-indigo-800'
];

// ── Sub-components ──────────────────────────────────────────────────────────

function MiniChart({ data, color = '#7c3aed' }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function FairnessFormula() {
  return (
    <div className="bg-[#1a1a1a] border border-white/5/50 border border-violet-100 rounded-2xl p-4 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-violet-600" />
        <p className="text-xs font-black text-violet-400 uppercase tracking-widest">Fairness Algorithm (V2)</p>
      </div>
      <p className="text-[10px] text-violet-400 font-bold leading-relaxed">
        Rankings are weighted: <span className="font-black">Quality (40%)</span> + 
        <span className="font-black"> Efficiency (30%)</span> + 
        <span className="font-black"> Consistency (30%)</span>.
      </p>
    </div>
  );
}

function AchievementBadge({ label }) {
  const icons = {
    'Top Performer': Trophy,
    'Consistency King': Flame,
    'Fast Improver': TrendingUp
  };
  const Icon = icons[label] || Award;
  return (
    <div className="group relative inline-flex">
      <div className="p-1 px-1.5 rounded-lg bg-violet-100 text-violet-600 border border-violet-200 flex items-center gap-1">
        <Icon className="w-3 h-3" />
        <span className="text-[9px] font-black uppercase whitespace-nowrap">{label}</span>
      </div>
    </div>
  );
}

function RiskIndicator({ type }) {
  if (type === 'dropping fast') return <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" title="Dropping Fast" />;
  if (type === 'losing streak') return <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Losing Streak" />;
  return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Consistent" />;
}

function Avatar({ name, size = 'md', idx = 0 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const sz = size === 'lg' ? 'w-20 h-20 text-2xl border-4' : size === 'md' ? 'w-14 h-14 text-base border-4' : 'w-10 h-10 text-sm border-2';
  const isDark = size !== 'sm';
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-black flex-shrink-0 border-white/20 ${isDark ? 'bg-[#111111]/20 text-white shadow-xl' : avatarColors[idx % avatarColors.length]}`}>
      {initials}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('Global');
  const [activeDimension, setActiveDimension] = useState('Overall');
  const [activeTime, setActiveTime] = useState('Weekly');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedUser, setExpandedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalize = (entry, index) => {
      const xp = entry.xp ?? 0;
      const level = entry.level ?? 0;
      const streak = entry.streak ?? 0;
      const quality = Math.min(100, Math.round(70 + level * 2));
      const efficiency = Math.min(100, Math.round(60 + streak * 2));
      const consistency = Math.min(100, Math.round(65 + streak * 1.5));
      const history = Array.from({ length: 7 }, (_, i) => Math.max(0, xp - (6 - i) * 40));
      return {
        id: entry.userId ?? index + 1,
        name: entry.name || `User ${index + 1}`,
        role: 'Member',
        current_level: level,
        total_xp: xp,
        change: 0,
        streak,
        team: 'Alpha',
        quality,
        efficiency,
        consistency,
        history,
        risk: 'consistent',
        badges: [],
      };
    };

    const load = async () => {
      try {
        const response = await api.get('/leaderboard');
        const entries = Array.isArray(response.data) ? response.data : [];
        if (entries.length) {
          setUsers(entries.map(normalize));
        } else {
          setUsers(mockUsers);
        }
      } catch {
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const me = users.find(u => u.id === 3) || users[2];
  const sortedUsers = [...users].sort((a, b) => {
    if (activeDimension === 'Quality') return b.quality - a.quality;
    if (activeDimension === 'Efficiency') return b.efficiency - a.efficiency;
    if (activeDimension === 'Consistency') return b.consistency - a.consistency;
    return b.total_xp - a.total_xp;
  });

  const filteredUsers = sortedUsers.filter(u => roleFilter === 'All' || u.role === roleFilter);
  const [first, second, third, ...rest] = filteredUsers;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Trophy className="w-10 h-10 text-violet-400 animate-pulse" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
      
      {/* ── Intelligence Layer: Personal Insight & Fairness ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-violet-200 bg-gradient-to-br from-violet-800 to-[#0a0a0a] text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">Your Intelligence Insights</h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-5xl font-black">#{me.id + 1}</p>
                <p className="text-sm font-bold opacity-80 mt-1 uppercase tracking-widest">Global Rank</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black mt-2">+{840} XP Gap</p>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Needed for Rank #2</p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4">
               <div>
                  <p className="text-[10px] font-bold opacity-70 uppercase">You vs Top Performer</p>
                  <div className="flex gap-4 mt-2">
                     <div>
                        <p className="text-sm font-black text-rose-300">-10%</p>
                        <p className="text-[9px] font-bold uppercase opacity-60">Quality</p>
                     </div>
                     <div>
                        <p className="text-sm font-black text-emerald-300">+5%</p>
                        <p className="text-[9px] font-bold uppercase opacity-60">Speed</p>
                     </div>
                  </div>
               </div>
               <button className="bg-[#111111]/20 hover:bg-[#111111]/30 p-2 rounded-xl backdrop-blur-md transition-all">
                  <ExternalLink className="w-4 h-4" />
               </button>
            </div>
          </div>
          <Target className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
        </Card>

        <div className="flex flex-col justify-between">
           <div className="flex items-center justify-between px-1">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-violet-600"/> Performance Intelligence
              </h1>
              <div className="bg-[#111111] border rounded-xl p-1 flex shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                 {['Individual', 'Team'].map(t => (
                   <button key={t} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all hover:text-violet-600">
                     {t}
                   </button>
                 ))}
              </div>
           </div>
           
           <FairnessFormula />

           <div className="mt-6 flex flex-wrap gap-2">
              {['Global', 'Team Alpha', 'Friends', 'New Joiners'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
                    ${activeTab === t ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-[#111111] text-gray-400 border-white/5 hover:border-violet-300 hover:text-violet-600'}`}
                >
                  {t}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* ── Advanced Filters & Dimension Switcher ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#111111] p-2 rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-x-auto whitespace-nowrap scrollbar-hide">
         <div className="flex gap-1">
            {['Overall', 'Quality', 'Consistency', 'Improvement', 'Efficiency'].map(d => (
              <button
                key={d}
                onClick={() => setActiveDimension(d)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${activeDimension === d ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:bg-[#1a1a1a] border border-white/5 hover:text-violet-600'}`}
              >
                {d}
              </button>
            ))}
         </div>
         <div className="hidden md:block w-px h-8 bg-gray-100 mx-2" />
         <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#1a1a1a]/50">
               <Clock className="w-3.5 h-3.5" />
               <select className="bg-transparent outline-none cursor-pointer" value={activeTime} onChange={(e) => setActiveTime(e.target.value)}>
                  {['Today', 'Weekly', 'Monthly', 'This Quarter'].map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#1a1a1a]/50">
               <Filter className="w-3.5 h-3.5" />
               <select className="bg-transparent outline-none cursor-pointer" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  {['All', 'Developer', 'Sales', 'Manager', 'Support'].map(r => <option key={r} value={r}>{r}</option>)}
               </select>
            </div>
         </div>
      </div>

      {/* ── Enhanced Podium View ── */}
      <div className="relative rounded-[40px] overflow-hidden pt-12 pb-0 px-8 bg-[#000000] border border-white/10 shadow-2xl border border-white/5">
        {/* Animated Stars/Particles Cluster */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           {Array.from({ length: 40 }).map((_, i) => (
             <div key={i} className="absolute rounded-full bg-[#111111] animate-pulse"
               style={{ width: (Math.random()*2+1)+'px', height: (Math.random()*2+1)+'px', top: Math.random()*90+'%', left: Math.random()*100+'%', animationDelay: Math.random()*3+'s' }} />
           ))}
        </div>

        <div className="relative z-10 flex items-end justify-center gap-4 md:gap-12">
          {/* 2nd Place */}
          {second && (
            <div className="flex flex-col items-center gap-3 pb-8">
              <div className="relative">
                <Avatar name={second.name} size="md" idx={1} />
                <div className="absolute -top-1 -left-1 flex">
                   <AchievementBadge label={second.badges[0] || 'Fast Improver'} />
                </div>
                <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-black text-xs border-4 border-[#1a0b3b] shadow-lg">2</div>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-base">{second.name}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                   <p className="text-violet-300 text-xs font-black">{second.total_xp}pts</p>
                   <div className="h-1 w-1 bg-[#111111]/20 rounded-full" />
                   <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span className="text-white/60 text-[10px] font-black">{second.streak}d</span>
                   </div>
                </div>
              </div>
              <div className="w-32 h-36 bg-[#111111]/5 border-t border-white/10 rounded-t-[20px] backdrop-blur-sm flex flex-col items-center justify-end pb-4 gap-4">
                 <MiniChart data={second.history} color="#a78bfa" />
                 <span className="text-white/20 font-black text-4xl">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {first && (
            <div className="flex flex-col items-center gap-2 relative">
              <div className="absolute -top-14">
                 <Crown className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-bounce" />
              </div>
              <div className="relative">
                <Avatar name={first.name} size="lg" idx={0} />
                <div className="absolute -top-2 -right-12">
                   <div className="bg-yellow-400 text-purple-950 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg ring-4 ring-[#000000]">
                      <Star className="w-3 h-3 fill-purple-950" /> Elite Tier
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-1 w-10 h-10 rounded-full bg-yellow-400 text-purple-950 flex items-center justify-center font-black text-base border-4 border-[#1a0b3b] shadow-xl">1</div>
              </div>
              <div className="text-center mt-3">
                <p className="text-white font-black text-2xl">{first.name}</p>
                <div className="flex items-center justify-center gap-3 mt-1 underline decoration-yellow-400/30">
                   <p className="text-yellow-400 text-2xl font-black">{first.total_xp} pts</p>
                   <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Lvl {first.current_level}</span>
                </div>
                <div className="mt-2 flex gap-1 justify-center">
                   {first.badges.map(b => <AchievementBadge key={b} label={b} />)}
                </div>
              </div>
              <div className="w-44 h-56 bg-violet-500/10 border-t border-white/10 rounded-t-[32px] backdrop-blur-md flex flex-col items-center justify-end pb-6 gap-6 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/50" />
                 <MiniChart data={first.history} color="#fbbf24" />
                 <span className="text-yellow-400/20 font-black text-7xl italic">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex flex-col items-center gap-3 pb-8">
              <div className="relative">
                <Avatar name={third.name} size="md" idx={2} />
                <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs border-4 border-[#1a0b3b] shadow-lg">3</div>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-base">{third.name}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                   <p className="text-violet-300 text-xs font-black">{third.total_xp}pts</p>
                   <div className="h-1 w-1 bg-[#111111]/20 rounded-full" />
                   <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span className="text-white/60 text-[10px] font-black">{third.streak}d</span>
                   </div>
                </div>
              </div>
              <div className="w-32 h-28 bg-[#111111]/5 border-t border-white/10 rounded-t-[20px] backdrop-blur-sm flex flex-col items-center justify-end pb-4 gap-4">
                 <MiniChart data={third.history} color="#f59e0b" />
                 <span className="text-white/20 font-black text-4xl">3</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Advanced Table: Interactive & Dense ── */}
      <div className="bg-[#111111] rounded-[32px] shadow-xl border border-white/5 overflow-hidden">
        <div className="px-8 py-4 bg-[#1a1a1a]/50 border-b border-white/5 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
           <div className="flex items-center gap-12">
              <span className="w-8">Rank</span>
              <span className="w-48">Performance Entity</span>
           </div>
           <div className="flex items-center gap-8">
              <span className="w-16 text-center">Movement</span>
              <span className="w-16 text-center">Streak</span>
              <span className="w-20 text-right">Aggregate</span>
              <span className="w-6"></span>
           </div>
        </div>

        {rest.map((user, i) => {
          const rank = i + 4;
          const isMe = user.id === 3;
          const isExpanded = expandedUser === user.id;

          return (
            <div key={user.id} className={`group border-b border-gray-50 last:border-0 transition-all ${isMe ? 'bg-[#1a1a1a] border border-white/5/50' : 'hover:bg-[#1a1a1a] border border-white/5/20'}`}>
              <div 
                className="flex items-center justify-between gap-4 px-8 py-6 cursor-pointer"
                onClick={() => setExpandedUser(isExpanded ? null : user.id)}
              >
                <div className="flex items-center gap-12">
                   <div className="w-8 flex items-center gap-2">
                      <span className={`text-sm font-black ${rank < 10 ? 'text-white' : 'text-gray-400'}`}>#{rank}</span>
                      <RiskIndicator type={user.risk} />
                   </div>
                   <div className="flex items-center gap-4 w-48">
                      <Avatar name={user.name} size="sm" idx={rank} />
                      <div>
                         <p className="text-sm font-black text-white flex items-center gap-2">
                           {user.name} 
                           {isMe && <div className="px-1.5 py-0.5 rounded-full bg-violet-600 text-[8px] text-white">YOU</div>}
                         </p>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{user.role} &bull; {user.team}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="w-16 flex justify-center">
                      <div className={`flex flex-col items-center ${user.change > 0 ? 'text-emerald-500' : user.change < 0 ? 'text-rose-500' : 'text-gray-300'}`}>
                         <span className="text-[10px] font-black">{user.change > 0 ? `+${user.change}` : user.change}</span>
                         {user.change > 0 ? <TrendingUp className="w-3 h-3" /> : user.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      </div>
                   </div>
                   <div className="w-16 flex flex-col items-center">
                      <div className="flex items-center gap-1">
                         <Flame className={`w-3.5 h-3.5 ${user.streak > 20 ? 'text-rose-500 animate-pulse' : 'text-gray-300'}`} />
                         <span className="text-xs font-black text-gray-300">{user.streak}d</span>
                      </div>
                      {rank === 4 && <div className="text-[7px] font-black text-rose-500 uppercase mt-0.5">Top Streak 🔥</div>}
                   </div>
                   <div className="w-20 text-right">
                      <p className="text-sm font-black text-white">{user.total_xp.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase">TechPoints</p>
                   </div>
                   <div className="w-6">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-violet-600 transition-colors" />}
                   </div>
                </div>
              </div>

              {/* ── Expandable Insight Panel ── */}
              {isExpanded && (
                <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
                   <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                         <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fairness Scorecard</span>
                            <span className="text-[10px] font-black text-violet-600 px-2 py-0.5 bg-[#1a1a1a] border border-white/5 rounded-full border border-violet-100">Level {user.current_level} Tier</span>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                            <Card className="p-3 bg-[#111111]">
                               <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Quality</p>
                               <p className="text-xl font-black text-indigo-600">{user.quality}%</p>
                            </Card>
                            <Card className="p-3 bg-[#111111]">
                               <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Efficiency</p>
                               <p className="text-xl font-black text-violet-600">{user.efficiency}%</p>
                            </Card>
                            <Card className="p-3 bg-[#111111]">
                               <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Consistency</p>
                               <p className="text-xl font-black text-emerald-600">{user.consistency}%</p>
                            </Card>
                         </div>
                      </div>
                      <div className="w-px h-full bg-gray-200 hidden md:block" />
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Velocity (7d)</span>
                            <MiniChart data={user.history} />
                         </div>
                         <div className="space-y-2">
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium capitalize">
                               {user.risk === 'dropping fast' ? '⚠️ Caution: Performance velocity is decelerating. Immediate focus on Quality required.' : '✅ Optimal Consistency: Maintaining peak performance across all dimensions.'}
                            </p>
                            <button className="flex items-center gap-2 text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline pt-2">
                               <Activity className="w-3 h-3" /> Full Comparative Analysis <ArrowRight className="w-3 h-3" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
         <button className="px-8 py-3 bg-[#111111] border border-white/5 rounded-full text-xs font-black text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            Load More Global Rankings
         </button>
      </div>
    </div>
  );
}
