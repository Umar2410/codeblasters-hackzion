'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export default function PageWrapper({ 
  children, 
  showNav = true, 
  showFooter = true 
}: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {showFooter && <Footer />}
    </div>
  );
}
