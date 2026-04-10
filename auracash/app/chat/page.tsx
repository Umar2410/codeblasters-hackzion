'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Bot, User, Sparkles, Loader2, IndianRupee, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planContextRaw = searchParams.get('context');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with context if available
  useEffect(() => {
    if (messages.length === 0) {
      let decodedContext = "";
      if (planContextRaw) {
        try {
          decodedContext = decodeURIComponent(planContextRaw);
        } catch (e) {
          decodedContext = planContextRaw;
        }
      }

      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: decodedContext 
            ? `Hello! I'm your Aura Agent. I've loaded your strategy: \n\n"${decodedContext}"\n\nHow would you like to refine this?`
            : "Hello! I'm your Aura Agent. How can I help you with your wealth management today?",
          timestamp: new Date(),
        }
      ]);
    }
  }, [planContextRaw]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Calling the Python Backend Proxy (which uses your exact 'requests' logic)
      const response = await fetch('http://127.0.0.1:8002/dashboard/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input
        }),
      });

      if (!response.ok) throw new Error('Backend connection failed');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || data.output || data.message || "I've processed your request. What's next?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the Aura Backend. Please ensure your FastAPI server is running on Port 8002.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0f1a] text-white font-sans antialiased overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-white/40 group-hover:text-[#00e699]" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00e699] to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,230,153,0.3)]">
              <Bot className="w-6 h-6 text-[#0b0f1a]" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#00e699]">Aura Intelligence</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e699] animate-pulse" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Verified Connection</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
            <ShieldCheck className="w-4 h-4 text-[#00e699]" />
            Direct Socket
          </div>
          <button 
            onClick={() => router.push('/dashboard/invested')}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-[#00e699]/10 border border-[#00e699]/20 text-[#00e699] text-[10px] font-black uppercase tracking-widest hover:bg-[#00e699] hover:text-[#0b0f1a] transition-all"
          >
            <IndianRupee className="w-4 h-4" />
            Portfolio
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,_rgba(0,230,153,0.02)_0%,_transparent_50%)]">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  m.role === 'user' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-[#00e699]/10 border-[#00e699]/20'
                }`}>
                  {m.role === 'user' ? <User className="w-5 h-5 text-white/40" /> : <Bot className="w-5 h-5 text-[#00e699]" />}
                </div>
                
                <div className={`max-w-[75%] p-6 rounded-[32px] text-base leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-white/5 text-white/90 border border-white/5 font-medium rounded-tr-none' 
                  : 'bg-white/[0.03] text-white border border-white/10 rounded-tl-none shadow-2xl backdrop-blur-sm'
                }`}>
                  {m.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>
                  ))}
                  <div className={`text-[9px] font-black uppercase tracking-widest mt-4 opacity-20 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-6 sm:p-10 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a] to-transparent">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00e699] to-emerald-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-center gap-3 bg-white/[0.04] border border-white/10 p-2 pl-6 rounded-[32px] backdrop-blur-3xl focus-within:border-[#00e699]/50 transition-all"
          >
            <Sparkles className="w-5 h-5 text-[#00e699]/40" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Refine this strategy..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-medium py-4 text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-14 h-14 rounded-full bg-[#00e699] flex items-center justify-center text-[#0b0f1a] hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:scale-100 shadow-[0_0_30px_rgba(0,230,153,0.4)]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 ml-0.5" />}
            </button>
          </form>
          <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mt-6">
            Aura Pulse • Global Prediction v4.8
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white/20 font-black tracking-widest uppercase">Initializing Agent...</div>}>
      <ChatContent />
    </Suspense>
  );
}
