import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 text-white font-sans overflow-hidden relative">
            {/* Background Blur Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="max-w-md w-full text-center relative z-10">
                <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-violet-600/20 rounded-3xl blur-xl group-hover:bg-violet-600/30 transition-all duration-500"></div>
                    <AlertTriangle className="w-12 h-12 text-violet-500 relative z-10" />
                </div>

                <h1 className="text-8xl font-black mb-2 tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                    404
                </h1>
                
                <h2 className="text-2xl font-black mb-4 uppercase tracking-widest text-zinc-200 italic">
                    Coordinates Not Found
                </h2>

                <p className="text-zinc-500 mb-10 text-sm font-medium leading-relaxed">
                    The behavior intelligence node you are trying to access does not exist or has been relocated within the Symbiote network.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-violet-500/50 hover:bg-[#111111] transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                        <span className="text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Go Back</span>
                    </button>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 transition-all duration-300 shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 group"
                    >
                        <Home className="w-4 h-4 text-white" />
                        <span className="text-sm font-black uppercase tracking-widest text-white">Return Home</span>
                    </button>
                </div>
                
                <div className="mt-16 pt-8 border-t border-white/5 opacity-50">
                    <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase italic">
                        System Status: Alpha Operations Active
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
