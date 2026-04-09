'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  CreditCard, 
  Cpu, 
  LogOut, 
  ChevronRight,
  CheckCircle2,
  Lock,
  Eye,
  Globe
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { name: 'Profile', icon: <User className="w-5 h-5" /> },
    { name: 'Security', icon: <Shield className="w-5 h-5" /> },
    { name: 'Banks', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'AI Preferences', icon: <Cpu className="w-5 h-5" /> },
    { name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <PageWrapper showFooter={false}>
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] pb-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-poppins font-bold text-3xl text-slate-900 mb-1">Settings</h1>
            <p className="text-slate-500 text-sm">Manage your account, security, and AI co-pilot preferences.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === tab.name ? 'bg-aura-primary text-slate-900 shadow-md shadow-aura-primary/20' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span className="font-bold text-sm">{tab.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.name ? 'rotate-90' : ''}`} />
              </button>
            ))}
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-8">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Log Out</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="aura-card bg-white p-8 md:p-10">
              {activeTab === 'Profile' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-50">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-aura-primary/20 flex items-center justify-center text-aura-primary font-poppins font-bold text-3xl border-4 border-white shadow-sm">
                        SK
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm hover:text-aura-primary transition-colors">
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">Snehan S K</h2>
                      <p className="text-slate-500 text-sm mb-4">snehansk.007@gmail.com</p>
                      <button className="aura-button-secondary !py-2 !px-4 !text-xs">Change Avatar</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                      <input type="text" defaultValue="Snehan S K" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="text" defaultValue="Bengaluru, India" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="aura-button-primary px-8">Save Changes</button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Security' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
                      <p className="text-slate-500 text-sm">Protect your account and financial data.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', active: true },
                      { title: 'Biometric Login', desc: 'Use FaceID or Fingerprint to unlock the app.', active: true },
                      { title: 'Login Notifications', desc: 'Get alerted whenever someone logs into your account.', active: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <button className={`w-12 h-6 rounded-full transition-all relative ${item.active ? 'bg-aura-primary' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Password</h3>
                      <button className="aura-button-secondary !py-2 !px-4 !text-xs">Change Password</button>
                    </div>
                    <Link 
                      href="/contact" 
                      className="text-sm font-bold text-blue-500 hover:text-blue-600 flex items-center gap-2 group transition-colors"
                    >
                      <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Contact Security Team
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Banks' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Connected Banks</h2>
                    <button className="aura-button-primary !py-2 !px-4 !text-xs">Add New Bank</button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'HDFC Bank', acc: '•••• 4291', balance: '₹8,42,000', color: 'bg-blue-800' },
                      { name: 'ICICI Bank', acc: '•••• 8823', balance: '₹4,03,600', color: 'bg-orange-600' },
                    ].map((bank, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${bank.color} rounded-xl flex items-center justify-center text-white font-bold text-xs`}>
                            {bank.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{bank.name}</p>
                            <p className="text-xs text-slate-500">{bank.acc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{bank.balance}</p>
                          <button className="text-[10px] font-bold text-red-500 hover:underline">Disconnect</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'AI Preferences' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-aura-primary/10 flex items-center justify-center text-aura-primary">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">AI Co-pilot Preferences</h2>
                      <p className="text-slate-500 text-sm">Customize how your agentic financial assistant works.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Profile</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Conservative', 'Moderate', 'Aggressive'].map((risk) => (
                          <button 
                            key={risk}
                            className={`py-3 rounded-2xl text-sm font-bold border transition-all ${risk === 'Moderate' ? 'bg-aura-primary border-aura-primary text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                          >
                            {risk}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-aura-primary/5 rounded-3xl border border-aura-primary/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-900">Auto-Invest Threshold</p>
                        <span className="text-aura-primary font-bold">₹50,000</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-6">AI will suggest investments when your idle balance exceeds this amount.</p>
                      <input type="range" className="w-full accent-aura-primary" />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">Smart Sentinel</p>
                        <p className="text-xs text-slate-500">Allow AI to continuously monitor for idle cash.</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-aura-primary relative">
                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
