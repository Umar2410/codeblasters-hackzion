'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Zap, 
  ChevronRight,
  PieChart,
  History,
  Settings,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck,
  Eye,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import PageWrapper from '@/components/PageWrapper';
import InvestmentModal from '@/components/InvestmentModal';

const GROWTH_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 4500 },
  { name: 'Mar', value: 4200 },
  { name: 'Apr', value: 5800 },
  { name: 'May', value: 6200 },
  { name: 'Jun', value: 7500 },
  { name: 'Jul', value: 8900 },
];

const SPENDING_DATA = [
  { name: 'Rent', value: 25000, color: '#00e1ab' },
  { name: 'Food', value: 12000, color: '#00d1ff' },
  { name: 'Travel', value: 8000, color: '#7cffd4' },
  { name: 'Bills', value: 5000, color: '#64748b' },
  { name: 'Other', value: 4000, color: '#e2e8f0' },
];

export default function DashboardPage() {
  const [investing, setInvesting] = useState(false);
  const [invested, setInvested] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvestConfirm = () => {
    setIsModalOpen(false);
    setInvesting(true);
    setTimeout(() => {
      setInvesting(false);
      setInvested(true);
    }, 2000);
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] pb-12">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-1">Smart Aura View</h1>
              <p className="text-slate-500 text-sm">Welcome back, Snehan. Your AI co-pilot is active.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-aura-primary/20 w-64"
                />
              </div>
              <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-aura-primary/10 border border-aura-primary/20 flex items-center justify-center text-aura-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Balances & Charts */}
          <div className="lg:col-span-8 space-y-8">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aura-card p-6 bg-white">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">₹12,45,600</h2>
                <div className="flex items-center gap-1 text-aura-primary text-xs font-bold">
                  <ArrowUpRight className="w-3 h-3" />
                  +4.2% this month
                </div>
              </div>
              <div className="aura-card p-6 bg-white">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Safe to Spend</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">₹84,200</h2>
                <p className="text-slate-500 text-xs">After bills & investments</p>
              </div>
              <div className="aura-card p-6 bg-aura-primary text-white border-none shadow-lg shadow-aura-primary/20">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Idle Surplus</p>
                <h2 className="text-3xl font-bold mb-2">₹1,20,000</h2>
                <div className="flex items-center gap-1 text-white text-xs font-bold">
                  <Zap className="w-3 h-3 fill-white" />
                  AI Suggested Action
                </div>
              </div>
            </div>

            {/* Smart Sentinel Status */}
            <div className="p-4 bg-slate-900 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-aura-primary/20 flex items-center justify-center">
                  <Cpu className="text-aura-primary w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Smart Sentinel is Active</p>
                  <p className="text-slate-400 text-xs">Monitoring 2 bank accounts for idle cash & anomalies.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-aura-primary animate-pulse" />
                <span className="text-aura-primary text-xs font-bold uppercase tracking-widest">Live Scan</span>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="aura-card p-8 bg-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-poppins font-bold text-xl text-slate-900">Wealth Growth</h3>
                  <p className="text-slate-500 text-sm">Projected vs Actual performance</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <button className="px-3 py-1 text-xs font-bold rounded-lg bg-white shadow-sm text-slate-900">6M</button>
                  <button className="px-3 py-1 text-xs font-bold rounded-lg text-slate-500">1Y</button>
                  <button className="px-3 py-1 text-xs font-bold rounded-lg text-slate-500">ALL</button>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e1ab" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00e1ab" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#00e1ab', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#00e1ab" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Net Worth Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aura-card p-8 bg-white">
                <h3 className="font-poppins font-bold text-lg text-slate-900 mb-6">Asset Allocation</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Savings Accounts', value: '₹4,45,600', percent: 35, color: 'bg-blue-500' },
                    { name: 'Mutual Funds', value: '₹6,00,000', percent: 48, color: 'bg-aura-primary' },
                    { name: 'Liquid Cash', value: '₹2,00,000', percent: 17, color: 'bg-orange-400' },
                  ].map((asset, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{asset.name}</span>
                        <span className="font-bold text-slate-900">{asset.value}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${asset.color}`} style={{ width: `${asset.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="aura-card p-8 bg-white">
                <h3 className="font-poppins font-bold text-lg text-slate-900 mb-6">Upcoming Bills</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Rent Payment', date: 'Due in 3 days', amount: '₹25,000', status: 'Pending' },
                    { name: 'Airtel Postpaid', date: 'Due in 5 days', amount: '₹999', status: 'Pending' },
                  ].map((bill, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{bill.name}</p>
                        <p className="text-[10px] text-slate-500">{bill.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{bill.amount}</p>
                        <span className="text-[10px] font-bold text-orange-500 uppercase">{bill.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Suggestions & Insights */}
          <div className="lg:col-span-4 space-y-8">
            {/* AI Suggestion Card */}
            <div className="aura-card p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-aura-primary/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-aura-primary flex items-center justify-center">
                    <Cpu className="text-slate-900 w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-aura-primary">AI Strategist</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Idle Money Detected</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  You have <span className="text-white font-bold">₹1,20,000</span> sitting in your HDFC account earning only 3%. 
                  Moving this to Liquid Funds could earn you <span className="text-aura-primary font-bold">₹8,400</span> more annually.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400">Current Yield</span>
                    <span className="text-sm font-bold">3.1%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-aura-primary/10 rounded-2xl border border-aura-primary/20">
                    <span className="text-xs text-aura-primary">Aura Strategy Yield</span>
                    <span className="text-sm font-bold text-aura-primary">7.2%</span>
                  </div>
                </div>

                {!invested ? (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    disabled={investing}
                    className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {investing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        Invest Now
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-aura-primary/20 border border-aura-primary/30 p-4 rounded-2xl flex items-center gap-3 text-aura-primary">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold">Investment Successful!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Spending Breakdown */}
            <div className="aura-card p-8 bg-white">
              <h3 className="font-poppins font-bold text-xl text-slate-900 mb-8">Spending Insights</h3>
              <div className="h-64 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SPENDING_DATA} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                      {SPENDING_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <AlertCircle className="text-orange-500 w-5 h-5 mt-0.5" />
                  <p className="text-slate-600 text-xs leading-relaxed">
                    You&apos;ve spent <span className="font-bold text-slate-900">12% more</span> on Food this month compared to your average.
                  </p>
                </div>
              </div>
            </div>

            {/* Connected Banks */}
            <div className="aura-card p-8 bg-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-poppins font-bold text-xl text-slate-900">Connected Banks</h3>
                <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-[10px]">HD</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">HDFC Bank</p>
                      <p className="text-xs text-slate-500">•••• 4291</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">₹8,42,000</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-[10px]">IC</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">ICICI Bank</p>
                      <p className="text-xs text-slate-500">•••• 8823</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">₹4,03,600</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleInvestConfirm}
        amount="₹1,20,000"
        strategy="Aura Liquid Alpha Strategy"
        projectedYield="7.2% p.a."
      />
    </PageWrapper>
  );
}
