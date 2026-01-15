"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Activity, Baby, Heart } from 'lucide-react';

export default function RegisterPatient() {
  const [formData, setFormData] = useState({
    full_name: '', age: '', category: 'general', lmp_date: '', chronic_type: ''
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('patients').insert([formData]);
    if (!error) window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
        <h1 className="text-2xl font-black italic tracking-tighter mb-8">ADMIT PATIENT</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl font-bold" 
            onChange={(e) => setFormData({...formData, full_name: e.target.value})} />

          {/* SPECIALTY SELECTOR - The "Pivot" UI */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" 
              onClick={() => setFormData({...formData, category: 'maternal'})}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.category === 'maternal' ? 'border-pink-500 bg-pink-50' : 'border-slate-100'}`}>
              <Baby className="text-pink-500" />
              <span className="text-[10px] font-black uppercase">Maternal</span>
            </button>
            <button type="button" 
              onClick={() => setFormData({...formData, category: 'chronic'})}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.category === 'chronic' ? 'border-orange-500 bg-orange-50' : 'border-slate-100'}`}>
              <Heart className="text-orange-500" />
              <span className="text-[10px] font-black uppercase">Chronic</span>
            </button>
          </div>

          {formData.category === 'maternal' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Last Menstrual Period (LMP)</label>
              <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1" 
                onChange={(e) => setFormData({...formData, lmp_date: e.target.value})} />
            </div>
          )}

          <button className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest shadow-xl">
            Register & Open File
          </button>
        </form>
      </div>
    </div>
  );
}