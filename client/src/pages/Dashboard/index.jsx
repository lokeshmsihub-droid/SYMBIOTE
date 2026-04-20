import { useState, useEffect } from 'react';
import {
  Zap, Coins, Trophy, Flame, TrendingUp, Users, ChevronRight,
  Plus, Bell, Star, Activity, Target, BookOpen, Cpu, Lightbulb,
  AlertCircle, Clock, ArrowRight
} from 'lucide-react';
import { ProgressBar } from '../../components/ui';
import api from '../../services/api';

// ── Static Data ───────────────────────────────────────────────────────────────
const personaTabs = ['Achievers View', 'Explorers View', 'Socializers View', 'Competitors View', 'Reluctant View'];

const teamStories = [
  { name: 'Vishnudharshan S', initials: 'V',  color: 'bg-violet-100 text-violet-700', ring: 'ring-violet-400' },
  { name: 'Lokesh Kumar M S',  initials: 'L',  color: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-400' },
  { name: 'Amal Raajan S',  initials: 'A',  color: 'bg-violet-50 text-violet-600',  ring: 'ring-violet-200' },
  { name: 'Sriram R P',  initials: 'S',  color: 'bg-indigo-50 text-indigo-600',  ring: 'ring-indigo-200' },
];

const fomoAlerts = [
  { label: 'Limited Time',  desc: 'Double XP Weekend ends in 2h 15m',         badge: 'bg-amber-100 text-amber-700', barColor: 'bg-gradient-to-b from-amber-300 to-amber-500' },
  { label: 'Trending',      desc: '42 people joined AI Sprint challenge',       badge: 'bg-blue-100 text-blue-700', barColor: 'bg-gradient-to-b from-blue-400 to-blue-600' },
  { label: 'Exclusive',     desc: 'Only 3 Legend slots left this quarter',      badge: 'bg-violet-100 text-violet-700', barColor: 'bg-gradient-to-b from-violet-400 to-violet-600' },
  { label: 'Flash Sale',    desc: 'Reward vouchers 50% off — Next 4 hours',    badge: 'bg-emerald-100 text-emerald-700', barColor: 'bg-gradient-to-b from-emerald-400 to-emerald-600' },
  { label: 'Streak Alert',  desc: '1 challenge away from 7-day streak',         badge: 'bg-orange-100 text-orange-700', barColor: 'bg-gradient-to-b from-orange-400 to-orange-600' },
];

const nextActions = [
  { title: 'Complete Code Review Sprint',   xp: '+50 XP',  dot: 'bg-violet-400' },
  { title: 'Join Vetri Kalanjiyam B Hackathon',     xp: '+400 XP', dot: 'bg-violet-400' },
  { title: 'Open Weekly Discovery Box',     xp: 'Mystery', dot: 'bg-violet-400' },
  { title: 'Submit Accountability Report',  xp: '+80 XP',  dot: 'bg-violet-400' },
];

const pillars = [
  { name: 'Learning',    pct: 82, color: 'bg-violet-500' },
  { name: 'Upskilling',  pct: 71, color: 'bg-violet-500' },
  { name: 'Innovation',  pct: 68, color: 'bg-violet-500' },
  { name: 'Teamwork',    pct: 90, color: 'bg-violet-500' },
  { name: 'Wellbeing',   pct: 55, color: 'bg-violet-500' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, isPrimary }) {
  if (isPrimary) {
    return (
      <div className="relative overflow-hidden bg-violet-500 rounded-[32px] shadow-lg shadow-violet-200/50 p-6 group transition-all duration-300">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#111111]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[15px] font-medium text-violet-100">{label}</p>
          <div className="w-10 h-10 rounded-full bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-200" />
          </div>
        </div>
        <p className="text-[42px] leading-none font-medium text-white tracking-tight relative z-10 mb-3">{value}</p>
        {sub && (
           <div className="flex items-center gap-2 relative z-10">
              <span className="px-2 py-0.5 rounded border border-white/30 bg-[#111111]/10 text-white text-[10px] font-bold">{sub.badge}</span>
              <span className="text-xs text-violet-200 font-medium">{sub.text}</span>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#111111] rounded-[32px] border border-white/5 p-6 group hover:shadow-xl hover:border-transparent transition-all duration-300">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <p className="text-[15px] font-medium text-gray-400 group-hover:text-white transition-colors duration-300">{label}</p>
        <div className="w-10 h-10 rounded-full border border-white/5 bg-[#111111] flex items-center justify-center group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
          <Icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
        </div>
      </div>
      <p className="text-[42px] leading-none font-medium text-white tracking-tight relative z-10 mb-3">{value}</p>
      {sub && (
         <div className="flex items-center gap-2 relative z-10">
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
              sub.badge.includes('+') ? 'text-violet-600 bg-violet-50 border-violet-200' : 'text-rose-500 bg-rose-50 border-rose-200'
            }`}>{sub.badge}</span>
            <span className="text-xs text-gray-400 font-medium">{sub.text}</span>
         </div>
      )}
    </div>
  );
}

function PerformanceChart() {
  return (
    <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6 relative overflow-hidden h-[340px] mb-5">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="font-bold text-white text-[17px]">Performance</h2>
        <div className="flex items-center gap-2 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300 font-semibold cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-shadow bg-[#111111]">
           12 Apr, 2026 <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
      
      {/* Chart SVG Canvas */}
      <div className="absolute bottom-8 left-0 right-0 h-48 w-full px-12">
         <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs>
               <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#135d3d" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#135d3d" stopOpacity="0.01" />
               </linearGradient>
            </defs>
            <path 
               d="M0,100 C100,100 150,50 200,60 C250,70 300,160 350,150 C400,140 450,50 500,60 C550,70 600,180 650,140 C700,100 750,20 800,10 L800,200 L0,200 Z" 
               fill="url(#chart-gradient)" 
            />
            <path 
               d="M0,100 C100,100 150,50 200,60 C250,70 300,160 350,150 C400,140 450,50 500,60 C550,70 600,180 650,140 C700,100 750,20 800,10" 
               fill="none" 
               stroke="#135d3d" 
               strokeWidth="2.5" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               filter="drop-shadow(0 4px 6px rgba(19, 93, 61, 0.15))"
            />
            <path 
               d="M0,140 C100,120 150,100 200,110 C250,120 300,80 350,90 C400,100 450,140 500,120 C550,100 600,80 650,100 C700,120 750,140 800,90" 
               fill="none" 
               stroke="#86efac" 
               strokeWidth="2.5" 
            />
            
            {/* Tooltip points & vertical line */}
            <g transform="translate(480, 0)">
              <line x1="0" y1="0" x2="0" y2="200" stroke="#135d3d" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
              <circle cx="0" cy="56" r="4.5" fill="#fff" stroke="#135d3d" strokeWidth="2.5" />
              <circle cx="0" cy="128" r="4" fill="#6ee7b7" />
            </g>
         </svg>
      </div>

      {/* Floating Tooltip */}
      <div className="absolute top-[85px] left-1/2 ml-10 bg-[#000000] border border-white/10 rounded-xl p-4 shadow-2xl z-20 w-44">
         <p className="text-white text-[11px] font-bold mb-3">13 Apr, 2026</p>
         <div className="flex justify-between items-center text-[10.5px] mb-2">
            <span className="flex items-center gap-2 text-gray-400"><div className="w-[7px] h-[7px] bg-[#4ade80] rounded-full shrink-0"/> This month</span>
            <span className="text-white font-bold tracking-wide">6h</span>
         </div>
         <div className="flex justify-between items-center text-[10.5px]">
            <span className="flex items-center gap-2 text-gray-400"><div className="w-[7px] h-[7px] bg-[#135d3d] rounded-full shrink-0"/> Last month</span>
            <span className="text-white font-bold tracking-wide">7h</span>
         </div>
      </div>
      
      {/* X Axis Labels */}
      <div className="absolute bottom-5 left-12 right-12 flex justify-between z-0 text-[13px] text-gray-500 font-medium tracking-wide">
         <span>01</span><span>02</span><span>03</span><span className="text-white font-bold bg-[#111111] px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative z-20">04</span><span>05</span><span>06</span><span>07</span>
      </div>
      
      {/* Y Axis Labels */}
      <div className="absolute left-6 top-24 bottom-14 flex flex-col justify-between text-[13px] text-gray-400 font-medium">
         <span>12h</span><span>8h</span><span>6h</span><span>2h</span><span>0h</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activePersona, setActivePersona] = useState('Achievers View');
  const [data, setData] = useState({ stats: null, pendingTasks: [], topPerformers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = () => setData({
      stats: { total_xp: 4280, current_level: 14, wallet_balance: 1850, streak: 23 },
      pendingTasks: [
        { id: 101, title: 'Complete Code Review Sprint' },
        { id: 102, title: 'Innovation Pitch Prep' },
        { id: 103, title: 'Network Builder' },
      ],
      topPerformers: [
        { id: 1, name: 'Lokesh Kumar M S',  total_xp: 5120 },
        { id: 2, name: 'Sriram R P',  total_xp: 4890 },
        { id: 3, name: 'SriVishnu S',  total_xp: 4280 },
        { id: 4, name: 'Vishnudharshan S', total_xp: 3950 }
      ]
    });
    const load = async () => {
      try {
        const [dr, lr] = await Promise.all([api.get('/dashboard'), api.get('/leaderboard')]);
        const dashboard = dr.data || {};
        const leaderboard = Array.isArray(lr.data) ? lr.data : [];
        const stats = {
          total_xp: dashboard.xp ?? 0,
          current_level: dashboard.level ?? 0,
          wallet_balance: dashboard.coins ?? 0,
          streak: dashboard.streak ?? 0,
        };
        const topPerformers = leaderboard.slice(0, 4).map((entry) => ({
          id: entry.userId,
          name: entry.name,
          total_xp: entry.xp,
        }));
        setData({
          stats,
          pendingTasks: [
            { id: 101, title: 'Complete Code Review Sprint' },
            { id: 102, title: 'Innovation Pitch Prep' },
            { id: 103, title: 'Network Builder' },
          ],
          topPerformers: topPerformers.length ? topPerformers : [
            { id: 1, name: 'Lokesh Kumar M S',  total_xp: 5120 },
            { id: 2, name: 'Sriram R P',  total_xp: 4890 },
            { id: 3, name: 'SriVishnu S',  total_xp: 4280 },
            { id: 4, name: 'Vishnudharshan S', total_xp: 3950 }
          ],
        });
      } catch {
        fallback();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-gray-400 text-sm animate-pulse">Loading dashboard...</div>;

  const xp     = data.stats?.total_xp      || 4280;
  const level  = data.stats?.current_level || 14;
  const streak = data.stats?.streak        || 23;
  const coins  = data.stats?.wallet_balance|| 1850;
  const xpPct  = 86; // Based on Screenshot 5.52.28 PM

  return (
    <div className="space-y-5">

      {/* ── Persona Tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {personaTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActivePersona(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all
              ${activePersona === tab
                ? 'bg-violet-500 text-white border-violet-600 shadow-[0_4px_20px_rgba(0,0,0,0.6)] shadow-violet-200'
                : 'bg-[#111111] text-gray-400 border-white/10 hover:border-violet-300 hover:text-violet-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Welcome Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-[#111111] rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-6 py-5">
        <div>
          <h1 className="text-2xl font-black text-white">Welcome back, SriVishnu S</h1>
          <p className="text-sm text-gray-500 mt-1">
            The Innovation Forge &nbsp;·&nbsp; Day {streak} Streak &nbsp;·&nbsp; {xp.toLocaleString()} XP to Level {level + 1}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="px-4 py-1.5 border border-white/10 rounded-xl text-sm font-semibold text-gray-400 hover:bg-[#1a1a1a] transition-colors flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Tour
          </button>
          <button className="px-4 py-1.5 border border-violet-300 rounded-xl text-sm font-semibold text-violet-600 hover:bg-violet-50 transition-colors flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Kudos
          </button>
          <button className="px-4 py-1.5 bg-violet-500 rounded-xl text-sm font-bold text-white hover:bg-violet-700 transition-colors flex items-center gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] shadow-violet-200">
            <Plus className="w-4 h-4" /> Submit
          </button>
        </div>
      </div>

      {/* ── 3 Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard isPrimary label="Finished" value="18" sub={{badge: '+8', text: 'tasks'}} icon={Trophy} />
        <StatCard label="Tracked" value="31h" sub={{badge: '-6', text: 'hours'}} icon={Clock} />
        <StatCard label="Efficiency" value="93%" sub={{badge: '12%', text: 'improvement'}} icon={TrendingUp} />
      </div>

      {/* ── Level Progress ── */}
      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-6 py-4 flex items-center gap-4">
        <div className="text-sm font-bold text-gray-300 whitespace-nowrap">
          Level {level} &nbsp;·&nbsp; The Innovation Forge
        </div>
        <div className="flex-1">
          <ProgressBar progress={xpPct} color="bg-violet-500" />
        </div>
        <div className="text-sm font-bold text-violet-600 whitespace-nowrap">{xpPct}%</div>
      </div>

      {/* ── Main 2-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT (col-span-2) */}
        <div className="lg:col-span-2">

          {/* Performance Flow */}
          <PerformanceChart />

          {/* Current Tasks */}
          <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6 mb-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-white text-[17px]">Current Tasks</h2>
              <div className="flex items-center gap-2 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300 font-semibold cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-shadow bg-[#111111]">
                 Week <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
            
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[#1a1a1a]/70 border-b border-white/5 text-[11px] font-bold text-gray-500 tracking-wider">
                     <th className="py-3 px-4 rounded-l-2xl font-medium">Project</th>
                     <th className="py-3 px-4 font-medium">Time/Date</th>
                     <th className="py-3 px-4 font-medium">Status</th>
                     <th className="py-3 px-4 rounded-r-2xl text-center font-medium">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50/50">
                  <tr className="group">
                     <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                           <Target className="w-4 h-4 text-rose-600" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-200">Product Review for U18 Market</span>
                     </td>
                     <td className="py-4 px-4 text-[13px] text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 4h</div>
                     </td>
                     <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-md border border-amber-100">In Progress</span>
                     </td>
                     <td className="py-4 px-4 text-center">
                        <button className="text-gray-300 hover:text-white font-bold transition-colors">•••</button>
                     </td>
                  </tr>
                  <tr className="group">
                     <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                           <Cpu className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-200">UX Research for Product</span>
                     </td>
                     <td className="py-4 px-4 text-[13px] text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 8h</div>
                     </td>
                     <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md border border-rose-100">On hold</span>
                     </td>
                     <td className="py-4 px-4 text-center">
                        <button className="text-gray-300 hover:text-white font-bold transition-colors">•••</button>
                     </td>
                  </tr>
                  <tr className="group">
                     <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                           <Lightbulb className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-200">App Design and Development</span>
                     </td>
                     <td className="py-4 px-4 text-[13px] text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12h</div>
                     </td>
                     <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md border border-emerald-100">Done</span>
                     </td>
                     <td className="py-4 px-4 text-center">
                        <button className="text-gray-300 hover:text-white font-bold transition-colors">•••</button>
                     </td>
                  </tr>
               </tbody>
            </table>
          </div>

          {/* Team Stories */}
          <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" /> Developer Stories
              </h2>
              <button className="text-xs text-violet-600 font-semibold flex items-center gap-0.5 hover:underline">
                See all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              {teamStories.map(m => (
                <div key={m.name} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-full ${m.color} ring-2 ${m.ring} flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform`}>
                    {m.initials}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{m.name}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-gray-100 ring-2 ring-dashed ring-gray-300 flex items-center justify-center text-gray-400 group-hover:bg-violet-50 group-hover:ring-violet-300 transition-all">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Add</span>
              </div>
            </div>
          </div>

          {/* Active Team Challenge */}
          <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-200">Dr. Vishnudharshan's Innovation Sprint Team</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Collaborative research on GenAI applications &nbsp;·&nbsp; 2 spots remaining</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-violet-500 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.6)] shadow-violet-200 flex-shrink-0">
                Join Team
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 text-gray-500">
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">1</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold ml-1">2</span>
              <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-bold ml-1">3</span>
              <span className="text-xs font-medium ml-2">3 members joined</span>
            </div>
          </div>

          {/* Next Best Actions + 5 Pillars (two-col row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Next Best Actions */}
            <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-5">
              <h2 className="font-bold text-gray-200 flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-violet-500" /> Next Best Actions
              </h2>
              <div className="space-y-3">
                {nextActions.map((a, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-[#1a1a1a] p-2 -mx-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${a.dot} flex-shrink-0`} />
                      <span className="text-sm text-gray-300 font-medium">{a.title}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      a.xp === 'Mystery' ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'
                    }`}>{a.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Pillars */}
            <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-5">
              <h2 className="font-bold text-gray-200 flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-violet-500" /> 5 Pillars
              </h2>
              <div className="space-y-3.5">
                {pillars.map(p => (
                  <div key={p.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400 font-medium">{p.name}</span>
                      <span className="text-xs font-bold text-gray-500">{p.pct}%</span>
                    </div>
                    <ProgressBar progress={p.pct} color={p.color} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: FOMO Alerts */}
        <div className="space-y-5">
          <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6">
            <h2 className="font-bold text-gray-200 flex items-center gap-2 mb-4">
              Activity
            </h2>
            <div className="space-y-6">
              {[
                { name: 'Miles Floyd', text: 'Left a comment on the', target: 'Stark Project', time: '10:45 AM', img: 'https://i.pravatar.cc/150?u=miles', status: 'online' },
                { name: 'Ethan Brooks', text: 'Added a file to', target: '7heros Project', time: '10:45 AM', img: 'https://i.pravatar.cc/150?u=ethan', status: 'online' },
                { name: 'Kristen Walters', text: 'Commented on', target: '7heros Project', time: '10:45 AM', img: 'https://i.pravatar.cc/150?u=kristen', status: 'online' }
              ].map((a, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="relative shrink-0">
                    <img src={a.img} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                    {a.status === 'online' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                     <div className="flex justify-between items-baseline mb-0.5">
                        <p className="text-[13px] font-bold text-white">{a.name}</p>
                        <span className="text-[10px] font-semibold text-gray-400">{a.time}</span>
                     </div>
                     <p className="text-xs text-gray-500">{a.text} <span className="text-violet-600 font-semibold">{a.target}</span></p>
                     
                     {/* Chat bubble for first item demo */}
                     {i === 0 && (
                       <div className="mt-3 bg-[#1a1a1a] border border-white/5 rounded-xl rounded-tl-none p-3 relative">
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">Hey! We're kicking off a new project next week. I'll share all the details with you soon.</p>
                          <div className="absolute -bottom-2 -right-2 bg-[#111111] rounded-full p-1 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/5 text-[10px]">👍</div>
                       </div>
                     )}
                     
                     {/* File attachment for second item demo */}
                     {i === 1 && (
                       <div className="mt-3 bg-[#1a1a1a] border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-[10px]">F</div>
                             <div>
                                <p className="text-xs font-bold text-white">Guy Hawkins</p>
                                <p className="text-[10px] font-medium text-gray-500">13.5 Mb</p>
                             </div>
                          </div>
                          <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#111111] transition-colors">
                             <ArrowRight className="w-3 h-3 text-violet-600 transform rotate-90" />
                          </div>
                       </div>
                     )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 hover:border-violet-300 transition-colors bg-[#1a1a1a]/50">
               <AlertCircle className="w-4 h-4 text-gray-400" />
               <input type="text" placeholder="Write a message" className="bg-transparent text-xs outline-none flex-1 font-medium placeholder:text-gray-400" />
               <div className="flex gap-2">
                  <span className="text-gray-400 hover:text-gray-300 cursor-pointer text-sm">☺</span>
                  <span className="text-gray-400 hover:text-gray-300 cursor-pointer text-sm">🎙</span>
               </div>
            </div>
          </div>

          <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6">
            <h2 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" /> Performance Snapshot
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Tasks Completed', value: '14 / 18', pct: 78, color: 'bg-violet-500' },
                { label: 'Goals on Track',  value: '4 / 5',   pct: 80, color: 'bg-violet-500' },
                { label: 'Team Engagement', value: '92%',     pct: 92, color: 'bg-violet-500' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">{s.label}</span>
                    <span className="text-xs font-bold text-gray-300">{s.value}</span>
                  </div>
                  <ProgressBar progress={s.pct} color={s.color} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
