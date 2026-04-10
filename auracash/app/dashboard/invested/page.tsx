'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Shield, BarChart3, PieChart, Activity } from 'lucide-react';
import Link from 'next/link';

interface InvestedStock {
    symbol: string;
    name: string;
    count: number;
    price: number;
    value: number;
    change: number;
}

export default function InvestedStocksPage() {
    const [stocks, setStocks] = useState<InvestedStock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking the "Match" logic between Notification and Dashboard
        // In a real app, this would fetch from the 'invested_stocks' table
        const mockInvestments = [
            { symbol: 'RELIANCE', name: 'Reliance Industries', count: 12, price: 2540.50, value: 30486.00, change: 2.4 },
            { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', count: 25, price: 1620.15, value: 40503.75, change: -0.8 },
            { symbol: 'INFY', name: 'Infosys Limited', count: 18, price: 1450.00, value: 26100.00, change: 1.2 },
        ];

        setTimeout(() => {
            setStocks(mockInvestments);
            setLoading(false);
        }, 800);
    }, []);

    const totalPortfolio = stocks.reduce((acc, stock) => acc + stock.value, 0);

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-white p-6 font-sans selection:bg-[#00e699]/30 antialiased">
            <div className="max-w-4xl mx-auto space-y-10 py-12">
                
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <Link href="/notifications" className="group flex items-center gap-2 text-white/40 hover:text-[#00e699] transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Pulse</span>
                    </Link>
                    <div className="flex items-center gap-3 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#00e699]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e699] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e699]"></span>
                        </span>
                        Portfolio Live
                    </div>
                </div>

                {/* Hero Portfolio Card */}
                <div className="relative p-12 rounded-[48px] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl border border-white/10 overflow-hidden group shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e699]/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-[#00e699]/20" />
                    
                    <div className="relative z-10 space-y-6">
                        <div>
                            <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-3">Total Invested Value</p>
                            <h1 className="text-6xl font-black tracking-tighter text-white">
                                ₹{totalPortfolio.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h1>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-[#00e699] text-[#0b0f1a] font-black text-xs tracking-wide">
                                <TrendingUp className="w-4 h-4" />
                                +4.2% GROWTH
                            </div>
                            <div className="flex items-center gap-3 py-3 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black text-xs tracking-wide backdrop-blur-md">
                                <Shield className="w-4 h-4 text-[#00e699]" />
                                AI MANAGED
                            </div>
                        </div>
                    </div>
                </div>

                {/* Holdings Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-black text-white/90 tracking-tight">Active Holdings</h2>
                        <div className="flex items-center gap-4 text-white/30">
                            <BarChart3 className="w-4 h-4" />
                            <PieChart className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="py-24 rounded-[40px] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-white/10 gap-4">
                                <Activity className="w-10 h-10 animate-pulse text-[#00e699]/30" />
                                <span className="font-bold text-sm uppercase tracking-widest opacity-20">Syncing Portfolio...</span>
                            </div>
                        ) : (
                            stocks.map((stock) => (
                                <div key={stock.symbol} className="group p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-[#00e699]/30 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl hover:shadow-[#00e699]/5">
                                    <div className="flex items-center gap-6 w-full sm:w-auto">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center font-black text-lg text-white group-hover:text-[#00e699] transition-colors">
                                            {stock.symbol[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white group-hover:text-[#00e699] transition-colors tracking-tight">
                                                {stock.name}
                                            </h3>
                                            <p className="text-xs font-black text-white/20 uppercase tracking-widest mt-1">
                                                {stock.symbol} • {stock.count} SHARES
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white font-mono tracking-tighter">
                                                ₹{stock.value.toLocaleString('en-IN')}
                                            </p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${stock.change >= 0 ? 'text-[#00e699]' : 'text-red-400'}`}>
                                                {stock.change >= 0 ? '+' : ''}{stock.change}%
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Activity className="w-4 h-4 text-white/40" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
