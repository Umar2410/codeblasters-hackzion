'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Twitter, Linkedin, Github, MessageSquare } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function ContactPage() {
  return (
    <PageWrapper>
      <div className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Info */}
            <div>
              <div className="mb-12">
                <h1 className="font-poppins font-bold text-4xl md:text-5xl text-slate-900 mb-6">Get in Touch</h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Have questions about AuraCash? Our team is here to help you navigate 
                  your financial journey.
                </p>
              </div>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-aura-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-aura-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-lg text-slate-900 mb-1">Email Us</h3>
                    <p className="text-slate-500">snehansk.007@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-lg text-slate-900 mb-1">Call Us</h3>
                    <p className="text-slate-500">+91 78069 98294</p>
                    <p className="text-slate-500">Mon-Fri, 9am - 6pm IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-lg text-slate-900 mb-1">Visit Us</h3>
                    <p className="text-slate-500">123 Tech Park, HSR Layout</p>
                    <p className="text-slate-500">Bengaluru, Karnataka 560102</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-aura-primary hover:border-aura-primary transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-aura-primary hover:border-aura-primary transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-aura-primary hover:border-aura-primary transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="aura-card p-8 md:p-12 bg-white"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-aura-primary/10 flex items-center justify-center">
                  <MessageSquare className="text-aura-primary w-5 h-5" />
                </div>
                <h2 className="font-poppins font-bold text-2xl text-slate-900">Send a Message</h2>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                  <textarea 
                    rows={5}
                    placeholder="How can we help you?" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-aura-primary/20 focus:border-aura-primary transition-all resize-none"
                  />
                </div>
                <button className="aura-button-primary w-full py-4 flex items-center justify-center gap-2 group text-lg">
                  Send Message
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
