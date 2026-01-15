"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Brain, 
  Zap, 
  Thermometer, 
  HeartPulse, 
  User, 
  PlusCircle 
} from 'lucide-react';

export default function AITriage() {
  // 1. STATE MANAGEMENT
  const [specialty, setSpecialty] = useState<'maternal' | 'chronic'>('maternal'); 
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    bp: '',
    temp: '',
    symptoms: ''
  });
// 1. Function to call your Python AI
const fetchMedGemmaInsight = async (text: string) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms: text,
        specialty: specialty // 'maternal' or 'chronic'
      }),
    });
    const data = await res.json();
    setAiSuggestion(data.suggestion);
  } catch (error) {
    console.error("Connection to Med-Gemma failed");
  }
};

// 2. Add a button or use a Debounced effect to trigger it
// Inside your Symptoms Textarea change handler:
const handleSymptomInput = (e: any) => {
    const text = e.target.value;
    setFormData({...formData, symptoms: text});
    
    // Trigger AI only after user stops typing for 1.5 seconds
    const timeoutId = setTimeout(() => fetchMedGemmaInsight(text), 1500);
    return () => clearTimeout(timeoutId);
}
  // 2. AI LOGIC: Instant Clinical Pattern Matching
  const runInstantAI = (text: string, currentSpecialty: string) => {
    const input = text.toLowerCase();
    
    if (currentSpecialty === 'maternal') {
      if (input.includes("headache") || input.includes("vision") || input.includes("blur")) {
        setAiSuggestion("AI ALERT: Possible Pre-eclampsia. Check BP immediately.");
      } else if (input.includes("bleeding") || input.includes("pain")) {
        setAiSuggestion("CRITICAL: Antepartum hemorrhage risk. Alert doctor.");
      } else if (input.includes("dizzy")) {
        setAiSuggestion("SUGGESTION: Potential Anemia. Check iron levels.");
      } else {
        setAiSuggestion("");
      }
    } else {
      // Chronic Logic
      if (input.includes("thirsty") || input.includes("urine")) {
        setAiSuggestion("SUGGESTION: High Glucose suspected. Order HbA1c test.");
      } else if (input.includes("chest") || input.includes("breath")) {
        setAiSuggestion("ALERT: Cardiac distress risk. Move to emergency.");
      } else if (input.includes("numb")) {
        setAiSuggestion("SUGGESTION: Peripheral Neuropathy check required.");
      } else {
        setAiSuggestion("");
      }
    }
  };

  // 3. EVENT HANDLERS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update State
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Trigger AI only for symptoms
    if (name === 'symptoms') {
      runInstantAI(value, specialty);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (!formData.name) return alert("Please enter patient name");

    setIsSaving(true);
    
    // Simulate Supabase/API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      alert(`Success: ${formData.name} added to ${specialty} queue.`);
      
      // Reset Form
      setFormData({ name: '', bp: '', temp: '', symptoms: '' });
      setAiSuggestion("");
    } catch (err) {
      alert("Error saving patient data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white p-6 md:p-12">
      
      {/* HEADER NAVIGATION */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <Brain size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">AI Triage</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT SIDE: PATIENT DATA INPUT */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-slate-900">Patient Entry</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Digital Vital Sign Collection</p>
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
              placeholder="Enter symptoms here... AI will analyze automatically." 
              className="w-full p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm font-bold outline-none focus:ring-2 ring-blue-500 h-48 transition-all resize-none"
            />
          </div>
        </div>

        {/* RIGHT SIDE: AI & CONTROL */}
        <div className="space-y-6 flex flex-col justify-end">
          
          {/* SPECIALTY TOGGLE: Crucial type="button" added */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase text-blue-400 mb-6 tracking-[0.3em]">Hospital Department</h3>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => { setSpecialty('maternal'); runInstantAI(formData.symptoms, 'maternal'); }}
                    className={`flex-1 py-5 rounded-2xl font-black uppercase italic text-xs transition-all ${specialty === 'maternal' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                  >
                    Maternal
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setSpecialty('chronic'); runInstantAI(formData.symptoms, 'chronic'); }}
                    className={`flex-1 py-5 rounded-2xl font-black uppercase italic text-xs transition-all ${specialty === 'chronic' ? 'bg-orange-600 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                  >
                    Chronic
                  </button>
                </div>
             </div>
             <Zap className="absolute -right-8 -bottom-8 text-white opacity-5" size={180} />
          </div>

          {/* AI SUGGESTION BOX */}
          <div className={`p-10 rounded-[3rem] border-2 transition-all duration-500 min-h-[180px] flex flex-col justify-center ${aiSuggestion ? 'bg-red-50 border-red-100 shadow-xl shadow-red-100' : 'bg-slate-50 border-transparent'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className={aiSuggestion ? 'text-red-500 animate-pulse' : 'text-slate-300'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${aiSuggestion ? 'text-red-500' : 'text-slate-400'}`}>
                {aiSuggestion ? 'Urgent AI Insight' : 'AI Analysis Engine'}
              </span>
            </div>
            <p className={`text-xl font-black italic tracking-tight leading-tight ${aiSuggestion ? 'text-red-700' : 'text-slate-300'}`}>
              {aiSuggestion || "Awaiting clinical data input..."}
            </p>
          </div>

          {/* MAIN SAVE BUTTON */}
          <button 
            type="submit"
            disabled={isSaving}
            className={`w-full py-8 rounded-[2.5rem] font-black uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4
              ${isSaving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95'}`}
          >
            {isSaving ? "Syncing to Cloud..." : "Finalize & Send to Queue"}
            {!isSaving && <PlusCircle size={24} />}
          </button>
        </div>

      </form>
    </div>
  );
}