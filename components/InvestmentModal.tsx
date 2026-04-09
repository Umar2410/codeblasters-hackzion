'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, ShieldCheck, TrendingUp, ArrowRight, Info } from 'lucide-react';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  strategy: string;
  projectedYield: string;
}

export default function InvestmentModal({ isOpen, onClose, onConfirm, amount, strategy, projectedYield }: InvestmentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="aura-card bg-white w-full max-w-lg relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-aura-primary flex items-center justify-center">
                  <Zap className="text-slate-900 w-5 h-5" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-slate-900">Investment Strategy</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-slate-500 text-sm mb-1">Investment Amount</p>
                <h2 className="text-4xl font-bold text-slate-900">{amount}</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="text-aura-primary w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{strategy}</p>
                    <p className="text-slate-500 text-xs">Low-risk liquid fund with T+1 liquidity.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-100 rounded-2xl">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Projected Yield</p>
                    <p className="text-lg font-bold text-aura-primary">{projectedYield}</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Risk Level</p>
                    <p className="text-lg font-bold text-slate-900">Low</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="text-blue-500 w-5 h-5 mt-0.5" />
                  <p className="text-blue-700 text-xs leading-relaxed">
                    This investment is fully compliant with SEBI regulations and protected by bank-grade security.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button onClick={onClose} className="flex-1 aura-button-secondary">Cancel</button>
              <button 
                onClick={onConfirm}
                className="flex-1 aura-button-primary flex items-center justify-center gap-2"
              >
                Confirm & Invest
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
