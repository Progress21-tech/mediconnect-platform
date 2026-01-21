"use client";
import React from 'react';
import { Activity, Zap, ShieldCheck, Clock, ArrowRight, Globe, WifiOff, Baby, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white text-slate-900 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer mb-2 sm:mb-0">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            <Activity size={24} />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Mediconnect</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block font-bold text-slate-500 hover:text-blue-600 transition">Login</Link>
          <Link href="/signup" className="bg-slate-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold text-sm sm:text-base hover:bg-blue-700 transition shadow-xl">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-black mb-6 sm:mb-8 tracking-widest uppercase"
        >
          <Zap size={14} fill="currentColor" />
          <span>The Future of Specialist Care</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 sm:mb-8 leading-snug sm:leading-[1.1] tracking-tight text-slate-900"
        >
          Predicts Risks, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Protects Lives.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-500 mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-medium"
        >
          The only AI-powered platform designed for the unique challenges of Nigerian <strong>Maternal and Chronic Care</strong>. Reduce complications, automate billing, and see more patients with zero typing.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup" className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-[0_20px_50px_rgba(37,_99,_235,_0.3)] hover:bg-blue-700 transition-all hover:-translate-y-1">
            Try AI Triage <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 text-slate-500 font-bold text-sm sm:text-base">
          <Badge icon={<ShieldCheck size={18} className="text-green-500"/>} text="NDPR Compliant" />
          <Badge icon={<WifiOff size={18} className="text-orange-500"/>} text="Offline Ready" />
          <Badge icon={<Globe size={18} className="text-blue-500"/>} text="Cloud Sync" />
        </div>
      </header>

      {/* SPECIALTY CARDS */}
      <section className="px-4 sm:px-6 py-10 max-w-6xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-50/50 p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-pink-100 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
               <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 sm:mb-0"><Baby className="text-pink-500" size={32}/></div>
               <div>
                  <h3 className="font-black text-lg sm:text-xl mb-1 sm:mb-2 text-pink-950 uppercase">Maternal Care</h3>
                  <p className="text-sm sm:text-base text-pink-800/70 font-medium">Predictive ANC tracking & early Pre-eclampsia detection.</p>
               </div>
            </div>
            <div className="bg-orange-50/50 p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-orange-100 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
               <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 sm:mb-0"><Heart className="text-orange-500" size={32}/></div>
               <div>
                  <h3 className="font-black text-lg sm:text-xl mb-1 sm:mb-2 text-orange-950 uppercase">Chronic Care</h3>
                  <p className="text-sm sm:text-base text-orange-800/70 font-medium">Long-term hypertension and diabetes trend monitoring.</p>
               </div>
            </div>
         </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <FeatureCard icon={<Clock size={28} />} title="1-Minute Triage" desc="Nurses enter data faster than paper. AI suggests clinical terms as you type." color="blue" />
          <FeatureCard icon={<Zap size={28} />} title="AI Suggestions" desc="Smart prompts assist nurses in real-time, flagging potential risks early." color="purple" />
          <FeatureCard icon={<ShieldCheck size={28} />} title="Secure Records" desc="Military-grade encryption compliant with Nigerian data laws." color="emerald" />
        </div>
      </section>
    </div>
  );
}

// Sub-components
function Badge({ icon, text }: any) {
  return (
    <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm border border-slate-100">
      {icon} <span>{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: any) {
  const colors: any = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600"
  };
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start gap-4">
      <div className={`${colors[color]} w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4`}>{icon}</div>
      <h3 className="font-bold text-lg sm:text-2xl mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
