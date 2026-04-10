'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowRight, Smartphone, ShieldCheck, Building, Loader2, 
  Landmark, PiggyBank, Wallet, Briefcase, CreditCard, 
  CircleDollarSign, Coins, Gem, Vault, Receipt, Banknote, 
  Mail, Lock, Chrome, User as UserIcon
} from 'lucide-react';
import { signIn, signUp, updateMobileNumber, linkBankAccount, signInWithGoogle, sendOTP, verifyOTP } from '@/app/actions';

const BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', icon: Building },
  { id: 'sbi', name: 'State Bank of India', icon: Landmark },
  { id: 'icici', name: 'ICICI Bank', icon: Wallet },
  { id: 'axis', name: 'Axis Bank', icon: PiggyBank },
  { id: 'kotak', name: 'Kotak Mahindra', icon: Briefcase },
  { id: 'indusind', name: 'IndusInd Bank', icon: CreditCard },
  { id: 'yes', name: 'Yes Bank', icon: CircleDollarSign },
  { id: 'pnb', name: 'Punjab National Bank', icon: Coins },
  { id: 'bob', name: 'Bank of Baroda', icon: Vault },
  { id: 'canara', name: 'Canara Bank', icon: Receipt },
  { id: 'union', name: 'Union Bank', icon: Banknote },
  { id: 'idfc', name: 'IDFC First', icon: Gem },
];

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  
  // Bank Form State
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = mode === 'login' 
        ? await signIn(email, password)
        : await signUp(email, password, fullName);

      if (res.success) {
        localStorage.setItem('currentUserEmail', email);
        const user = res.user;

        if (!user) {
          // Auth succeeded but profile still loading — send to mobile step, not dashboard
          setStep(2);
          return;
        }

        if (!user.mobile) {
          setStep(2); // Needs mobile
        } else if (!user.bankDetails) {
          setStep(4); // Needs bank linking
        } else {
          window.location.href = '/dashboard'; // Hard redirect — ensures fresh session
        }
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) return;
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await updateMobileNumber(email, mobile);
      if (res.success) {
        // After saving number, send real OTP via Twilio
        const otpRes = await sendOTP(email, mobile);
        if (otpRes.success) {
          setStep(3); // ✅ Mobile saved & OTP sent → go to OTP
        } else {
          setErrorMsg(otpRes.error || 'Failed to send OTP. Please check the number.');
        }
      } else {
        setErrorMsg(res.error || 'Failed to save mobile number. Please try again.');
      }
    } catch (error) {
      setErrorMsg('An error occurred while saving your mobile number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await verifyOTP(email, otp);
      if (res.success) {
        setStep(4); // ✅ OTP verified → go to Bank Linking
      } else {
        setErrorMsg(res.error || 'Incorrect code or expired. Please try again.');
      }
    } catch (error: any) {
      setErrorMsg('Verification system error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName || !accountNumber || !selectedBank) return;
    setIsLoading(true);
    setErrorMsg('');

    const bankName = BANKS.find(b => b.id === selectedBank)?.name || selectedBank;
    const res = await linkBankAccount(email, { holderName, accountNumber, bankName });

    setIsLoading(false);

    if (res.success) {
      setStep(5); // ✅ Saved successfully → go to verifying screen
    } else {
      // Show the exact error so user knows what happened
      setErrorMsg(`⚠️ Bank save failed: ${res.error}. You can update this later from your profile.`);
      // Still allow advancing after 3 seconds or user can retry
      setTimeout(() => setStep(5), 3000);
    }
  };

  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        // Hard redirect — ensures Supabase session cookies are sent fresh with the new request
        window.location.href = '/dashboard';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-gradient p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 noise-bg z-0" />
      
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-100 to-orange-100 rounded-full blur-[100px] pointer-events-none opacity-50" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg limitless-card p-8 md:p-10 relative z-10"
      >
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium tracking-tight mb-2 text-multicolor">AuraCash</h1>
          <p className="text-text-muted text-sm font-light">
            {step === 1 
              ? (mode === 'login' ? 'Welcome back to AuraCash' : 'Join the wealth revolution') 
              : 'Complete your profile'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button 
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center">
                    {errorMsg}
                  </div>
                )}
                
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full bg-white/50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors shadow-sm"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Password</label>
                    {mode === 'login' && (
                      <button type="button" className="text-[10px] font-medium text-violet-600 hover:text-violet-700">Forgot Password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white font-medium py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-black/10 mt-6"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'Welcome Back' : 'Create My Account')}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-text-muted font-medium tracking-widest">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <button 
                  onClick={async () => {
                    setIsLoading(true);
                    const res = await signInWithGoogle();
                    if (res.success && res.url) {
                      window.location.href = res.url;
                    } else {
                      setErrorMsg(res.error || 'Google sign-in failed');
                      setIsLoading(false);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                  <Chrome className="w-4 h-4" /> Sign in with Google
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleMobileSubmit}
              className="space-y-6"
            >
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors font-mono shadow-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={mobile.length < 10 || isLoading}
                className="w-full bg-black text-white font-medium py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleOtpSubmit}
              className="space-y-6"
            >
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 tracking-[1em] text-center focus:outline-none focus:border-violet-400 focus:bg-white transition-colors font-mono shadow-sm"
                    required
                  />
                </div>
                <p className="text-xs text-text-muted mt-3 text-center font-light">Sent to {mobile}</p>
              </div>
              <button
                type="submit"
                disabled={otp.length < 4 || isLoading}
                className="w-full bg-black text-white font-medium py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
              </button>
            </motion.form>
          )}

          {step === 4 && (
            <motion.form
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleBankSubmit}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-medium text-slate-900">Add Bank Account</h2>
                <p className="text-sm text-text-muted font-light mt-1">Enter your bank details to continue</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Account Holder</label>
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000 0000 0000"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors font-mono shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Select Bank</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {BANKS.map((bank) => {
                      const Icon = bank.icon;
                      const isSelected = selectedBank === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-violet-50 text-violet-600 border-violet-400 shadow-sm' 
                              : 'bg-white/50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2" />
                          <span className="text-[10px] font-medium text-center leading-tight">{bank.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!holderName || !accountNumber || !selectedBank || isLoading}
                className="w-full bg-black text-white font-medium py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center shadow-lg shadow-black/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Continue'}
              </button>
            </motion.form>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-slate-200 border-t-violet-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-violet-500" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Verifying Connection</h3>
                <p className="text-sm text-text-muted font-light max-w-xs mx-auto">
                  Establishing secure handshake with your financial institution via SMS verification.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white-gradient">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
