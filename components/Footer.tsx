import React from 'react';
import Link from 'next/link';
import { Wallet, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-aura-primary rounded-lg flex items-center justify-center">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="font-poppins font-bold text-lg tracking-tight text-slate-900">
              Aura<span className="text-aura-primary">Cash</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Agentic Financial Co-pilot turning your idle money into active wealth with AI-driven intelligence.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-aura-primary hover:border-aura-primary transition-all">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-aura-primary hover:border-aura-primary transition-all">
              <Linkedin className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-aura-primary hover:border-aura-primary transition-all">
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-poppins font-semibold text-slate-900 mb-6">Product</h4>
          <ul className="space-y-4">
            <li><Link href="/dashboard" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">Smart Dashboard</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">AI Insights</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">One-Tap Invest</Link></li>
            <li><Link href="#" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">Unified Bank View</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-poppins font-semibold text-slate-900 mb-6">Company</h4>
          <ul className="space-y-4">
            <li><Link href="/" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">Contact</Link></li>
            <li><Link href="/rules" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/rules" className="text-slate-500 text-sm hover:text-aura-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-poppins font-semibold text-slate-900 mb-6">Newsletter</h4>
          <p className="text-slate-500 text-sm mb-4">Get the latest financial insights delivered to your inbox.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary w-full"
            />
            <button className="bg-aura-primary text-white p-2 rounded-lg hover:bg-aura-accent transition-colors">
              <Wallet className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs">
          © {new Date().getFullYear()} AuraCash. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="#" className="text-slate-400 text-xs hover:text-slate-600">Security</Link>
          <Link href="#" className="text-slate-400 text-xs hover:text-slate-600">Compliance</Link>
          <Link href="#" className="text-slate-400 text-xs hover:text-slate-600">Status</Link>
        </div>
      </div>
    </footer>
  );
}
