'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Brain, Activity, Wallet, AlertCircle, Layers } from 'lucide-react';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-text-main font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">AuraCash</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-primary hover:text-primary-dark transition-colors">Home</a>
            <a href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth?mode=login" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">
              Login
            </Link>
            <Link 
              href="/auth?mode=signup"
              className="bg-primary text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-white-gradient">
        {/* Subtle background blurs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary mb-8 uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              Agentic Financial Co-pilot
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Turn Your Idle Money <br/>
              <span className="text-gradient">into Active Wealth</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop letting inflation eat your savings. AuraCash uses agentic AI to monitor, strategize, and execute smart investments automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth?mode=signup" className="btn-primary w-full sm:w-auto">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary w-full sm:w-auto">
                How it Works
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-6">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                The ₹160 Lakh Crore Problem
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                Currently, over ₹160 Lakh Crore lies idle in Indian savings accounts, earning minimal interest while inflation erodes its value by 6-7% every year.
              </p>

              <ul className="space-y-4">
                {[
                  "Inflation is silent wealth destruction.",
                  "Complex investment jargon keeps people away.",
                  "Manual tracking is tedious and error-prone."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/5 rounded-full blur-[60px]" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Savings Impact</p>
                    <h3 className="text-2xl font-bold text-slate-900">Wealth Erosion</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">-₹42,000</p>
                    <p className="text-xs text-slate-400">Annual Loss to Inflation</p>
                  </div>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 mb-8">
                  {/* Mock Chart Bars */}
                  {[100, 95, 90, 85, 80, 75, 70].map((height, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-md relative group">
                      <div 
                        className="absolute bottom-0 w-full bg-red-100 rounded-t-md transition-all duration-500 group-hover:bg-red-200"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center">
                  Your ₹10,00,000 today will be worth only ₹9,40,000 next year.
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Smart Features Section */}
      <section className="py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Smart Features for Smart Wealth
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              AuraCash simplifies your financial life by bringing everything under one intelligent roof.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layers className="w-6 h-6 text-blue-500" />}
              iconBg="bg-blue-50"
              title="Unified Bank View"
              desc="Connect all your bank accounts and see your total net worth in one beautiful dashboard."
            />
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-primary" />}
              iconBg="bg-primary/10"
              title="AI Smart Suggestions"
              desc="Our agentic AI analyzes your spending patterns and suggests optimal investment amounts."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-orange-500" />}
              iconBg="bg-orange-50"
              title="One-Tap Investment"
              desc="Invest your idle surplus with a single tap using our revolutionary A2UI technology."
            />
          </div>
        </div>
      </section>

      {/* Agentic Workflow (Dark Section) */}
      <section id="how-it-works" className="py-32 bg-[var(--color-dark-bg)] text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              The Agentic Workflow
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              AuraCash operates through a sophisticated three-stage process to ensure your money is always working for you.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-slate-800" />

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              <WorkflowStep 
                num="01"
                title="Sentinel"
                subtitle="THE MONITOR"
                icon={<Shield className="w-8 h-8 text-primary" />}
                desc="Continuously monitors your bank balances and identifies idle surplus in real-time."
              />
              <WorkflowStep 
                num="02"
                title="Strategist"
                subtitle="THE BRAIN"
                icon={<Activity className="w-8 h-8 text-primary" />}
                desc="Analyzes market conditions and your risk profile to create the perfect investment plan."
              />
              <WorkflowStep 
                num="03"
                title="Executor"
                subtitle="THE ACTION"
                icon={<Zap className="w-8 h-8 text-primary" />}
                desc="Handles the movement of funds securely with one-tap confirmation from you."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[var(--color-dark-bg)] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.4%22/%3E%3C/svg%3E')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Ready to make your <br/> money work?
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
                Join thousands of smart investors who are already using AuraCash to optimize their wealth.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/auth" className="bg-primary text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-dark transition-colors w-full sm:w-auto">
                  Get Started Now
                </Link>
                <button className="text-white font-semibold hover:text-primary transition-colors">
                  Talk to an Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white text-center text-slate-500 text-sm">
        <p>© 2026 AuraCash. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, desc }: { icon: React.ReactNode, iconBg: string, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-8`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function WorkflowStep({ num, title, subtitle, icon, desc }: { num: string, title: string, subtitle: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="w-24 h-24 rounded-3xl bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-8 relative z-10 backdrop-blur-sm">
        {icon}
      </div>
      <div className="text-primary font-bold text-sm mb-2">{num}</div>
      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
      <div className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-4">{subtitle}</div>
      <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  );
}
