'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Wallet, Mail, Lock, Smartphone, ArrowRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

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
            <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Log in to your AuraCash account</p>
          </div>

          <div className="aura-card p-8 bg-white">
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
              <button 
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${loginMethod === 'password' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                Password
              </button>
              <button 
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              >
                OTP
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email or Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="name@example.com" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                  />
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <div className="flex justify-between mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    <Link href="#" className="text-xs font-bold text-aura-primary hover:text-aura-accent transition-colors">Forgot?</Link>
                  </div>
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
              ) : (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <Smartphone className="text-blue-500 w-5 h-5 mt-0.5" />
                  <p className="text-blue-700 text-sm">
                    We&apos;ll send a 6-digit code to your registered mobile number.
                  </p>
                </div>
              )}

              <Link 
                href="/dashboard" 
                className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group"
              >
                {loginMethod === 'password' ? 'Login' : 'Send OTP'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Don&apos;t have an account? <Link href="/signup" className="text-aura-primary font-bold hover:text-aura-accent transition-colors">Sign up</Link>
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-slate-400 text-xs">
            By logging in, you agree to our <Link href="/rules" className="underline">Terms</Link> and <Link href="/rules" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
