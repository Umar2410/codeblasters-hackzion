'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Mail, Lock, Smartphone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const nextStep = () => setStep(step + 1);

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-aura-primary rounded-2xl flex items-center justify-center shadow-lg shadow-aura-primary/20">
                <Wallet className="text-white w-7 h-7" />
              </div>
            </Link>
            <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Start your journey to active wealth</p>
          </div>

          <div className="aura-card p-8 bg-white overflow-hidden">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-aura-primary' : 'bg-slate-100'}`} 
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={nextStep}
                    className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        placeholder="98765 43210" 
                        className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Create Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={nextStep}
                    className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group"
                  >
                    Verify Phone
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-aura-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="text-aura-primary w-10 h-10" />
                  </div>
                  <h3 className="font-poppins font-bold text-xl text-slate-900 mb-2">Verify OTP</h3>
                  <p className="text-slate-500 text-sm mb-8">We&apos;ve sent a 6-digit code to your phone</p>
                  
                  <div className="flex justify-center gap-3 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input 
                        key={i}
                        type="text" 
                        maxLength={1}
                        className="w-10 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                      />
                    ))}
                  </div>
                  
                  <Link 
                    href="/onboarding" 
                    className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group"
                  >
                    Complete Signup
                    <CheckCircle2 className="w-5 h-5" />
                  </Link>
                  
                  <button className="mt-6 text-sm font-bold text-slate-400 hover:text-aura-primary transition-colors">
                    Resend Code in 0:59
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account? <Link href="/login" className="text-aura-primary font-bold hover:text-aura-accent transition-colors">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
