'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, FileText, Eye, CheckCircle2 } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function RulesPage() {
  const sections = [
    {
      title: "Security Infrastructure",
      icon: <ShieldCheck className="text-aura-primary w-6 h-6" />,
      content: "AuraCash employs bank-grade security protocols to ensure your financial data is always protected. We use AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Our systems are regularly audited by third-party security firms."
    },
    {
      title: "Privacy Policy",
      icon: <Eye className="text-blue-500 w-6 h-6" />,
      content: "Your privacy is our top priority. We never sell your personal or financial data to third parties. We only access the information necessary to provide AI insights and execute your authorized investments. You have full control over your data and can disconnect your accounts at any time."
    },
    {
      title: "Terms of Service",
      icon: <FileText className="text-orange-500 w-6 h-6" />,
      content: "By using AuraCash, you agree to our terms of service. Our platform acts as an agentic co-pilot, providing suggestions based on your financial profile. While we strive for accuracy, financial decisions carry inherent risks, and users are responsible for final execution authorization."
    },
    {
      title: "Compliance & KYC",
      icon: <Lock className="text-slate-500 w-6 h-6" />,
      content: "AuraCash complies with all relevant financial regulations in India. We perform standard KYC (Know Your Customer) checks to prevent fraud and ensure a secure environment for all our users. We partner with SEBI-registered entities for all investment executions."
    }
  ];

  return (
    <PageWrapper>
      <div className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-slate-900 mb-6">Security & Trust</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We take your financial security seriously. Learn about the protocols and 
              policies that keep AuraCash safe and reliable.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="aura-card p-8 md:p-10 bg-white"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="font-poppins font-bold text-2xl text-slate-900 mb-4">{section.title}</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">{section.content}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((_, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-500">
                          <CheckCircle2 className="text-aura-primary w-4 h-4" />
                          <span>Verified Compliance Standard {i + j + 1}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-aura-primary/5 border border-aura-primary/10 rounded-3xl text-center">
            <h3 className="font-poppins font-bold text-xl text-slate-900 mb-4">Have questions about security?</h3>
            <p className="text-slate-600 mb-8">Our security team is available 24/7 to answer your concerns.</p>
            <Link 
              href="/contact" 
              className="aura-button-primary px-8 py-3 inline-flex items-center gap-2 group"
            >
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Contact Security Team
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
