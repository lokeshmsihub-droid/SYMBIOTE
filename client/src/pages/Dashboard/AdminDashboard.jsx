import { useState, useEffect } from 'react';
import { Card } from '../../components/ui';
import { Users, Activity, Target, Zap, Server, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 142,
    activeUsers: 89,
    systemHealth: 98,
    jiraTasksSynced: 1204
  });
  
  useEffect(() => {
    // Simulated fetch for admin metrics. In standard implementation, fetch from /admin/metrics.
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#030303] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-zinc-400">Loading System Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6 animate-in fade-in duration-700">
      
      {/* ── System Header ── */}
      <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] rounded-[32px] p-8 text-white relative overflow-hidden border border-white/5 shadow-2xl flex items-center justify-between">
         <div className="relative z-10 flex flex-col">
            <h1 className="text-3xl font-black text-white tracking-widest uppercase italic">System Control</h1>
            <p className="text-zinc-500 text-sm mt-1 font-bold">Welcome back, Operator {user?.name}</p>
         </div>
         <div className="relative z-10 flex gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">All Systems Nominal</span>
            </div>
         </div>
         
         <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* ── Macro Level Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard label="Total Operatives" value={metrics.totalUsers} icon={Users} color="text-violet-400" bg="bg-violet-600/10" />
         <MetricCard label="Active Sessions" value={metrics.activeUsers} icon={Activity} color="text-emerald-400" bg="bg-emerald-600/10" />
         <MetricCard label="System Health" value={`${metrics.systemHealth}%`} icon={Server} color="text-blue-400" bg="bg-blue-600/10" />
         <MetricCard label="Jira Operations" value={metrics.jiraTasksSynced} icon={Zap} color="text-amber-400" bg="bg-amber-600/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 bg-[#0a0a0a] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500" /> Active System Tasks
            </h3>
            <button className="text-[10px] font-black text-zinc-500 uppercase hover:text-white transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            <TaskItem title="Run Integrity Check" type="Routine" status="Pending" color="bg-amber-500/10 text-amber-500" />
            <TaskItem title="Sync Jira Webhooks" type="Integration" status="Active" color="bg-emerald-500/10 text-emerald-500" />
            <TaskItem title="Purge Orphaned Tokens" type="Security" status="Pending" color="bg-rose-500/10 text-rose-500" />
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20">
          <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Platform Economics</h3>
          <p className="text-xs text-zinc-400 font-bold mb-6">Overview of token distribution and rewards issuance.</p>
          
          <div className="space-y-6">
             <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div>
                   <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Total TechCoins Circulating</p>
                   <p className="text-3xl font-black text-amber-400 mt-1">452,100</p>
                </div>
                <TrendingUp />
             </div>
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Season Tokens Issued</p>
                   <p className="text-3xl font-black text-violet-400 mt-1">8,450</p>
                </div>
                <TrendingUp />
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }) {
  return (
    <Card className="p-6 bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center border border-white/5`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-white mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function TaskItem({ title, type, status, color }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#111111] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${color}`}>
          {status}
        </div>
        <div>
          <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{title}</p>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{type}</p>
        </div>
      </div>
      <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
        <ChevronRight className="w-4 h-4 text-zinc-400" />
      </button>
    </div>
  );
}

function TrendingUp() {
   return (
      <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
         <Activity className="w-3 h-3" />
         <span className="text-[9px] font-black">+12%</span>
      </div>
   );
}
