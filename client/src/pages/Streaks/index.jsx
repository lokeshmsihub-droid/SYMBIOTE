import React, { useState, useEffect } from 'react';
import { Flame, Shield, Snowflake, History, Clock, HelpCircle, Activity, Target, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui';
import api from '../../services/api';

// Sub-components
import StreakCalendar from '../../components/streak/StreakCalendar';
import StreakProtection from '../../components/streak/StreakProtection';
import StreakMilestones from '../../components/streak/StreakMilestones';
import StreakInsights from '../../components/streak/StreakInsights';

export default function Streaks() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = 3; // Hardcoded for demo consistency

  useEffect(() => {
    fetchStreakData();
  }, []);

   const buildLogs = (currentStreak, lastActivityDate) => {
      const logs = [];
      const days = Math.max(0, Math.min(currentStreak || 0, 30));
      const anchor = lastActivityDate ? new Date(lastActivityDate) : new Date();
      for (let i = days - 1; i >= 0; i -= 1) {
         const d = new Date(anchor);
         d.setDate(d.getDate() - i);
         logs.push({
            date: d.toISOString().slice(0, 10),
            status: 'completed',
         });
      }
      return logs;
   };

   const fetchStreakData = async () => {
      try {
         const response = await api.get(`/streak/${userId}`);
         const streak = response.data;
         if (streak) {
            setData({
               user_id: streak.userId,
               current_streak: streak.currentStreak,
               longest_streak: streak.longestStreak,
               logs: buildLogs(streak.currentStreak, streak.lastActivityDate),
            });
         }
      } catch (error) {
         console.error('Fetch error:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleUseFreeze = async () => {
      try {
          await api.post(`/streak/update/${userId}`);
          fetchStreakData();
      } catch (e) { console.error(e); }
   };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <Flame className="w-12 h-12 text-violet-500 animate-pulse" />
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Igniting your data...</p>
      </div>
    </div>
  );

  const stats = [
    { label: 'Current Streak', value: `${data?.current_streak || 0} Days`, icon: Flame, color: 'text-violet-400', bg: 'bg-violet-600/10' },
    { label: 'Personal Best',  value: `${data?.longest_streak || 0} Days`, icon: History, color: 'text-emerald-400', bg: 'bg-emerald-600/10' },
    { label: 'Next Bonus',    value: '460 XP',  icon: Clock, color: 'text-blue-400', bg: 'bg-blue-600/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">

      {/* ── Dashboard Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <Flame className="w-8 h-8 text-violet-500 fill-violet-500 animate-pulse" /> Streak Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Be consistent, earn bonuses, and protect your momentum.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2 bg-[#111111] border border-white/10 rounded-xl text-[10px] font-black text-gray-300 hover:text-white hover:border-violet-500 transition-all flex items-center gap-2 uppercase tracking-widest">
              <History className="w-3.5 h-3.5" /> Full History
           </button>
           <button className="px-5 py-2 bg-violet-600 rounded-xl text-[10px] font-black text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 transition-all uppercase tracking-widest">
              Review Tasks
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Calendar */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Flame Hero */}
          <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] rounded-[40px] p-10 border border-white/5 relative overflow-hidden flex flex-col items-center">
             <div className="relative z-10 text-center">
                <div className="relative inline-block mb-6">
                   <div className="absolute inset-x-0 bottom-0 top-1/2 bg-violet-600/20 blur-3xl opacity-50" />
                   <Flame className="w-32 h-32 text-violet-500 fill-violet-500 mb-2 relative z-10" />
                   <div className="absolute top-0 -right-2 bg-[#1a1a1a] border border-white/10 rounded-full w-10 h-10 flex items-center justify-center font-black text-[10px] text-white shadow-xl ring-2 ring-violet-500/20 z-20">
                      V2
                   </div>
                </div>
                <h2 className="text-6xl font-black text-white mb-2">{data?.current_streak || 0}</h2>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Day Active Streak</p>
             </div>

             {/* Risk Warning */}
             <div className="mt-10 bg-[#1a1a1a] border border-white/5 border-l-4 border-l-rose-500 rounded-2xl px-6 py-4 flex items-center gap-4 max-w-md w-full animate-in slide-in-from-bottom-2">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <div>
                   <p className="text-xs font-black text-white uppercase tracking-tight">At Risk: Streak expiring soon</p>
                   <p className="text-[10px] text-gray-400 font-bold mt-0.5">Complete your daily objective within <span className="text-rose-400">4h 12m</span> to maintain your 460 XP bonus momentum.</p>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px]" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px]" />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {stats.map((s, i) => {
               const Icon = s.icon;
               return (
                 <Card key={i} className="p-6">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${s.color}`} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.label}</p>
                          <p className="text-xl font-black text-white mt-0.5">{s.value}</p>
                       </div>
                    </div>
                 </Card>
               );
             })}
          </div>

          {/* Activity Calendar */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Consistency Map
                 </h3>
             </div>
             <StreakCalendar logs={data?.logs || []} />
          </section>

          {/* Milestones */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Target className="w-4 h-4" /> Streak Milestones
                </h3>
                <span className="text-[10px] font-black text-violet-500 uppercase">View All Rewards</span>
             </div>
             <StreakMilestones currentStreak={data?.current_streak || 0} />
          </section>

        </div>

        {/* Right Column: Insights & Protection */}
        <div className="space-y-8">
           
           {/* Protection Items */}
           <section className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Protection Arsenal</h3>
              <StreakProtection streak={data} onUseFreeze={handleUseFreeze} />
           </section>

           {/* Insights Panel */}
           <section className="space-y-4">
              <div className="flex items-center justify-between mb-4 px-1">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Smart Insights</h3>
                 <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111111] border border-white/10 text-[9px] font-black text-gray-400 uppercase hover:text-white hover:border-violet-500/50 transition-all">
                    <Clock className="w-3 h-3" /> Refresh
                 </button>
              </div>
              <StreakInsights logs={data?.logs || []} />
           </section>

           {/* Action Card */}
           <Card className="p-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-2">Push for Legend</h3>
                 <p className="text-xs font-medium opacity-80 leading-relaxed">You only need 7 more days to unlock the "Eternal Flame" badge and a permanent 1.2x XP multiplier.</p>
                 <button className="mt-8 w-full bg-[#111111] hover:bg-black text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl">
                    View Chapter Goals
                 </button>
              </div>
              <Target className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
           </Card>

        </div>

      </div>
    </div>
  );
}
