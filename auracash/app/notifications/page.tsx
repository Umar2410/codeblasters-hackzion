'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const VAPID_PUBLIC_KEY = 'BHT0-NQcPD4AFD52Azo3KYRQ09WviCVXxU_bcq74edOmj8NQVpflNmGuRfPaU6k-UFT7rxua3rasQyWt7qxHefs';
const BACKEND_URL = 'http://127.0.0.1:8002';

interface Plan {
    id: string;
    plan: string;
    title: string;
    notification_status: string;
    user_response: string | null;
    created_at: string;
}

export default function NotificationsPage() {
    const [status, setStatus] = useState('Checking subscription status...');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const router = useRouter();

    // Load plans and set up Realtime listener
    useEffect(() => {
        const fetchPlans = async () => {
            const { data } = await supabase
                .from('initial_plan')
                .select('*')
                .order('id', { ascending: false })
                .limit(10);
            
            if (data) setPlans(data);
        };

        fetchPlans();

        // Realtime subscription for the dashboard
        const channel = supabase
            .channel('dashboard-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'initial_plan' },
                (payload) => {
                    console.log('Realtime update received:', payload);
                    if (payload.eventType === 'INSERT') {
                        setPlans(prev => [payload.new as Plan, ...prev].slice(0, 10));
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('New Plan Available', {
                                body: (payload.new as Plan).title || 'A new investment plan is ready for review.',
                            });
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        setPlans(prev => prev.map(p => p.id === payload.new.id ? (payload.new as Plan) : p));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Check existing subscription
    useEffect(() => {
        const checkExistingSub = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.getRegistration('/sw.js');
                if (registration) {
                    const subscription = await registration.pushManager.getSubscription();
                    if (subscription && Notification.permission === 'granted') {
                        setIsSubscribed(true);
                        setStatus('Notifications are active.');
                        return;
                    }
                }
            }
            setStatus('Ready to subscribe.');
        };
        checkExistingSub();
    }, []);

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async function subscribe() {
        try {
            if (!('serviceWorker' in navigator)) throw new Error('Service Workers not supported');

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') throw new Error('Permission denied');

            setStatus('Registering Service Worker...');
            await navigator.serviceWorker.register('/sw.js');
            const register = await navigator.serviceWorker.ready;

            setStatus('Checking for existing subscriptions...');
            const existingSub = await register.pushManager.getSubscription();
            if (existingSub) await existingSub.unsubscribe();

            setStatus('Subscribing to Push Server...');
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            setStatus('Sending signature to backend...');
            const response = await fetch(`${BACKEND_URL}/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'content-type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Server error: ${errorData.error || response.statusText}`);
            }

            setStatus('Successfully Subscribed!');
            setIsSubscribed(true);
        } catch (err: any) {
            setStatus('Error: ' + err.message);
        }
    }

    async function updateResponse(planId: string, response: string) {
        try {
            if (response === 'approve') {
                const plan = plans.find(p => p.id === planId);
                if (plan) {
                    const { investPlanStocks } = await import('@/app/actions');
                    await investPlanStocks(planId, plan.plan);
                    router.push('/dashboard/invested');
                }
            } else if (response === 'discuss') {
                const plan = plans.find(p => p.id === planId);
                if (plan) {
                    await supabase
                        .from('initial_plan')
                        .update({ user_response: 'discuss' })
                        .eq('id', planId);
                    
                    const encodedPlan = encodeURIComponent(plan.plan);
                    router.push(`/chat?planId=${planId}&context=${encodedPlan}`);
                }
            } else if (response === 'reject') {
                // Dimiss locally and update DB
                setPlans(prev => prev.filter(p => p.id !== planId));
                await supabase
                    .from('initial_plan')
                    .update({ user_response: 'reject' })
                    .eq('id', planId);
            } else {
                const { error } = await supabase
                    .from('initial_plan')
                    .update({ user_response: response })
                    .eq('id', planId);
                
                if (error) throw error;
            }
        } catch (err: any) {
            console.error('Error updating response:', err);
        }
    }

    async function forceReset() {
        try {
            setStatus('Resetting...');
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let r of registrations) await r.unregister();
            setIsSubscribed(false);
            await subscribe();
        } catch (err: any) {
            setStatus('Reset failed: ' + err.message);
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#0b0f1a] text-white p-6 font-sans overflow-y-auto selection:bg-[#00e699]/30 antialiased">
            <div className="max-w-2xl w-full space-y-12 py-12">
                
                {/* Hero Section */}
                <div className="relative p-10 rounded-[40px] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl border border-white/10 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e699]/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-[#00e699]/20" />
                    
                    <h1 className="text-5xl font-black tracking-tight text-white mb-4">
                        Aura<span className="text-[#00e699]">Cash</span> Pulse
                    </h1>
                    <p className="text-white/40 mb-10 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                        Intelligent investment approvals & real-time financial monitoring.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={subscribe}
                            disabled={isSubscribed}
                            className={`min-w-[220px] py-4 px-8 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 transform active:scale-95 ${
                                isSubscribed 
                                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed' 
                                : 'bg-[#00e699] text-[#0b0f1a] hover:shadow-[0_0_40px_rgba(0,230,153,0.3)] hover:-translate-y-1'
                            }`}
                        >
                            {isSubscribed ? 'RECEIVING ALERTS' : 'ACTIVATE PUSH ALERTS'}
                        </button>
                        <button
                            onClick={forceReset}
                            className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white/60 transition-colors"
                        >
                            Sync Reset
                        </button>
                    </div>
                </div>

                {/* Live Status Bar */}
                <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/5" />
                    <div className="py-2.5 px-6 rounded-full bg-white/[0.02] border border-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-3 backdrop-blur-md">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSubscribed ? 'bg-[#00e699] shadow-[0_0_12px_rgba(0,230,153,0.5)] animate-pulse' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`} />
                        {status}
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/5" />
                </div>

                {/* Dashboard Feed */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-bold text-white/90 tracking-tight">Strategy Feed</h2>
                        <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-[#00e699]/5 border border-[#00e699]/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e699] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e699]"></span>
                            </span>
                            <span className="text-[10px] text-[#00e699] font-black uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {plans.filter(p => p.user_response !== 'reject').length === 0 ? (
                        <div className="py-24 rounded-[40px] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-white/10 gap-4">
                            <span className="font-bold text-sm uppercase tracking-widest opacity-20">Queue Empty</span>
                        </div>
                    ) : (
                        plans
                            .filter(p => p.user_response !== 'reject')
                            .map((plan) => (
                            <div key={plan.id} className="group p-8 rounded-[38px] bg-white/[0.03] border border-white/10 hover:border-[#00e699]/30 transition-all duration-500 shadow-2xl hover:shadow-[#00e699]/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e699]/5 rounded-full blur-[60px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 relative z-10">
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-[#00e699] transition-colors duration-300">
                                            {plan.title || 'Strategy Alert'}
                                        </h3>
                                        <div className="flex items-center gap-2.5">
                                            <div className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                                                ID: {plan.id.substring(0, 4)}
                                            </div>
                                            <span className="text-[10px] font-bold text-white/30 truncate">
                                                {new Date(plan.created_at || Date.now()).toLocaleDateString()} at {new Date(plan.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${
                                        plan.user_response === 'approve' ? 'bg-[#00e699]/10 text-[#00e699] border-[#00e699]/20 shadow-[0_0_20px_rgba(0,230,153,0.1)]' :
                                        plan.user_response === 'reject' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
                                        plan.user_response === 'discuss' ? 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20' :
                                        'bg-white/5 text-white/30 border-white/10'
                                    }`}>
                                        {plan.user_response ? `Action: ${plan.user_response}` : 'Pending Review'}
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] rounded-[28px] p-7 mb-8 border border-white/5 relative group/content transition-colors hover:bg-white/[0.04]">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00e699] rounded-full opacity-20 group-hover/content:opacity-60 transition-opacity" />
                                    <p className="text-white/80 text-base leading-relaxed font-medium transition-colors group-hover/content:text-white">
                                        {plan.plan}
                                    </p>
                                </div>

                                {/* Dynamic Action Group */}
                                {(!plan.user_response || plan.user_response === "") ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button
                                            onClick={() => updateResponse(plan.id, 'approve')}
                                            className="flex items-center justify-center gap-3 py-4 rounded-[22px] bg-[#00e699]/5 border border-[#00e699]/20 text-[#00e699] hover:bg-[#00e699] hover:text-[#0b0f1a] transition-all duration-300 group/btn transform active:scale-95"
                                        >
                                            <span className="text-lg font-black opacity-50">1.</span>
                                            <span className="text-xs font-black uppercase tracking-widest">Approve</span>
                                            <span className="text-xl group-hover/btn:translate-x-1 transition-transform">✓</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => updateResponse(plan.id, 'discuss')}
                                            className="flex items-center justify-center gap-3 py-4 rounded-[22px] bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all duration-300 group/btn transform active:scale-95"
                                        >
                                            <span className="text-lg font-black opacity-50">2.</span>
                                            <span className="text-xs font-black uppercase tracking-widest">Discuss</span>
                                            <span className="text-xl group-hover/btn:scale-110 transition-transform">💬</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => updateResponse(plan.id, 'reject')}
                                            className="flex items-center justify-center gap-3 py-4 rounded-[22px] bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group/btn transform active:scale-95"
                                        >
                                            <span className="text-lg font-black opacity-50">3.</span>
                                            <span className="text-xs font-black uppercase tracking-widest">Reject</span>
                                            <span className="text-xl group-hover/btn:-translate-y-1 transition-transform">✕</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-4 px-6 rounded-[22px] bg-white/[0.02] border border-white/5">
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
                                            Executed via Aura Agent • {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
