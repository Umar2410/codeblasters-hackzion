'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/app/actions';
import { 
  ArrowLeft, User as UserIcon, Mail, Smartphone, Lock,
  Building, ShieldCheck, Calendar, Wallet, 
  ChevronRight, LogOut, Edit2, Loader2 
} from 'lucide-react';
import type { User } from '@/lib/db';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(data => {
      if (data) {
        setUser(data);
      } else {
        window.location.href = '/auth?mode=login';
      }
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white-gradient">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white-gradient text-slate-900 font-sans relative">
      <div className="absolute inset-0 noise-bg z-0" />
      
      <div className="max-w-3xl mx-auto p-4 md:p-8 relative z-10">
        {/* Navigation */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-500 font-light">Manage your personal information and security preferences.</p>
        </header>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="limitless-card p-8 bg-white/80">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
                  <p className="text-sm text-slate-500">Your identity on AuraCash</p>
                </div>
              </div>
              <button className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-6">
              <ProfileItem 
                icon={<Mail className="w-4 h-4" />}
                label="Email Address"
                value={user.email}
              />
              <ProfileItem 
                icon={<Smartphone className="w-4 h-4" />}
                label="Mobile Number"
                value={user.mobile || 'Not set'}
              />
              <ProfileItem 
                icon={<Calendar className="w-4 h-4" />}
                label="Member Since"
                value="April 2026"
              />
            </div>
          </section>

          {/* Bank Section */}
          <section className="limitless-card p-8 bg-white/80">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Linked Bank Account</h2>
                  <p className="text-sm text-slate-500">Primary account for investments</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">Change</button>
            </div>

            {user.bankDetails ? (
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.bankDetails.bankName}</p>
                    <p className="text-xs text-slate-500 mt-1">•••• {user.bankDetails.accountNumber.slice(-4)}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">{user.bankDetails.holderName}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm italic">
                No bank account linked yet.
              </div>
            )}
          </section>

          {/* Security & Actions */}
          <section className="space-y-4 pt-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white/50 hover:bg-white transition-all group">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border border-rose-100 bg-rose-50/30 text-rose-600 hover:bg-rose-50 transition-all group"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold">Sign Out of All Devices</span>
            </button>
          </section>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-xs text-slate-400">AuraCash SEC-V2-2026 • Secure Encryption Active</p>
        </footer>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 rounded-lg bg-slate-50 text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
