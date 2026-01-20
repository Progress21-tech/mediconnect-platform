"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Baby, Heart, ChevronRight, Zap, 
  HeartPulse, Pill, UserCircle, Brain, LogOut, Menu
} from 'lucide-react';

export default function AITriageDashboard() {
  const router = useRouter();
  
  // --- STATE ---
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

  const [patients, setPatients] = useState([
    { id: '1', full_name: 'Chiamaka Adebayo', age: 28, gender: 'Female', risk: 'High', bp: '150/95', temp: '37.2', ai_suggestion: 'Preeclampsia risk detected. Recommend immediate urinalysis.' },
    { id: '2', full_name: 'Musa Ibrahim', age: 54, gender: 'Male', risk: 'Stable', bp: '130/85', temp: '36.8', ai_suggestion: 'Routine hypertension follow-up.' }
  ]);

  // --- LOGIC ---
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'symptoms') runInstantAI(value, specialty);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Please enter patient name");
    setIsSaving(true);
    setTimeout(() => {
      const newPatient = {
        id: Math.random().toString(),
        full_name: formData.name,
        age: 25,
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

  const handleLogout = () => router.push('/login');

  return (
    // MAIN WRAPPER: On Desktop it is h-screen (fixed). On Mobile it is min-h-screen (scrollable).
    <div className="flex flex-col lg:h-screen min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* --- HEADER --- */}
      {/* We use shrink-0 to prevent the header from squashing on small screens */}
      <header className="h-auto lg:h-20 bg-white border-b flex flex-col lg:flex-row items-center justify-between px-4 lg:px-8 py-4 lg:py-0 z-20 shrink-0 gap-4">
        
        {/* SEARCH BAR */}
        <div className="relative w-full lg:w-96 order-2 lg:order-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search Database..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 rounded-xl border-none text-sm font-bold outline-none" 
          />
        </div>

        {/* SPECIALTY SWITCHER - CENTERED */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 order-1 lg:order-2 w-full lg:w-auto justify-center">
           <button 
             onClick={() => setSpecialty('maternal')}
             className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${specialty === 'maternal' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>
             <Baby size={14} /> <span className="hidden sm:inline">Maternal</span>
           </button>
           <button 
             onClick={() => setSpecialty('chronic')}
             className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${specialty === 'chronic' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400'}`}>
             <Heart size={14} /> <span className="hidden sm:inline">Chronic</span>
           </button>
        </div>

        {/* PROFILE AREA - RIGHT */}
        <div className="flex items-center gap-4 lg:gap-6 order-3 w-full lg:w-auto justify-end">
          <Link href="/triage" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl font-black text-xs uppercase transition-all">
            <Brain size={16} /> <span className="hidden sm:inline">AI Triage</span>
          </Link>
          
          <div className="flex items-center gap-3 border-slate-100 lg:border-l lg:pl-6">
            {/* Hide Name on Mobile to prevent overlap */}
            <div className="text-right hidden lg:block">
              <p className="text-sm font-black text-slate-800 uppercase">Nurse Chima</p>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Triage Unit</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">C</div>
          </div>
          
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* --- BODY CONTENT --- */}
      {/* On Desktop, this takes remaining height and doesn't scroll parent. On Mobile, it flows naturally. */}
      <main className="flex-1 p-4 lg:p-8 bg-slate-50/50 overflow-hidden">
        
        {/* THE BRIDGE: Desktop = Row (Side-by-Side). Mobile = Col (Stacked). */}
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          
          {/* --- LEFT COLUMN: FORM & QUEUE --- */}
          {/* On Desktop, this has a scrollbar if the list is long. */}
          <div className="w-full lg:w-96 flex flex-col gap-6 lg:overflow-y-auto lg:h-full pr-0 lg:pr-2 pb-10 lg:pb-0">
            
            {/* TRIAGE FORM */}
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

          {/* --- RIGHT COLUMN: DETAILED WORKSPACE --- */}
          {/* Desktop: Takes full height. Mobile: Min Height 500px so it shows. */}
          <div className="flex-1 bg-white rounded-[2rem] lg:rounded-[3.5rem] border border-slate-100 shadow-2xl flex flex-col lg:overflow-hidden min-h-[500px]">
            {selectedPatient ? (
              <>
                <div className="p-6 lg:p-8 border-b bg-slate-50/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase">{selectedPatient.full_name}</h2>
                         {specialty === 'maternal' ? <Baby className="text-pink-500" /> : <Heart className="text-orange-500" />}
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitals Logged: Just now</p>
                   </div>
                   <button className="w-full lg:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl">Complete Encounter</button>
                </div>

                <div className="p-6 lg:p-10 flex-1 lg:overflow-y-auto space-y-8">
                  {/* AI SCRIBE MODULE */}
                  <div className="bg-slate-900 p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] text-white flex flex-col lg:flex-row items-start gap-8 relative shadow-2xl overflow-hidden group">
                    <div className="bg-blue-600 p-4 rounded-2xl shadow-lg relative z-10 shrink-0">
                      <Zap size={32} className={isRecording ? 'animate-pulse' : ''} fill="white" />
                    </div>
                    <div className="relative z-10 flex-1 w-full">
                      <h3 className="text-[10px] font-black uppercase text-blue-400 mb-3 tracking-[0.3em]">AI Clinical Scribe</h3>
                      <p className="text-xl lg:text-2xl font-black leading-tight italic text-blue-50">"{selectedPatient.ai_suggestion}"</p>
                      <div className="flex flex-wrap gap-4 mt-6">
                         <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Apply to Plan</button>
                         <button onClick={() => setIsRecording(!isRecording)} className="bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest">
                           {isRecording ? 'Listening...' : 'Record Notes'}
                         </button>
                      </div>
                    </div>
                    {/* Hidden on mobile to prevent overflow, shown on desktop */}
                    <Zap className="hidden lg:block absolute -right-10 -bottom-10 text-blue-500 opacity-10" size={240} />
                  </div>

                  {/* VITALS & PLAN GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                    <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                         <HeartPulse size={16} className="text-red-500" /> Triage History
                       </h4>
                       <div className="space-y-4 font-black italic">
                          <div className="flex justify-between border-b pb-2"><span>BP</span><span className="text-xl">{selectedPatient.bp}</span></div>
                          <div className="flex justify-between border-b pb-2"><span>Temp</span><span className="text-xl">{selectedPatient.temp}°C</span></div>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                         <Pill size={16} className="text-orange-500" /> Specialist Plan
                       </h4>
                       <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm mb-4">
                          <span className="font-bold text-xs uppercase italic">ANC Supplement Packet</span>
                          <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">PHARMACY</span>
                       </div>
                       <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase italic text-slate-400">Add Lab Order</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-10 p-10 text-center">
                  <UserCircle size={100} strokeWidth={1} />
                  <p className="font-black uppercase tracking-[0.2em] mt-4">Select Patient to View Details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}