'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard,
  Search,
  ChevronRight
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

const INDIAN_BANKS = [
  { id: 'sbi', name: 'SBI', color: 'bg-blue-600' },
  { id: 'hdfc', name: 'HDFC', color: 'bg-blue-800' },
  { id: 'icici', name: 'ICICI', color: 'bg-orange-600' },
  { id: 'axis', name: 'Axis', color: 'bg-red-800' },
  { id: 'kotak', name: 'Kotak', color: 'bg-red-600' },
  { id: 'pnb', name: 'PNB', color: 'bg-yellow-600' },
  { id: 'bob', name: 'BOB', color: 'bg-orange-500' },
  { id: 'canara', name: 'Canara', color: 'bg-blue-500' },
  { id: 'union', name: 'Union', color: 'bg-red-500' },
  { id: 'idbi', name: 'IDBI', color: 'bg-green-600' },
  { id: 'yes', name: 'Yes Bank', color: 'bg-blue-400' },
  { id: 'indusind', name: 'IndusInd', color: 'bg-red-900' },
  { id: 'federal', name: 'Federal', color: 'bg-blue-700' },
  { id: 'idfc', name: 'IDFC First', color: 'bg-red-700' },
  { id: 'bandhan', name: 'Bandhan', color: 'bg-blue-900' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const confetti = React.useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: `${(i * 7) % 100}%`,
      left: `${(i * 13) % 100}%`,
      scale: 0.5 + ((i * 3) % 10) / 10,
      rotate: (i * 45) % 360,
      color: ['bg-aura-primary', 'bg-blue-400', 'bg-yellow-400', 'bg-red-400'][i % 4]
    }));
  }, []);

  return (
    <PageWrapper showNav={false} showFooter={false}>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="aura-card p-10 bg-white"
              >
                <div className="mb-10">
                  <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-2">Connect Your Bank</h1>
                  <p className="text-slate-500">Securely link your account to enable AI insights</p>
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bank Account Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all text-lg font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Registered Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        placeholder="98765 43210" 
                        className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all text-lg"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group text-lg"
                >
                  Select Bank
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="aura-card p-10 bg-white"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-2">Select Your Bank</h1>
                    <p className="text-slate-500">Choose the bank associated with the account</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search banks..." 
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-aura-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-10">
                  {INDIAN_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${selectedBank === bank.id ? 'border-aura-primary bg-aura-primary/5 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className={`w-12 h-12 ${bank.color} rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                        {bank.name.substring(0, 2)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{bank.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="aura-button-secondary flex-1 py-4"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!selectedBank}
                    onClick={() => setStep(3)}
                    className="aura-button-primary flex-[2] py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify Connection
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="aura-card p-10 bg-white text-center"
              >
                <div className="w-20 h-20 bg-aura-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Building2 className="text-aura-primary w-10 h-10" />
                </div>
                <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-2">Final Verification</h1>
                <p className="text-slate-500 mb-10">Your bank is requesting a one-time password to authorize the connection.</p>
                
                <div className="flex justify-center gap-3 mb-10">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
                      className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => setStep(4)}
                  className="aura-button-primary w-full py-4 text-lg"
                >
                  Link Account
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aura-card p-12 bg-white text-center relative overflow-hidden"
              >
                {/* Simulated Confetti */}
                {confetti.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ 
                      top: '50%', 
                      left: '50%', 
                      scale: 0,
                      rotate: 0 
                    }}
                    animate={{ 
                      top: c.top, 
                      left: c.left, 
                      scale: c.scale,
                      rotate: c.rotate 
                    }}
                    transition={{ 
                      duration: 1, 
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 50
                    }}
                    className={`absolute w-2 h-2 rounded-sm z-0 ${c.color}`}
                  />
                ))}

                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-aura-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-aura-primary/30"
                  >
                    <CheckCircle2 className="text-white w-12 h-12" />
                  </motion.div>
                  <h1 className="font-poppins font-bold text-4xl text-slate-900 mb-4">Connected Successfully!</h1>
                  <p className="text-slate-500 text-lg mb-12">
                    Your bank account is now securely linked to AuraCash. Our AI is analyzing your idle funds.
                  </p>
                  
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                        {selectedBank ? selectedBank.substring(0, 2).toUpperCase() : 'HD'}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900">
                          {INDIAN_BANKS.find(b => b.id === selectedBank)?.name || 'HDFC Bank'}
                        </p>
                        <p className="text-xs text-slate-500">Account ending in •••• 4291</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-aura-primary/10 text-aura-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                      Active
                    </div>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="aura-button-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
