
import React, { useState } from 'react';
import { Settings2, Utensils, Bus, Home, ShoppingBag, Gamepad2, Briefcase, HelpCircle, PiggyBank, Check, PlusCircle } from 'lucide-react';
import { Transaction, TransactionType, Language } from '../types';
import { translations } from '../utils/i18n';

interface FinanceProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  lang: Language;
}

const Finance: React.FC<FinanceProps> = ({ transactions, setTransactions, lang }) => {
  const t = translations[lang].finance;
  
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        type,
        category,
        description: desc || category, // Default description to category name if empty
        date: Date.now(),
    };
    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDesc('');
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: lang === 'zh' ? 'CNY' : 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getCategoryIcon = (cat: string, size: number = 20) => {
      const props = { size, className: "text-white" };
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

  const categoryList = Object.keys(t.categories);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Budget Card */}
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

      {/* Add Transaction Form */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
             <PlusCircle size={20} className="text-blue-500"/>
             {t.add_new}
          </h3>
          
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setType('expense')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500'}`}
              >
                  {t.types.expense}
              </button>
              <button 
                onClick={() => setType('income')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500'}`}
              >
                  {t.types.income}
              </button>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">
                    {lang === 'zh' ? '¥' : '$'}
                </span>
                <input 
                    type="number" 
                    placeholder="0.00"
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-white/50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl text-3xl font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300"
                    step="0.01"
                    required
                />
            </div>

            {/* Category Selection - Dynamic Grid */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block px-1">{t.labels.category}</label>
                <div className="flex flex-wrap gap-3">
                    {categoryList.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`flex items-center gap-2 p-2 pr-4 rounded-full border transition-all duration-200 active:scale-95 ${
                                category === cat 
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200 shadow-sm' 
                                : 'bg-white/40 border-transparent hover:bg-white/80'
                            }`}
                        >
                            <div className={`transform transition-transform duration-200 ${category === cat ? 'scale-110' : 'scale-100'}`}>
                                {getCategoryIcon(cat, 16)}
                            </div>
                            <span className={`text-sm font-medium ${category === cat ? 'text-blue-700' : 'text-slate-600'}`}>
                                {getCategoryLabel(cat)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Description Input */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block px-1">{t.labels.desc}</label>
                <input 
                    type="text" 
                    placeholder={category ? `${t.categories[category as keyof typeof t.categories]}...` : "..."}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full p-4 glass-input rounded-2xl text-sm outline-none text-slate-700"
                />
            </div>

            <button 
                type="submit" 
                disabled={!amount}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-base hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Check size={20} />
                {t.save_btn}
            </button>
        </form>
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
