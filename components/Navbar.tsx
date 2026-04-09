'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, User, Settings, History, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isDashboard = pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/transactions') || 
                      pathname.startsWith('/settings') ||
                      pathname.startsWith('/onboarding');

  return (
    <nav className="glass-nav px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-aura-primary rounded-xl flex items-center justify-center shadow-lg shadow-aura-primary/20 group-hover:scale-110 transition-transform">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-slate-900">
            Aura<span className="text-aura-primary">Cash</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-aura-primary' : 'text-slate-600 hover:text-aura-primary'}`}>Home</Link>
          <Link href="/dashboard" className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-aura-primary' : 'text-slate-600 hover:text-aura-primary'}`}>Dashboard</Link>
          <Link href="/rules" className={`text-sm font-medium transition-colors ${pathname === '/rules' ? 'text-aura-primary' : 'text-slate-600 hover:text-aura-primary'}`}>Security</Link>
          <Link href="/contact" className={`text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-aura-primary' : 'text-slate-600 hover:text-aura-primary'}`}>Contact</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {!isDashboard ? (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
              <Link href="/signup" className="aura-button-primary !py-2 !px-5 !text-sm">Get Started</Link>
            </>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-slate-50 rounded-full border border-slate-100 hover:border-aura-primary transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-aura-primary/20 flex items-center justify-center text-aura-primary font-bold text-xs">
                  SK
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:block">Snehan</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                    </div>
                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-aura-primary transition-colors">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    <Link href="/transactions" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-aura-primary transition-colors">
                      <History className="w-4 h-4" />
                      Transactions
                    </Link>
                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-aura-primary transition-colors">
                      <Settings className="w-4 h-4" />
                      Preferences
                    </Link>
                    <div className="border-t border-slate-50 mt-2 pt-2">
                      <Link href="/" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
