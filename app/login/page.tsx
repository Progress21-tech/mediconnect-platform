"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">Medical Staff Portal</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <input 
            type="email" placeholder="Email Address"
            className="w-full p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password"
            className="w-full p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            {loading ? "Signing in..." : <><LogIn size={20}/> Login to EMR</>}
          </button>
        </form>
      </div>
    </div>
  );
}