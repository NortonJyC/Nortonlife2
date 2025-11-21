
import React, { useState } from 'react';
import { Wand2, Loader2, Settings2, Utensils, Bus, Home, ShoppingBag, Gamepad2, Briefcase, HelpCircle, PiggyBank } from 'lucide-react';
import { Transaction, TransactionType, Language } from '../types';
import { parseSmartTransaction } from '../services/geminiService';
import { translations } from '../utils/i18n';

interface FinanceProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  lang: Language;
}

const Finance: React.FC<FinanceProps> = ({ transactions, setTransactions, lang }) => {
  const t = translations[lang].finance;
  const [isSmartMode, setIsSmartMode] = useState(true);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Budget State
  const [monthlyBudget, setMonthlyBudget] = useState(5000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Manual Form States
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Food');
  const [desc, setDesc] = useState('');

  // Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = transactions
    .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetProgress = Math.min((currentMonthExpenses / monthlyBudget) * 100, 100);

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    const result = await parseSmartTransaction(input, lang);
    setIsProcessing(false);

    if (result) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: result.amount,
        type: result.type as TransactionType,
        category: result.category,
        description: result.description,
        date: Date.now(),
      };
      setTransactions([newTransaction, ...transactions]);
      setInput('');
    } else {
      alert(translations[lang].home.error_ai);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;

    const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        type,
        category,
        description: desc,
        date: Date.now(),
    };
    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDesc('');
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: lang === 'zh' ? 'CNY' : 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getCategoryIcon = (cat: string) => {
      const props = { size: 20, className: "text-white" };
      switch(cat) {
          case 'Food': return <div className="bg-orange-400 p-2 rounded-full shadow-md shadow-orange-200"><Utensils {...props} /></div>;
          case 'Transport': return <div className="bg-blue-400 p-2 rounded-full shadow-md shadow-blue-200"><Bus {...props} /></div>;
          case 'Housing': return <div className="bg-indigo-400 p-2 rounded-full shadow-md shadow-indigo-200"><Home {...props} /></div>;
          case 'Shopping': return <div className="bg-pink-400 p-2 rounded-full shadow-md shadow-pink-200"><ShoppingBag {...props} /></div>;
          case 'Entertainment': return <div className="bg-purple-400 p-2 rounded-full shadow-md shadow-purple-200"><Gamepad2 {...props} /></div>;
          case 'Salary': return <div className="bg-emerald-400 p-2 rounded-full shadow-md shadow-emerald-200"><Briefcase {...props} /></div>;
          case 'Investment': return <div className="bg-teal-400 p-2 rounded-full shadow-md shadow-teal-200"><PiggyBank {...props} /></div>;
          default: return <div className="bg-slate-400 p-2 rounded-full shadow-md shadow-slate-200"><HelpCircle {...props} /></div>;
      }
  };

  const getCategoryLabel = (cat: string) => {
      return t.categories[cat as keyof typeof t.categories] || cat;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Budget Card - Glassmorphism Blue Gradient */}
      <div className="relative p-6 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/20 group transition-all hover:shadow-2xl hover:scale-[1.01]">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-800 z-0"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          {/* Glass texture overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] border border-white/10 rounded-3xl z-0"></div>

          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-1">{t.budget_title}</p>
                    {isEditingBudget ? (
                        <input 
                            type="number" 
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                            onBlur={() => setIsEditingBudget(false)}
                            autoFocus
                            className="text-3xl font-bold bg-transparent border-b border-blue-400 focus:border-white outline-none w-40"
                        />
                    ) : (
                        <div className="flex items-end gap-3">
                             <h2 className="text-4xl font-bold tracking-tight">{formatMoney(monthlyBudget)}</h2>
                             <button onClick={() => setIsEditingBudget(true)} className="mb-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all active:scale-95">
                                 <Settings2 size={14} />
                             </button>
                        </div>
                    )}
                </div>
                <div className="text-right bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5">
                    <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold mb-1">{t.spent}</p>
                    <p className="text-xl font-semibold text-white">{formatMoney(currentMonthExpenses)}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-blue-200 font-medium">
                    <span>{t.usage_rate} {Math.round(budgetProgress)}%</span>
                    <span>{t.remaining} {formatMoney(monthlyBudget - currentMonthExpenses)}</span>
                </div>
                <div className="h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <div 
                        className={`h-full rounded-full shadow-lg transition-all duration-1000 ${budgetProgress > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' : budgetProgress > 75 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'}`}
                        style={{ width: `${budgetProgress}%` }}
                    ></div>
                </div>
            </div>
          </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
             <Wand2 size={18} className="text-blue-500"/>
             {t.record_btn}
          </h3>
          <button
            onClick={() => setIsSmartMode(!isSmartMode)}
            className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-full transition-all active:scale-95"
          >
            {isSmartMode ? t.switch_manual : t.switch_smart}
          </button>
        </div>

        {isSmartMode ? (
          <form onSubmit={handleSmartSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.smart_ph}
                className="w-full pl-4 pr-24 py-4 rounded-2xl glass-input outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-200"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors disabled:bg-slate-400 shadow-lg active:scale-95"
              >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : t.record_btn}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                 <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="p-3 glass-input rounded-xl text-sm outline-none text-slate-700"
                 >
                     <option value="expense">{t.types.expense}</option>
                     <option value="income">{t.types.income}</option>
                 </select>
                 <input 
                    type="number" 
                    placeholder={t.labels.amount}
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-3 glass-input rounded-xl text-sm outline-none text-slate-700"
                    step="0.01"
                 />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 glass-input rounded-xl text-sm outline-none text-slate-700"
                >
                    {Object.keys(t.categories).map(key => (
                        <option key={key} value={key}>{t.categories[key as keyof typeof t.categories]}</option>
                    ))}
                </select>
                <input 
                    type="text" 
                    placeholder={t.labels.desc}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="p-3 glass-input rounded-xl text-sm outline-none text-slate-700"
                />
            </div>
            <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl text-sm font-medium hover:bg-slate-900 shadow-lg transition-all active:scale-[0.98]">
                {t.save_btn}
            </button>
          </form>
        )}
      </div>

      {/* List Section */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 px-1 text-sm uppercase tracking-wider opacity-70">{t.recent_transactions}</h3>
        {transactions.length === 0 && (
            <div className="text-center py-8 text-slate-400 glass-panel rounded-2xl border-dashed">
                <p>{t.no_transactions}</p>
            </div>
        )}
        {transactions.slice(0, 20).map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-4 glass-card rounded-2xl hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {getCategoryIcon(t.category)}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{getCategoryLabel(t.category)} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <span className={`font-bold font-mono text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
              {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finance;
