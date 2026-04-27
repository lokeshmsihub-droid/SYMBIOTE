import { useState } from 'react';
import { Card } from '../../components/ui';
import { Settings, Plus, Edit2, Trash2, Gift } from 'lucide-react';

const rewards = [
  { id: 1, name: 'Amazon Gift Card', cat: 'Gift Cards', cost: 500, type: 'coins' },
  { id: 2, name: 'Extra PTO Day', cat: 'Perks', cost: 1000, type: 'coins' },
  { id: 7, name: 'Skill Badge Booster', cat: 'Gamification', cost: 50, type: 'tokens' },
];

export default function RewardsAdminView() {
  const [data] = useState(rewards);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic flex items-center gap-3">
             <Settings className="w-6 h-6 text-violet-500" />
             Rewards Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Admin Level Access: Global Point Economics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-500/20 hover:bg-violet-700 transition-all">
           <Plus className="w-4 h-4" /> Create Reward
        </button>
      </div>

      <Card className="bg-[#0a0a0a] border border-white/5 overflow-hidden p-6">
         <h2 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Active Inventory</h2>
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <th className="px-4 py-3">ID / Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Cost Currency</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3 text-right">Actions</th>
               </tr>
            </thead>
            <tbody>
               {data.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                           <Gift className="w-4 h-4 text-violet-400" />
                           <span className="text-sm font-bold text-white">{r.name}</span>
                        </div>
                     </td>
                     <td className="px-4 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">{r.cat}</td>
                     <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${r.type === 'coins' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'}`}>
                           {r.type}
                        </span>
                     </td>
                     <td className="px-4 py-4 text-sm font-black text-white">{r.cost}</td>
                     <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 bg-[#111111] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                           </button>
                           <button className="p-2 bg-[#111111] border border-white/5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </Card>
    </div>
  );
}
