
import React, { useState } from 'react';
import { Plus, Zap, CheckCircle2, Pencil, Check, X } from 'lucide-react';
import { Task, Transaction, View, Language, GreetingData } from '../types';
import { parseSmartTransaction } from '../services/geminiService';
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
  const [quickFinance, setQuickFinance] = useState('');
  const [isProcessingFinance, setIsProcessingFinance] = useState(false);
  
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

  const handleQuickFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFinance.trim()) return;
    
    setIsProcessingFinance(true);
    const result = await parseSmartTransaction(quickFinance, lang);
    setIsProcessingFinance(false);

    if (result) {
        const newTrans: Transaction = {
            id: Date.now().toString(),
            amount: result.amount,
            type: result.type,
            category: result.category,
            description: result.description,
            date: Date.now(),
        };
        setTransactions([newTrans, ...transactions]);
        setQuickFinance('');
        alert(`${t.record_success} ${result.description} ¥${result.amount}`);
    } else {
        alert(t.error_ai);
    }
  };

  const saveGreeting = () => {
      setGreeting(tempGreeting);
      setIsEditingGreeting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editable Greeting Section */}
      <div className="text-center py-8 relative group">
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
                        className="w-64 sm:w-80 text-center text-xl font-bold p-2 rounded-xl glass-input outline-none text-slate-800"
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
                <div className="text-4xl mb-3 animate-bounce hover:scale-110 transition-transform inline-block">{greeting.emoji}</div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2 hover:text-blue-600 transition-colors">
                    {greeting.text}
                    <Pencil size={16} className="opacity-0 group-hover:opacity-50 transition-opacity text-slate-400"/>
                </h1>
             </div>
         )}
         
         <p className="text-slate-500 mt-2">
             {t.pending_tasks} <span className="font-bold text-blue-600 mx-1 text-lg">{pendingTasks}</span>
             <button onClick={() => setView('planner')} className="text-sm text-blue-500 underline ml-2 hover:text-blue-700 active:text-blue-800">
                 {t.view_details} &rarr;
             </button>
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Task Card */}
        <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-blue-500 relative overflow-hidden group transition-all hover:shadow-lg hover:scale-[1.01]">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <CheckCircle2 size={80} className="text-blue-600"/>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="text-blue-500" size={20}/> {t.quick_task}
            </h3>
            <form onSubmit={handleQuickTask} className="flex flex-col gap-3 relative z-10">
                <input 
                    type="text" 
                    value={quickTask}
                    onChange={(e) => setQuickTask(e.target.value)}
                    placeholder={t.quick_task_ph}
                    className="glass-input p-4 rounded-2xl w-full outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
                        {t.add}
                    </button>
                </div>
            </form>
        </div>

        {/* Quick Finance Card */}
        <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-sky-500 relative overflow-hidden group transition-all hover:shadow-lg hover:scale-[1.01]">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Zap size={80} className="text-sky-600"/>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="text-sky-500" size={20}/> {t.quick_finance}
            </h3>
            <form onSubmit={handleQuickFinance} className="flex flex-col gap-3 relative z-10">
                <input 
                    type="text" 
                    value={quickFinance}
                    onChange={(e) => setQuickFinance(e.target.value)}
                    placeholder={t.quick_finance_ph}
                    disabled={isProcessingFinance}
                    className="glass-input p-4 rounded-2xl w-full outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                />
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isProcessingFinance}
                        className="bg-sky-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-sky-600 active:scale-95 transition-all shadow-lg shadow-sky-200 disabled:opacity-70"
                    >
                        {isProcessingFinance ? t.processing : t.record}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
