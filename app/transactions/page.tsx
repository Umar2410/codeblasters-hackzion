'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Zap, 
  Coffee, 
  ShoppingBag, 
  Home, 
  Smartphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

const TRANSACTIONS = [
  { id: 1, name: 'Starbucks Coffee', category: 'Food & Drink', date: 'Today, 10:24 AM', amount: -450, status: 'Completed', icon: <Coffee className="text-orange-500" /> },
  { id: 2, name: 'Salary Credit', category: 'Income', date: 'Yesterday, 06:00 PM', amount: 185000, status: 'Completed', icon: <ArrowUpRight className="text-aura-primary" /> },
  { id: 3, name: 'Mutual Fund SIP', category: 'Investment', date: '02 Apr, 2026', amount: -25000, status: 'Completed', icon: <Zap className="text-blue-500" /> },
  { id: 4, name: 'Amazon India', category: 'Shopping', date: '01 Apr, 2026', amount: -2499, status: 'Completed', icon: <ShoppingBag className="text-slate-500" /> },
  { id: 5, name: 'HDFC Home Loan', category: 'Bills', date: '31 Mar, 2026', amount: -42000, status: 'Completed', icon: <Home className="text-indigo-500" /> },
  { id: 6, name: 'Airtel Postpaid', category: 'Bills', date: '28 Mar, 2026', amount: -999, status: 'Completed', icon: <Smartphone className="text-blue-400" /> },
  { id: 7, name: 'Zomato Order', category: 'Food & Drink', date: '25 Mar, 2026', amount: -840, status: 'Completed', icon: <Coffee className="text-orange-500" /> },
  { id: 8, name: 'Stock Dividend', category: 'Income', date: '22 Mar, 2026', amount: 1250, status: 'Completed', icon: <ArrowUpRight className="text-aura-primary" /> },
  { id: 9, name: 'Netflix Subscription', category: 'Entertainment', date: '20 Mar, 2026', amount: -649, status: 'Completed', icon: <History className="text-red-500" /> },
  { id: 10, name: 'Uber Ride', category: 'Travel', date: '18 Mar, 2026', amount: -320, status: 'Completed', icon: <ArrowDownRight className="text-slate-400" /> },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState('All');

  const filteredTransactions = filter === 'All' 
    ? TRANSACTIONS 
    : TRANSACTIONS.filter(t => t.category === filter || (filter === 'Income' && t.amount > 0) || (filter === 'Expense' && t.amount < 0));

  return (
    <PageWrapper showFooter={false}>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] pb-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-1">Transaction History</h1>
              <p className="text-slate-500 text-sm">Track and manage your financial activities across all banks.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="aura-button-secondary flex items-center gap-2 !py-2 !px-4 !text-sm">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button className="aura-button-primary flex items-center gap-2 !py-2 !px-4 !text-sm">
                <Plus className="w-4 h-4" />
                Add Record
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by name, category, or amount..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {['All', 'Income', 'Expense', 'Investment', 'Bills'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${filter === f ? 'bg-aura-primary border-aura-primary text-slate-900 shadow-md shadow-aura-primary/20' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="aura-card bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransactions.map((tx) => (
                    <motion.tr 
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                            {tx.icon}
                          </div>
                          <span className="font-bold text-slate-900">{tx.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500">{tx.category}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500">{tx.date}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`font-bold ${tx.amount > 0 ? 'text-aura-primary' : 'text-slate-900'}`}>
                          {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
              <p className="text-sm text-slate-500">Showing 10 of 124 transactions</p>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1">
                  {[1, 2, 3].map((p) => (
                    <button 
                      key={p}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === 1 ? 'bg-aura-primary text-slate-900' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
