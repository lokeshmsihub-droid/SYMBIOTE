import { useState, useEffect } from 'react';
import { Card } from '../../components/ui';
import { Trophy, Shield, Users, Search, Filter, SortDesc, MoreVertical, Sparkles } from 'lucide-react';
import apiClient from '../../services/api';

export default function LeaderboardAdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch full tabular data for admin
      const { success, data } = await apiClient.get('/leaderboard');
      if (success && data?.leaderboard) {
        setUsers(data.leaderboard);
      } else {
        // Fallback or mock data for visualization
        setUsers([
          { id: 1, name: 'Lokesh Kumar M S', role: 'Engineering', total_xp: 4500, quality: 98, speed: 95 },
          { id: 2, name: 'Amal Raajan S', role: 'Validation', total_xp: 4200, quality: 95, speed: 92 },
          { id: 3, name: 'Sriram R P', role: 'Support', total_xp: 3950, quality: 92, speed: 89 },
          { id: 4, name: 'Vishnu Darshan S', role: 'Engineering', total_xp: 3800, quality: 90, speed: 85 }
        ]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Trophy className="w-10 h-10 text-violet-400 animate-pulse" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic flex items-center gap-3">
             <Trophy className="w-6 h-6 text-violet-500" />
             Global Roster Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Admin Level Access: Full Audit Mode</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-violet-500" />
            <input 
               type="text" 
               placeholder="Search Operatives..." 
               className="bg-[#111111] border border-white/10 text-zinc-300 text-xs rounded-xl pl-9 pr-4 py-2 w-64 outline-none focus:border-violet-500/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white hover:border-violet-500 transition-all">
             <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      <Card className="bg-[#0a0a0a] border border-white/5 overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-white/5 bg-[#111111]/50 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Rank / Operative</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Total XP</th>
                  <th className="px-6 py-4">Quality Index</th>
                  <th className="px-6 py-4">Speed Index</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                           <span className="text-lg font-black text-violet-500 w-6">#{i+1}</span>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{u.name}</span>
                              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5 max-w-[120px] truncate">{u.name.toLowerCase().replace(/ /g, '.')}@internal.io</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{u.role}</td>
                     <td className="px-6 py-4">
                        <span className="text-sm font-black text-white px-2 py-1 bg-white/5 rounded-md border border-white/10">{u.total_xp.toLocaleString()}</span>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-[#111111] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${u.quality}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-emerald-400">{u.quality}%</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-[#111111] rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${u.speed}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-amber-400">{u.speed}%</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button className="p-1.5 bg-[#111111] rounded-lg border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors inline-flex">
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </Card>
    </div>
  );
}
