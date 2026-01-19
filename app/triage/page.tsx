"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Brain, Zap, Thermometer, 
  HeartPulse, User, PlusCircle, Loader2 
} from 'lucide-react';

export default function AITriage() {
  const router = useRouter();

  // 1. STATE MANAGEMENT
  const [specialty, setSpecialty] = useState('maternal'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    bp: '',
    temp: '',
    symptoms: ''
  });

  // 2. AI ANALYSIS LOGIC
  const triggerGrokAnalysis = async () => {
    // Only analyze if patient name and symptoms are entered
    if (formData.symptoms.length < 10 || formData.name.length < 2) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name,
          symptoms: formData.symptoms,
          specialty: specialty,
          temp: formData.temp,
          bp: formData.bp
        }),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      setAiSuggestion(data.suggestion);
    } catch (err) {
      console.error(err);
      setAiSuggestion("Connection error. Ensure your backend server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. AUTO-ANALYZE (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerGrokAnalysis();
    }, 1500); 
    return () => clearTimeout(timer);
  }, [formData.symptoms, formData.name, specialty]);

  // 4. EVENT HANDLERS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter patient name");
    
    setIsSaving(true);
    try {
      // Simulating database save
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      
      // Navigate to dashboard
      router.push('/dashboard'); 
    } catch (err) {
      alert("Error saving patient data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <Brain size={20} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">AI Triage</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* INPUT SECTION */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Patient Entry</h2>
            <p className="text-blue-500 font-bold text-xs uppercase tracking-widest">Lagos General - Clinical Stream</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-5 text-slate-300" size={20} />
              <input 
                name="name" value={formData.name} onChange={handleInputChange} required
                placeholder="Full Patient Name" 
                className="w-full pl-14 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm font-bold outline-none focus:ring-2 ring-blue-500 transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <HeartPulse className="absolute left-5 top-5 text-slate-300" size={20} />
                <input 
                  name="bp" value={formData.bp} onChange={handleInputChange}
                  placeholder="BP (120/80)" 
                  className="w-full pl-14 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm font-bold outline-none focus:ring-2 ring-blue-500 transition-all" 
                />
              </div>
              <div className="relative">
                <Thermometer className="absolute left-5 top-5 text-slate-300" size={20} />
                <input 
                  name="temp" value={formData.temp} onChange={handleInputChange}
                  placeholder="Temp (°C)" 
                  className="w-full pl-14 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm font-bold outline-none focus:ring-2 ring-blue-500 transition-all" 
                />
              </div>
            </div>

            <textarea 
              name="symptoms" value={formData.symptoms} onChange={handleInputChange}
              placeholder="Describe symptoms for AI analysis..." 
              className="w-full p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm font-bold outline-none focus:ring-2 ring-blue-500 h-48 resize-none italic"
            />
          </div>
        </div>

        {/* AI OUTPUT & ACTIONS */}
        <div className="space-y-6 flex flex-col justify-end">
          
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <h3 className="text-[10px] font-black uppercase text-blue-400 mb-6 tracking-widest">Hospital Ward</h3>
             <div className="flex gap-3">
               <button 
                 type="button" 
                 onClick={() => setSpecialty('maternal')}
                 className={`flex-1 py-5 rounded-2xl font-black uppercase italic text-xs transition-all ${specialty === 'maternal' ? 'bg-blue-600 shadow-lg scale-105' : 'bg-white/5 text-slate-500'}`}
               > Maternal </button>
               <button 
                 type="button" 
                 onClick={() => setSpecialty('chronic')}
                 className={`flex-1 py-5 rounded-2xl font-black uppercase italic text-xs transition-all ${specialty === 'chronic' ? 'bg-orange-600 shadow-lg scale-105' : 'bg-white/5 text-slate-500'}`}
               > Chronic </button>
             </div>
             <Zap className="absolute -right-8 -bottom-8 text-white opacity-5" size={180} />
          </div>

          <div className={`p-10 rounded-[3rem] border-2 transition-all duration-500 min-h-[220px] flex flex-col justify-center 
            ${isAnalyzing ? 'bg-blue-50 border-blue-100' : aiSuggestion ? 'bg-slate-900 text-white border-transparent shadow-2xl' : 'bg-slate-50 border-transparent'}`}>
            
            <div className="flex items-center gap-2 mb-4">
              {isAnalyzing ? <Loader2 size={20} className="text-blue-500 animate-spin" /> : <Zap size={20} className={aiSuggestion ? 'text-blue-400 animate-pulse' : 'text-slate-300'} />}
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                {isAnalyzing ? 'Analyzing Clinical Data...' : 'Mediconnect AI Intelligence'}
              </span>
            </div>

            <div className={`text-xl font-bold italic whitespace-pre-line ${isAnalyzing ? 'text-blue-700' : aiSuggestion ? 'text-white' : 'text-slate-300'}`}>
              {isAnalyzing ? "Processing symptoms..." : aiSuggestion || "Waiting for patient data..."}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className={`w-full py-8 rounded-[2.5rem] font-black uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4
              ${isSaving ? 'bg-green-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-slate-900 active:scale-95'}`}
          >
            {isSaving ? "Finalizing..." : "Send to Queue"}
            {!isSaving && <PlusCircle size={24} />}
          </button>
        </div>
      </form>
    </div>
  );
}