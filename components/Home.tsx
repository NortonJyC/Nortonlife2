
import React, { useState } from 'react';
import { Plus, Zap, CheckCircle2, Pencil, Check, X, ArrowRight } from 'lucide-react';
import { Task, Transaction, View, Language, GreetingData } from '../types';
import { translations } from '../utils/i18n';

interface HomeProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setView: (view: View) => void;
  lang: Language;
  greeting: GreetingData;
  setGreeting: React.Dispatch<React.SetStateAction<GreetingData>>;
}

const Home: React.FC<HomeProps> = ({ tasks, setTasks, transactions, setTransactions, setView, lang, greeting, setGreeting }) => {
  const t = translations[lang].home;
  const [quickTask, setQuickTask] = useState('');
  
  // Manual Quick Finance States
  const [qAmount, setQAmount] = useState('');
  const [qDesc, setQDesc] = useState('');
  const [qCategory, setQCategory] = useState('Other');
  
  // Editing State
  const [isEditingGreeting, setIsEditingGreeting] = useState(false);
  const [tempGreeting, setTempGreeting] = useState(greeting);

  const todayKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const todayTasks = tasks.filter(t => t.date === todayKey);
  const pendingTasks = todayTasks.filter(t => !t.completed).length;

  const handleQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: quickTask,
      completed: false,
      period: 'day',
      priority: 'medium',
      date: todayKey,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setQuickTask('');
  };

  const handleQuickFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qAmount || !qDesc) {
        alert(t.fill_alert);
        return;
    }
    
    const newTrans: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(qAmount),
        type: 'expense', // Default to expense for quick add
        category: qCategory,
        description: qDesc,
        date: Date.now(),
    };
    setTransactions([newTrans, ...transactions]);
    setQAmount('');
    setQDesc('');
  };

  const saveGreeting = () => {
      setGreeting(tempGreeting);
      setIsEditingGreeting(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Editable Greeting Section - Compact */}
      <div className="text-center py-4 sm:py-6 relative group">
         {isEditingGreeting ? (
             <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-200">
                 <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={tempGreeting.emoji}
                        onChange={(e) => setTempGreeting({...tempGreeting, emoji: e.target.value})}
                        className="w-16 text-center text-3xl p-2 rounded-xl glass-input outline-none"
                        placeholder="Emoji"
                    />
                    <input 
                        type="text" 
                        value={tempGreeting.text}
                        onChange={(e) => setTempGreeting({...tempGreeting, text: e.target.value})}
                        className="w-64 sm:w-80 text-center text-lg font-bold p-2 rounded-xl glass-input outline-none text-slate-800"
                        placeholder="Your motto..."
                        autoFocus
                    />
                 </div>
                 <div className="flex gap-2 mt-2">
                     <button onClick={saveGreeting} className="p-1.5 bg-emerald-500 text-white rounded-full hover:scale-110 transition-transform"><Check size={16}/></button>
                     <button onClick={() => setIsEditingGreeting(false)} className="p-1.5 bg-slate-400 text-white rounded-full hover:scale-110 transition-transform"><X size={16}/></button>
                 </div>
             </div>
         ) : (
             <div className="cursor-pointer" onClick={() => { setTempGreeting(greeting); setIsEditingGreeting(true); }}>
                <div className="text-3xl sm:text-4xl mb-2 animate-bounce hover:scale-110 transition-transform inline-block">{greeting.emoji}</div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2 hover:text-blue-600 transition-colors">
                    {greeting.text}
                    <Pencil size={14} className="opacity-0 group-hover:opacity-50 transition-opacity text-slate-400"/>
                </h1>
             </div>
         )}
         
         <p className="text-slate-500 text-sm">
             {t.pending_tasks} <span className="font-bold text-blue-600 mx-1 text-base">{pendingTasks}</span>
             <button onClick={() => setView('planner')} className="text-xs text-blue-500 underline ml-2 hover:text-blue-700 active:text-blue-800">
                 {t.view_details} &rarr;
             </button>
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Task Card */}
        <div className="glass-panel p-5 rounded-3xl border-l-4 border-l-blue-500 relative overflow-hidden group transition-all hover:shadow-lg hover:scale-[1.01]">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <CheckCircle2 size={60} className="text-blue-600"/>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Plus className="text-blue-500" size={18}/> {t.quick_task}
            </h3>
            <form onSubmit={handleQuickTask} className="flex flex-col gap-2 relative z-10">
                <input 
                    type="text" 
                    value={quickTask}
                    onChange={(e) => setQuickTask(e.target.value)}
                    placeholder={t.quick_task_ph}
                    className="glass-input p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                />
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
                        {t.add}
                    </button>
                </div>
            </form>
        </div>

        {/* Quick Finance Card (Manual) */}
        <div className="glass-panel p-5 rounded-3xl border-l-4 border-l-sky-500 relative overflow-hidden group transition-all hover:shadow-lg hover:scale-[1.01]">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Zap size={60} className="text-sky-600"/>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Zap className="text-sky-500" size={18}/> {t.quick_finance}
            </h3>
            <form onSubmit={handleQuickFinance} className="flex flex-col gap-2 relative z-10">
                <div className="flex gap-2">
                    <input 
                        type="number" 
                        value={qAmount}
                        onChange={(e) => setQAmount(e.target.value)}
                        placeholder={t.quick_amount_ph}
                        step="0.01"
                        className="glass-input p-3 rounded-xl w-1/3 outline-none focus:ring-2 focus:ring-sky-200 transition-all font-mono font-bold text-sm"
                    />
                    <input 
                        type="text" 
                        value={qDesc}
                        onChange={(e) => setQDesc(e.target.value)}
                        placeholder={t.quick_finance_ph}
                        className="glass-input p-3 rounded-xl w-2/3 outline-none focus:ring-2 focus:ring-sky-200 transition-all text-sm"
                    />
                </div>
                
                <div className="flex justify-between items-center">
                    <select 
                        value={qCategory}
                        onChange={(e) => setQCategory(e.target.value)}
                        className="text-xs text-slate-500 bg-transparent outline-none cursor-pointer hover:text-sky-600"
                    >
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                    </select>
                    <button 
                        type="submit" 
                        className="bg-sky-500 text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-sky-600 active:scale-95 transition-all shadow-lg shadow-sky-200 flex items-center gap-1"
                    >
                        {t.record} <ArrowRight size={14} />
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
