'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/app/actions';
import { LogOut, Activity, Wallet, ArrowUpRight, ArrowDownRight, User as UserIcon, Mail, Smartphone, Building, RefreshCw } from 'lucide-react';
import type { User } from '@/lib/db';

const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, daily: 1.2, weekly: 3.4, monthly: -1.2, yearly: 15.4 },
  { symbol: 'MSFT', name: 'Microsoft', price: 420.55, daily: -0.5, weekly: 2.1, monthly: 5.6, yearly: 22.1 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 142.65, daily: 0.8, weekly: -1.1, monthly: 4.2, yearly: 18.7 },
  { symbol: 'AMZN', name: 'Amazon', price: 178.15, daily: 2.1, weekly: 4.5, monthly: 8.9, yearly: 35.2 },
  { symbol: 'TSLA', name: 'Tesla', price: 175.22, daily: -2.4, weekly: -5.6, monthly: -12.4, yearly: -2.1 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    const data = await getCurrentUser();
    if (data) {
      setUser(data);
    } else {
      window.location.href = '/auth?mode=login';
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchUser = () => {
      getCurrentUser().then(data => {
        if (data) {
          setUser(data);
        } else {
          window.location.href = '/auth?mode=login';
        }
        setLoading(false);
      });
    };

    fetchUser();

    // Live-refresh balance every 30s — picks up manual changes in Supabase table editor
    const interval = setInterval(fetchUser, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('currentUserEmail');
      window.location.href = '/'; // Hard redirect clears session cookies properly
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white-gradient text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <LoaderPulse />
          <span className="text-sm font-medium text-slate-400">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white-gradient text-text-main p-4 md:p-8 font-sans relative">
      <div className="absolute inset-0 noise-bg z-0" />
      
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center py-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-multicolor">AuraCash</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/profile')}
              className="p-2 rounded-full border border-slate-200 bg-white/50 hover:bg-white transition-all text-slate-600 shadow-sm"
              title="Profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/50 hover:bg-white transition-colors text-sm font-medium text-slate-700 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Quick Look */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-1 space-y-6"
          >
            <div className="limitless-card p-6 bg-white/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Your Profile</h3>
                  <p className="text-xs text-text-muted">Personal Details</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Email</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Mobile</p>
                    <p className="text-sm font-medium text-slate-900">{user.mobile || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Linked Bank</p>
                    <p className="text-sm font-medium text-slate-900">{user.bankDetails?.bankName || 'None'}</p>
                    {user.bankDetails && (
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {user.bankDetails.holderName} •••• {user.bankDetails.accountNumber.slice(-4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => router.push('/profile')}
                className="w-full mt-6 py-2 rounded-xl border border-slate-100 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors"
              >
                Manage Profile
              </button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Balance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="limitless-card p-8 bg-gradient-to-br from-white to-slate-50/50"
            >
              <div className="flex items-center justify-between gap-2 text-text-muted mb-4 text-sm uppercase tracking-wider font-medium">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-violet-500" />
                  <span>Total Balance</span>
                </div>
                <button
                  onClick={handleRefresh}
                  title="Refresh balance from Supabase"
                  className="p-1.5 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-500 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-multicolor mb-6">
                ₹{user.balance.toLocaleString('en-IN')}
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-sm font-medium">
                <Activity className="w-4 h-4 text-violet-500" />
                <span className="text-violet-700">Yielding ~7% in Liquid Funds</span>
              </div>
            </motion.div>

            {/* Market Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-medium text-multicolor-2">Market Overview</h3>
              </div>

              <div className="grid gap-3">
                {MOCK_STOCKS.map((stock, i) => (
                  <motion.div 
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="limitless-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white"
                  >
                    <div className="flex items-center gap-4 w-full md:w-48">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-medium text-sm border border-slate-200 shrink-0 text-slate-700">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{stock.symbol}</h4>
                        <p className="text-xs text-text-muted font-light">{stock.name}</p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-2 w-full">
                      <GrowthMetric label="1D" value={stock.daily} />
                      <GrowthMetric label="1W" value={stock.weekly} />
                      <GrowthMetric label="1M" value={stock.monthly} />
                      <GrowthMetric label="1Y" value={stock.yearly} />
                    </div>

                    <div className="text-right w-full md:w-24">
                      <p className="font-mono font-medium text-slate-900">${stock.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowthMetric({ label, value }: { label: string, value: number }) {
  const isPositive = value >= 0;
  return (
    <div className="flex flex-col items-center justify-center py-1">
      <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">{label}</span>
      <div className={`flex items-center gap-1 text-xs font-mono font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        <span>{Math.abs(value)}%</span>
      </div>
    </div>
  );
}

function LoaderPulse() {
  return (
    <div className="relative w-12 h-12">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-violet-400/20 rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-violet-500 rounded-full" />
      </div>
    </div>
  );
}
