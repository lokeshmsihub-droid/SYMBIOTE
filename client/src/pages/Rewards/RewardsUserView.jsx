import { useState } from 'react';
import { Card } from '../../components/ui';
import { ShoppingBag, Coins, Sparkles, CreditCard, Coffee, BookOpen, Music, Shirt, Zap, Shield, Laptop, ChevronRight } from 'lucide-react';

const categories = [
  'All', 'Gift Cards', 'Perks', 'Learning', 'Food', 'Subscriptions', 'Merchandise', 'Gamification', 'Equipment'
];

const rewards = [
  { id: 1, name: 'Amazon Gift Card', cat: 'Gift Cards', cost: 500, type: 'coins', icon: '🎁', featured: true },
  { id: 2, name: 'Extra PTO Day', cat: 'Perks', cost: 1000, type: 'coins', icon: '🏖️', featured: true },
  { id: 3, name: 'Premium Course Access', cat: 'Learning', cost: 300, type: 'coins', icon: '📚', featured: false },
  { id: 4, name: 'Team Lunch Voucher', cat: 'Food', cost: 200, type: 'coins', icon: '🍕', featured: false },
  { id: 5, name: 'Spotify Premium (1mo)', cat: 'Subscriptions', cost: 150, type: 'coins', icon: '🎵', featured: false },
  { id: 6, name: 'Office Swag Bundle', cat: 'Merchandise', cost: 400, type: 'coins', icon: '👕', featured: false },
  { id: 7, name: 'Skill Badge Booster', cat: 'Gamification', cost: 50, type: 'tokens', icon: '⚡', featured: false },
  { id: 8, name: 'Streak Freeze (3x)', cat: 'Gamification', cost: 30, type: 'tokens', icon: '🧊', featured: false },
  { id: 9, name: 'Rank Shield (1x)', cat: 'Gamification', cost: 20, type: 'tokens', icon: '🛡️', featured: false },
  { id: 10, name: 'Netflix Gift Card', cat: 'Gift Cards', cost: 400, type: 'coins', icon: '🎬', featured: false },
  { id: 11, name: 'Conference Ticket', cat: 'Learning', cost: 800, type: 'coins', icon: '🎙️', featured: true },
  { id: 12, name: 'Ergonomic Mouse', cat: 'Equipment', cost: 600, type: 'coins', icon: '🖱️', featured: false },
];

export default function RewardsUserView() {
  const [activeCat, setActiveCat] = useState('All');
  const balance = { coins: 1240, tokens: 85 };

  const filtered = activeCat === 'All' 
    ? rewards 
    : rewards.filter(r => r.cat === activeCat);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ── High-Impact Currency Header ("The Hat") ── */}
      <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] rounded-[32px] p-8 text-white relative overflow-hidden border border-white/5 shadow-2xl flex items-center justify-between">
         <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Available Credits</p>
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                     <div className="w-5 h-5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center justify-center font-black text-[10px] text-amber-900 leading-none">C</div>
                  </div>
                  <div>
                    <p className="text-3xl font-black leading-none text-white tracking-tighter">{balance.coins.toLocaleString()}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">TechCoins</p>
                  </div>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 bg-violet-600/10 rounded-full flex items-center justify-center border border-violet-500/20 group-hover:scale-110 transition-transform">
                     <div className="w-5 h-4 bg-violet-500 rounded-sm italic font-black text-[8px] flex items-center justify-center text-white border border-white/30 shadow-[0_0_15px_rgba(139,92,246,0.5)]">T</div>
                  </div>
                  <div>
                    <p className="text-3xl font-black leading-none text-white tracking-tighter">{balance.tokens}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Season Tokens</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="relative z-10 bg-[#1a1a1a] p-4 rounded-2xl border border-white/10 hover:border-violet-500/50 hover:bg-violet-600/10 transition-all cursor-pointer shadow-xl group">
            <ShoppingBag className="w-7 h-7 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all" />
         </div>

         {/* Refined subtle glow */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* ── Page Title & Filters ── */}
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">Rewards Store</h1>
          <p className="text-sm text-gray-500 mt-1">Redeem your coins and tokens for amazing rewards</p>
        </div>

        <div className="flex flex-wrap gap-2 pb-2">
           {categories.map(cat => (
             <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${activeCat === cat 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                    : 'bg-[#111111] text-gray-400 border border-white/5 hover:border-white/10 hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </section>

      {/* ── Rewards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {filtered.map(item => (
           <Card key={item.id} className="p-6 bg-[#111111] border border-white/5 flex flex-col group relative overflow-hidden transition-all hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 active:scale-[0.98]">
             
             {item.featured && (
               <div className="absolute top-4 right-4 bg-violet-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-md border border-violet-400/30 italic z-10 shadow-lg shadow-violet-500/20">
                 Featured
               </div>
             )}

             <div className="h-20 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform drop-shadow-2xl">
               {item.icon}
             </div>

             <div className="mb-8">
               <h3 className="font-black text-white text-sm leading-tight group-hover:text-violet-400 transition-colors">{item.name}</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{item.cat}</p>
             </div>

             <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                   {item.type === 'coins' ? (
                     <div className="w-5 h-5 bg-amber-500/20 rounded-full border border-amber-500/30 shadow-inner flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                     </div>
                   ) : (
                     <div className="w-5 h-4 bg-yellow-400 rounded-sm italic font-black text-[8px] flex items-center justify-center text-indigo-900 border border-white/30">T</div>
                   )}
                   <span className="text-sm font-black text-gray-200">{item.cost.toLocaleString()}</span>
                </div>
                <button className="px-5 py-2 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-violet-500/20 hover:bg-violet-700 active:scale-95 transition-all">
                  Redeem
                </button>
             </div>
           </Card>
         ))}
      </div>

    </div>
  );
}
