"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Baby, Heart, Plus, ChevronRight, Zap, 
  Mic, HeartPulse, Pill, UserCircle, ArrowLeft, Save, Brain, Thermometer, LogOut 
} from 'lucide-react';

export default function AITriageDashboard() {
  const router = useRouter();
  // 1. STATE MANAGEMENT
  const [specialty, setSpecialty] = useState<'maternal' | 'chronic'>('maternal');
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  
  const [formData, setFormData] = useState({
    name: '',
    bp: '',
    temp: '',
    symptoms: ''
  });

  // Mock Data for the Queue
  const [patients, setPatients] = useState([
    { id: '1', full_name: 'Chiamaka Adebayo', age: 28, gender: 'Female', risk: 'High', bp: '150/95', temp: '37.2', ai_suggestion: 'Preeclampsia risk detected. Recommend immediate urinalysis.' },
    { id: '2', full_name: 'Musa Ibrahim', age: 54, gender: 'Male', risk: 'Stable', bp: '130/85', temp: '36.8', ai_suggestion: 'Routine hypertension follow-up.' }
  ]);

  // 2. AI SUGGESTION LOGIC (Real-time as nurse types)
  const runInstantAI = (text: string, currentSpecialty: string) => {
    const input = text.toLowerCase();
    if (currentSpecialty === 'maternal') {
      if (input.includes("headache") || input.includes("vision")) {
        setAiSuggestion("AI ALERT: Possible Pre-eclampsia. Check BP and Proteinuria.");
      } else if (input.includes("bleeding")) {
        setAiSuggestion("CRITICAL: Antepartum hemorrhage risk. Alert Doctor.");
      } else { setAiSuggestion(""); }
    } else {
      if (input.includes("thirsty") || input.includes("urine")) {
        setAiSuggestion("SUGGESTION: Diabetic Ketoacidosis risk. Check Glucose.");
      } else { setAiSuggestion(""); }
    }
  };

  // 3. HANDLERS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'symptoms') runInstantAI(value, specialty);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Please enter patient name");
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newPatient = {
        id: Math.random().toString(),
        full_name: formData.name,
        age: 25, // Mock age
        gender: 'Female',
        risk: aiSuggestion.includes('ALERT') ? 'High' : 'Stable',
        bp: formData.bp,
        temp: formData.temp,
        ai_suggestion: aiSuggestion || "Routine Checkup"
      };
      setPatients([newPatient, ...patients]);
      setIsSaving(false);
      setFormData({ name: '', bp: '', temp: '', symptoms: '' });
      setAiSuggestion("");
      alert("Added to Queue!");
    }, 1000);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 z-10 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3 text-slate-300" size={18} />
            <input type="text" placeholder="Search Hospital Database..." className="w-full pl-12 pr-4 py-3 bg-slate-100/50 rounded-xl border-none text-sm font-bold outline-none" />
          </div>

          {/* SPECIALTY SWITCHER */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
             <button 
                onClick={() => setSpecialty('maternal')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${specialty === 'maternal' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>
                <Baby size={14} /> Maternal
             </button>
             <button 
                onClick={() => setSpecialty('chronic')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${specialty === 'chronic' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400'}`}>
                <Heart size={14} /> Chronic
             </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 uppercase ">Nurse Chima</p>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Triage Unit</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">C</div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl font-black text-xs uppercase transition-all">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-hidden p-8 bg-slate-50/50">
          <div className="flex gap-8 h-full">
            
            {/* LEFT: FORM & QUEUE */}
            <div className="w-96 flex flex-col gap-6 overflow-y-auto pr-2">
              
              {/* TRIAGE FORM CARD */}
              <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-4 shrink-0">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Quick Triage</h3>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Patient Name" className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                  <input name="bp" value={formData.bp} onChange={handleInputChange} placeholder="BP (120/80)" className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
                  <input name="temp" value={formData.temp} onChange={handleInputChange} placeholder="Temp (°C)" className="p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 ring-blue-500" />
                </div>
                <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Symptoms..." className="w-full p-4 bg-slate-50 rounded-2xl border-none text-sm font-bold h-24 outline-none focus:ring-2 ring-blue-500 resize-none" />
                
                {aiSuggestion && (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100 animate-pulse">
                    <p className="text-[10px] font-black text-red-600 uppercase mb-1 flex items-center gap-2"><Brain size={12}/> AI Insight</p>
                    <p className="text-xs font-bold text-red-800 italic">{aiSuggestion}</p>
                  </div>
                )}

                <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">
                  {isSaving ? "Saving..." : "Send to Doctor"}
                </button>
              </div>

              {/* QUEUE LIST */}
              <div className="space-y-3">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Waiting List</h2>
                {patients.map((p) => (
                  <div key={p.id} onClick={() => setSelectedPatient(p)} className={`p-5 rounded-[2rem] border transition-all cursor-pointer ${selectedPatient?.id === p.id ? 'bg-white border-blue-600 shadow-xl scale-105' : 'bg-white border-slate-100 opacity-70'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.risk === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{p.risk}</span>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                    <h4 className="font-black text-slate-800 uppercase text-sm">{p.full_name}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: DETAILED CLINICAL WORKSPACE */}
            <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl flex flex-col overflow-hidden">
              {selectedPatient ? (
                <>
                  <div className="p-8 border-b bg-slate-50/30 flex justify-between items-center">
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{selectedPatient.full_name}</h2>
                           {specialty === 'maternal' ? <Baby className="text-pink-500" /> : <Heart className="text-orange-500" />}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitals Logged: Just now</p>
                     </div>
                     <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl">Complete Encounter</button>
                  </div>

                  <div className="p-10 flex-1 overflow-y-auto space-y-8">
                    {/* AI SCRIBE MODULE */}
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex items-start gap-8 relative shadow-2xl overflow-hidden group">
                      <div className="bg-blue-600 p-4 rounded-2xl shadow-lg relative z-10">
                        <Zap size={32} className={isRecording ? 'animate-pulse' : ''} fill="white" />
                      </div>
                      <div className="relative z-10 flex-1">
                        <h3 className="text-[10px] font-black uppercase text-blue-400 mb-3 tracking-[0.3em]">AI Clinical Scribe</h3>
                        <p className="text-2xl font-black leading-tight italic text-blue-50">"{selectedPatient.ai_suggestion}"</p>
                        <div className="flex gap-4 mt-4">
                           <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Apply to Plan</button>
                           <button onClick={() => setIsRecording(!isRecording)} className="bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest">
                             {isRecording ? 'Listening...' : 'Record Notes'}
                           </button>
                        </div>
                      </div>
                      <Zap className="absolute -right-10 -bottom-10 text-blue-500 opacity-10" size={240} />
                    </div>

                    {/* VITALS & PLAN GRID */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                           <HeartPulse size={16} className="text-red-500" /> Triage History
                         </h4>
                         <div className="space-y-4 font-black italic">
                            <div className="flex justify-between border-b pb-2"><span>Blood Pressure</span><span className="text-xl">{selectedPatient.bp}</span></div>
                            <div className="flex justify-between border-b pb-2"><span>Temperature</span><span className="text-xl">{selectedPatient.temp}°C</span></div>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                           <Pill size={16} className="text-orange-500" /> Specialist Plan
                         </h4>
                         <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm mb-4">
                            <span className="font-bold text-sm uppercase italic">ANC Supplement Packet</span>
                            <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">PHARMACY</span>
                         </div>
                         <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase italic text-slate-400">Add Lab Order</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                    <UserCircle size={120} strokeWidth={1} />
                    <p className="font-black uppercase tracking-[0.2em] mt-4">Select Patient to View Details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}