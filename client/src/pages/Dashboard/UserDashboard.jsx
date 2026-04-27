import { useState, useEffect } from 'react';
import {
  Zap, Coins, Trophy, Flame, TrendingUp, Users, ChevronRight,
  Plus, Bell, Star, Activity, Target, BookOpen, Cpu, Lightbulb,
  AlertCircle, Clock, ArrowRight, CheckCircle2, Loader2, Link2, Unlink
} from 'lucide-react';
import { ProgressBar } from '../../components/ui';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ── Static Data ───────────────────────────────────────────────────────────────
const teamStories = [
  { name: 'Vishnudharshan S', initials: 'V',  color: 'bg-violet-100 text-violet-700', ring: 'ring-violet-400' },
  { name: 'Lokesh Kumar M S',  initials: 'L',  color: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-400' },
  { name: 'Amal Raajan S',  initials: 'A',  color: 'bg-violet-50 text-violet-600',  ring: 'ring-violet-200' },
  { name: 'Sriram R P',  initials: 'S',  color: 'bg-indigo-50 text-indigo-600',  ring: 'ring-indigo-200' },
];

const pillars = [
  { name: 'Learning',    pct: 82, color: 'bg-violet-500' },
  { name: 'Upskilling',  pct: 71, color: 'bg-violet-500' },
  { name: 'Innovation',  pct: 68, color: 'bg-violet-500' },
  { name: 'Teamwork',    pct: 90, color: 'bg-violet-500' },
  { name: 'Wellbeing',   pct: 55, color: 'bg-violet-500' },
];

const nextActions = [
  { title: 'Update project documentation', dot: 'bg-amber-400', xp: '+15 XP' },
  { title: 'Review merge request from Lokesh', dot: 'bg-violet-400', xp: '+25 XP' },
  { title: 'Weekly system sync', dot: 'bg-emerald-400', xp: 'Mystery' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, isPrimary }) {
  if (isPrimary) {
    return (
      <div className="relative overflow-hidden bg-violet-600 rounded-[32px] shadow-lg shadow-violet-600/20 p-6 group transition-all duration-500 hover:-translate-y-1">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-[15px] font-bold text-violet-100">{label}</p>
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-4xl font-black text-white tracking-tight relative z-10 mb-3">{value}</p>
        {sub && (
           <div className="flex items-center gap-2 relative z-10">
              <span className="px-2 py-0.5 rounded-lg border border-white/20 bg-white/10 text-white text-[10px] font-black">{sub.badge}</span>
              <span className="text-xs text-violet-100/70 font-bold">{sub.text}</span>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 group hover:border-white/10 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <p className="text-[15px] font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</p>
        <div className="w-10 h-10 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
          <Icon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-200" />
        </div>
      </div>
      <p className="text-4xl font-black text-white tracking-tight relative z-10 mb-3">{value}</p>
      {sub && (
         <div className="flex items-center gap-2 relative z-10">
            <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black ${
              sub.badge.includes('+') ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-zinc-400 bg-white/5 border-white/5'
            }`}>{sub.badge}</span>
            <span className="text-xs text-zinc-500 font-bold">{sub.text}</span>
         </div>
      )}
    </div>
  );
}

function PerformanceChart() {
  return (
    <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-2xl p-6 relative overflow-hidden h-[340px] mb-5">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="font-black text-white text-[17px] tracking-tight">XP Velocity</h2>
        <div className="flex items-center gap-2 border border-white/5 rounded-full px-4 py-1.5 text-xs text-zinc-400 font-bold bg-white/5 hover:bg-white/10 transition-colors cursor-pointer capitalize">
           This Week <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 h-48 w-full px-12 opacity-50">
         <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs>
               <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
               </linearGradient>
            </defs>
            <path 
               d="M0,100 C100,100 150,50 200,60 C250,70 300,160 350,150 C400,140 450,50 500,60 C550,70 600,180 650,140 C700,100 750,20 800,10 L800,200 L0,200 Z" 
               fill="url(#chart-gradient)" 
            />
            <path 
               d="M0,100 C100,100 150,50 200,60 C250,70 300,160 350,150 C400,140 450,50 500,60 C550,70 600,180 650,140 C700,100 750,20 800,10" 
               fill="none" 
               stroke="#7c3aed" 
               strokeWidth="3" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
            />
         </svg>
      </div>

      <div className="absolute top-[85px] left-1/2 ml-10 bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-2xl z-20 w-44 backdrop-blur-xl">
         <p className="text-zinc-400 text-[10px] font-black mb-3 tracking-widest uppercase italic">Live Insight</p>
         <div className="space-y-4">
            <div>
               <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-tight">Velocity</p>
               <div className="flex justify-between items-end">
                  <span className="text-xl font-black text-white">+84%</span>
                  <div className="flex gap-0.5 pb-1">
                     <div className="w-1 h-3 bg-violet-500 rounded-full"/>
                     <div className="w-1 h-2 bg-violet-500/30 rounded-full"/>
                     <div className="w-1 h-4 bg-violet-500 rounded-full"/>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      <div className="absolute bottom-5 left-12 right-12 flex justify-between z-0 text-[11px] text-zinc-600 font-black tracking-widest uppercase">
         <span>Mon</span><span>Tue</span><span>Wed</span><span className="text-violet-500">Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [jiraStatus, setJiraStatus] = useState({ connected: false });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tasksRes, lbRes, jiraRes] = await Promise.all([
          apiClient.get('/users/me/stats'),
          apiClient.get('/tasks/my'),
          apiClient.get('/leaderboard/top10'),
          apiClient.get('/jira/oauth/status')
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (tasksRes.success) setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        if (lbRes.success) setLeaderboard(lbRes.data);
        if (jiraRes.success) setJiraStatus(jiraRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleConnectJira = async () => {
    setIsConnecting(true);
    try {
      const { success, data, error } = await apiClient.get('/jira/oauth/authorize-url');
      if (success && data?.url) {
        window.location.href = data.url;
      } else {
        alert(error?.message || 'Could not connect to Jira. Please try again.');
      }
    } catch (err) {
      alert('A system error occurred. Please refresh.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectJira = async () => {
    if (!confirm('Are you sure you want to disconnect your Jira account?')) return;
    try {
      const { success } = await apiClient.delete('/jira/oauth/disconnect');
      if (success) {
        setJiraStatus({ connected: false });
        setTasks([]);
      } else {
        alert('Failed to disconnect. Please try again.');
      }
    } catch (err) {
      console.error('Failed to disconnect Jira:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <p className="text-sm font-medium text-zinc-400">Personalizing your dashboard...</p>
        </div>
      </div>
    );
  }

  const xpPct = stats?.xpToNextLevel ? Math.floor((stats.currentXp / stats.xpToNextLevel) * 100) : 0;
  const level = stats?.level || 1;

  return (
    <div className="space-y-6 text-zinc-300">
      {/* ── Welcome Row ── */}
      <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 relative overflow-hidden group shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] group-hover:bg-violet-600/20 transition-all duration-700 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-600/20 text-violet-400 text-[10px] font-black uppercase tracking-wider">
                System Active
              </span>
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-wider">
                · v1.1.0 Stable (Per-User Integration)
              </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Welcome, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium flex items-center gap-2">
              <span className="text-violet-500">#{stats?.rank || '--'}</span> Ranking &nbsp;·&nbsp; {user?.department} &nbsp;·&nbsp; Level {level} Intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            {jiraStatus.connected ? (
              <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-2.5">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Jira Identity</span>
                   <span className="text-sm font-bold text-white">{jiraStatus.displayName}</span>
                </div>
                <button 
                  onClick={handleDisconnectJira}
                  className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                  title="Disconnect Jira"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnectJira}
                disabled={isConnecting}
                className={`h-12 px-6 bg-violet-600 hover:bg-violet-500 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Link2 className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Jira'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard isPrimary label="Total XP" value={stats?.currentXp?.toLocaleString() || '0'} icon={Zap} />
        <StatCard label="Weekly XP" value={stats?.weeklyXp?.toLocaleString() || '0'} sub={{ badge: '+12%', text: 'vs last week' }} icon={TrendingUp} />
        <StatCard label="Global Rank" value={`#${stats?.rank || '--'}`} sub={{ badge: 'TOP 5%', text: 'this month' }} icon={Trophy} />
        <StatCard label="Finished" value={stats?.tasksCompleted || '0'} sub={{ badge: '+2', text: 'today' }} icon={CheckCircle2} />
        <StatCard label="Active" value={stats?.activeTasks || '0'} sub={{ badge: 'priority', text: 'needs action' }} icon={Target} />
      </div>

      {/* ── Experience Evolution ── */}
      <div className="flex items-center gap-4 px-2">
        <div className="text-xs font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
          Level {level} &nbsp;·&nbsp; The Innovation Forge
        </div>
        <div className="flex-1">
          <ProgressBar progress={xpPct} color="bg-violet-500" />
        </div>
        <div className="text-sm font-bold text-violet-600 whitespace-nowrap">{xpPct}%</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PerformanceChart />

          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-2xl p-6 mb-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-white text-[17px] tracking-tight">Assigned Missions</h2>
              <div className="flex items-center gap-2 border border-white/5 rounded-full px-4 py-1.5 text-xs text-zinc-400 font-bold bg-white/5 hover:bg-white/10 transition-colors cursor-pointer capitalize">
                 View All <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white/5 text-[10px] font-black text-zinc-500 tracking-widest uppercase italic">
                       <th className="py-4 px-6 rounded-l-2xl">Mission ID</th>
                       <th className="py-4 px-6">Intelligence Summary</th>
                       <th className="py-4 px-6">Status</th>
                       <th className="py-4 px-6 rounded-r-2xl text-center font-medium">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {tasks.length > 0 ? (
                      tasks.map((task, idx) => (
                        <tr key={idx} className="group hover:bg-white/5 transition-all">
                           <td className="py-5 px-6">
                              <span className="text-xs font-black text-violet-400 bg-violet-500/10 px-2 py-1 rounded-lg border border-violet-500/20 uppercase tracking-tighter">
                                {task.key}
                              </span>
                           </td>
                           <td className="py-5 px-6">
                              <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{task.fields.summary}</span>
                           </td>
                           <td className="py-5 px-6">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                task.fields.status.name === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                task.fields.status.name === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-zinc-500/10 text-zinc-400 border-white/5'
                              }`}>
                                {task.fields.status.name}
                              </span>
                           </td>
                           <td className="py-5 px-6 text-center">
                              <button className="h-8 w-8 rounded-xl bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all group/btn">
                                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                              </button>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-zinc-600 text-sm font-bold animate-pulse italic">
                          {jiraStatus.connected ? 'No missions currently assigned to you.' : 'Connect Jira to synchronize your missions.'}
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div className="space-y-5">
          <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6">
            <h2 className="font-bold text-gray-200 flex items-center gap-2 mb-4">
              Activity
            </h2>
            <div className="space-y-6 text-zinc-500 text-xs font-medium">
              No recent external intelligence detected.
            </div>
          </div>

          <div className="bg-[#111111] rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-6">
            <h2 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" /> Performance Snapshot
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Tasks Completed', value: tasks.filter(t => t.fields.status.name === 'Done').length + ' / ' + tasks.length, pct: tasks.length > 0 ? (tasks.filter(t => t.fields.status.name === 'Done').length / tasks.length) * 100 : 0, color: 'bg-violet-500' },
                { label: 'Goals on Track',  value: '4 / 5',   pct: 80, color: 'bg-violet-500' },
                { label: 'Intelligence Level', value: 'High',     pct: 92, color: 'bg-violet-500' },
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
