'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  Cpu, 
  CheckCircle2,
  AlertCircle,
  Wallet
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aura-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-aura-secondary/5 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aura-primary/10 border border-aura-primary/20 text-aura-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-3 h-3" />
            Agentic Financial Co-pilot
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-poppins font-bold text-5xl md:text-7xl lg:text-8xl text-slate-900 leading-[1.1] tracking-tight mb-8"
          >
            Turn Your Idle Money <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aura-primary to-aura-secondary">
              into Active Wealth
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl leading-relaxed mb-12"
          >
            Stop letting inflation eat your savings. AuraCash uses agentic AI to monitor, 
            strategize, and execute smart investments automatically.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup" className="aura-button-primary px-10 py-4 text-lg flex items-center gap-2 group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="aura-button-secondary px-10 py-4 text-lg">
              How it Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants as any}
            >
              <motion.div variants={itemVariants as any} className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="text-red-500 w-6 h-6" />
              </motion.div>
              <motion.h2 variants={itemVariants as any} className="font-poppins font-bold text-4xl text-slate-900 mb-6">
                The ₹160 Lakh Crore Problem
              </motion.h2>
              <motion.p variants={itemVariants as any} className="text-slate-600 text-lg leading-relaxed mb-8">
                Currently, over ₹160 Lakh Crore lies idle in Indian savings accounts, earning 
                minimal interest while inflation erodes its value by 6-7% every year.
              </motion.p>
              <motion.div variants={itemVariants as any} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-slate-600 font-medium">Inflation is silent wealth destruction.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-slate-600 font-medium">Complex investment jargon keeps people away.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-slate-600 font-medium">Manual tracking is tedious and error-prone.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="aura-card p-8 bg-white relative z-10 overflow-hidden">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Savings Impact</p>
                    <h3 className="text-2xl font-bold text-slate-900">Wealth Erosion</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-bold text-xl">-₹42,000</p>
                    <p className="text-slate-400 text-xs">Annual Loss to Inflation</p>
                  </div>
                </div>
                <div className="h-48 flex items-end gap-2">
                  {[40, 60, 45, 70, 55, 85, 30].map((h, i) => (
                    <div key={i} className="flex-grow bg-slate-100 rounded-t-lg relative group">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="absolute bottom-0 left-0 w-full bg-red-400/20 rounded-t-lg group-hover:bg-red-400/40 transition-colors" 
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-700 text-sm font-medium">
                    Your ₹10,00,000 today will be worth only ₹9,40,000 next year.
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-aura-primary/20 rounded-full blur-2xl -z-0" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-aura-secondary/20 rounded-full blur-3xl -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-poppins font-bold text-4xl text-slate-900 mb-6">
              Smart Features for Smart Wealth
            </h2>
            <p className="text-slate-500 text-lg">
              AuraCash simplifies your financial life by bringing everything under one 
              intelligent roof.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layers className="text-blue-500" />,
                title: "Unified Bank View",
                desc: "Connect all your bank accounts and see your total net worth in one beautiful dashboard."
              },
              {
                icon: <Cpu className="text-aura-primary" />,
                title: "AI Smart Suggestions",
                desc: "Our agentic AI analyzes your spending patterns and suggests optimal investment amounts."
              },
              {
                icon: <Zap className="text-orange-500" />,
                title: "One-Tap Investment",
                desc: "Invest your idle surplus with a single tap using our revolutionary A2UI technology."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="aura-card p-10 hover:-translate-y-2 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8">
                  {feature.icon}
                </div>
                <h3 className="font-poppins font-bold text-xl text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-aura-primary/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-poppins font-bold text-4xl mb-6">
              The Agentic Workflow
            </h2>
            <p className="text-slate-400 text-lg">
              AuraCash operates through a sophisticated three-stage process to ensure 
              your money is always working for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent -translate-y-1/2 z-0" />
            
            {[
              {
                step: "01",
                name: "Sentinel",
                role: "The Monitor",
                desc: "Continuously monitors your bank balances and identifies idle surplus in real-time.",
                icon: <ShieldCheck className="w-8 h-8" />
              },
              {
                step: "02",
                name: "Strategist",
                role: "The Brain",
                desc: "Analyzes market conditions and your risk profile to create the perfect investment plan.",
                icon: <BarChart3 className="w-8 h-8" />
              },
              {
                step: "03",
                name: "Executor",
                role: "The Action",
                desc: "Handles the movement of funds securely with one-tap confirmation from you.",
                icon: <Zap className="w-8 h-8" />
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-8 group hover:border-aura-primary transition-colors">
                  <div className="text-aura-primary group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>
                <span className="text-aura-primary font-mono text-sm font-bold mb-2">{step.step}</span>
                <h3 className="font-poppins font-bold text-2xl mb-1">{step.name}</h3>
                <p className="text-aura-secondary text-sm font-bold uppercase tracking-widest mb-4">{step.role}</p>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="aura-card p-8 bg-aura-primary/5 border-aura-primary/10">
                  <h4 className="text-4xl font-bold text-aura-primary mb-2">~7%</h4>
                  <p className="text-slate-600 text-sm font-medium">Average Returns</p>
                </div>
                <div className="aura-card p-8 bg-blue-50 border-blue-100">
                  <h4 className="text-4xl font-bold text-blue-500 mb-2">100%</h4>
                  <p className="text-slate-600 text-sm font-medium">Automated</p>
                </div>
                <div className="aura-card p-8 bg-slate-50 border-slate-100 col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <ShieldCheck className="text-aura-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Bank-Grade Safety</h4>
                      <p className="text-slate-500 text-sm">AES-256 Encryption & OAuth 2.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div>
              <h2 className="font-poppins font-bold text-4xl text-slate-900 mb-6">
                Why AuraCash?
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                We don&apos;t just show you data; we give you the tools to act on it. 
                Experience the future of personal finance.
              </p>
              <ul className="space-y-6">
                {[
                  "Beat inflation with higher returns on idle cash.",
                  "Zero manual effort with agentic automation.",
                  "Secure connection to 15+ major Indian banks.",
                  "Personalized AI strategies based on your goals."
                ].map((benefit, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-aura-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-aura-primary w-4 h-4" />
                    </div>
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto aura-card bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-aura-primary/10 to-transparent pointer-events-none" />
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8 relative z-10">
            Ready to make your <br /> money work?
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto relative z-10">
            Join thousands of smart investors who are already using AuraCash to 
            optimize their wealth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/signup" className="aura-button-primary px-12 py-4 text-lg">
              Get Started Now
            </Link>
            <Link href="/contact" className="text-white font-semibold hover:text-aura-primary transition-colors">
              Talk to an Expert
            </Link>
          </div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
