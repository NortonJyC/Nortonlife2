
import React, { useState } from 'react';
import { Settings2, Utensils, Bus, Home, ShoppingBag, Gamepad2, Briefcase, HelpCircle, PiggyBank, Check, PlusCircle, Pencil, Trash2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Transaction, TransactionType, Language } from '../types';
import { translations } from '../utils/i18n';

interface FinanceProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  lang: Language;
  budget: string;
  setBudget: React.Dispatch<React.SetStateAction<string>>;
}

const Finance: React.FC<FinanceProps> = ({ transactions, setTransactions, lang, budget, setBudget }) => {
  const t = translations[lang].finance;
  const tc = translations[lang].common;
  
  // UI States
  const [isBudgetCollapsed, setIsBudgetCollapsed] = useState(true); // Default to collapsed to save space
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Manual Form States - Amount is string
  const [amountStr, setAmountStr] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Food');
  const [desc, setDesc] = useState('');

  // Editing Transaction State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculations
  const monthlyBudget = parseFloat(budget) || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = transactions
    .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetProgress = monthlyBudget > 0 ? Math.min((currentMonthExpenses / monthlyBudget) * 100, 100) : 100;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountStr);
    if (!val) return;

    if (editingId) {
        // Update existing
        setTransactions(transactions.map(t => t.id === editingId ? {
            ...t,
            amount: val,
            type,
            category,
            description: desc || category
        } : t));
        setEditingId(null);
    } else {
        // Create new
        const newTransaction: Transaction = {
            id: Date.now().toString(),
            amount: val,
            type,
            category,
            description: desc || category, // Default description to category name if empty
            date: Date.now(),
        };
        setTransactions([newTransaction, ...transactions]);
    }
    
    // Reset form
    setAmountStr('');
    setDesc('');
    setEditingId(null);
  };

  const startEdit = (t: Transaction) => {
      setEditingId(t.id);
      setAmountStr(t.amount.toString());
      setType(t.type);
      setCategory(t.category);
      setDesc(t.description);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
      setEditingId(null);
      setAmountStr('');
      setDesc('');
  };

  const deleteTransaction = (id: string) => {
      if(window.confirm(t.recent_transactions + ": " + tc.delete + "?")) {
          setTransactions(transactions.filter(t => t.id !== id));
          if (editingId === id) cancelEdit();
      }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: lang === 'zh' ? 'CNY' : 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const getCategoryIcon = (cat: string, size: number = 20) => {
      const props = { size, className: "text-white" };
      switch(cat) {
          case 'Food': return <div className="bg-orange-400 p-1.5 rounded-full shadow-md shadow-orange-200"><Utensils {...props} /></div>;
          case 'Transport': return <div className="bg-blue-400 p-1.5 rounded-full shadow-md shadow-blue-200"><Bus {...props} /></div>;
          case 'Housing': return <div className="bg-indigo-400 p-1.5 rounded-full shadow-md shadow-indigo-200"><Home {...props} /></div>;
          case 'Shopping': return <div className="bg-pink-400 p-1.5 rounded-full shadow-md shadow-pink-200"><ShoppingBag {...props} /></div>;
          case 'Entertainment': return <div className="bg-purple-400 p-1.5 rounded-full shadow-md shadow-purple-200"><Gamepad2 {...props} /></div>;
          case 'Salary': return <div className="bg-emerald-400 p-1.5 rounded-full shadow-md shadow-emerald-200"><Briefcase {...props} /></div>;
          case 'Investment': return <div className="bg-teal-400 p-1.5 rounded-full shadow-md shadow-teal-200"><PiggyBank {...props} /></div>;
          default: return <div className="bg-slate-400 p-1.5 rounded-full shadow-md shadow-slate-200"><HelpCircle {...props} /></div>;
      }
  };

  const getCategoryLabel = (cat: string) => {
      return t.categories[cat as keyof typeof t.categories] || cat;
  }

  const categoryList = Object.keys(t.categories);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-20">
      
      {/* Collapsible Budget Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-blue-900/10 group transition-all">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-800 z-0"></div>
          
          {/* Toggle Button */}
          <button 
            onClick={() => setIsBudgetCollapsed(!isBudgetCollapsed)}
            className="absolute top-3 right-3 z-20 p-1 bg-white/10 hover:bg-white/20 rounded-full text-white/80 transition-colors"
          >
              {isBudgetCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>

          {isBudgetCollapsed ? (
             // Collapsed View - Compact
             <div className="relative z-10 p-4 flex items-center justify-between text-white">
                 <div className="flex flex-col">
                     <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">{t.remaining}</span>
                     <span className="text-xl font-bold">{formatMoney(monthlyBudget - currentMonthExpenses)}</span>
                 </div>
                 <div className="flex-1 mx-4">
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
                        <div 
                            className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-red-400' : budgetProgress > 75 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                            style={{ width: `${budgetProgress}%` }}
                        ></div>
                    </div>
                 </div>
                 <div className="text-right">
                      <span className="text-xs font-medium block opacity-80">{Math.round(budgetProgress)}%</span>
                 </div>
             </div>
          ) : (
             // Expanded View - Full
             <div className="relative z-10 p-6 text-white animate-in fade-in slide-in-from-top-2">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-1">{t.budget_title}</p>
                        {isEditingBudget ? (
                            <input 
                                type="number" 
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                onBlur={() => setIsEditingBudget(false)}
                                autoFocus
                                className="text-3xl font-bold bg-transparent border-b border-blue-400 focus:border-white outline-none w-32"
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
                    <div className="text-right bg-black/20 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5 mr-6">
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
          )}
      </div>

      {/* Add/Edit Transaction Form - Compact */}
      <div className={`glass-panel p-4 rounded-3xl transition-all ${editingId ? 'ring-2 ring-blue-400 bg-white/90' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
             {editingId ? <Pencil size={18} className="text-blue-500"/> : <PlusCircle size={18} className="text-blue-500"/>}
             {editingId ? t.update_transaction : t.add_new}
          </h3>
          
          {editingId && (
              <button onClick={cancelEdit} className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200">
                  {tc.cancel}
              </button>
          )}

          {/* Type Toggle */}
          {!editingId && (
            <div className="flex bg-slate-100 p-1 rounded-xl scale-90 origin-right">
                <button 
                    onClick={() => setType('expense')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500'}`}
                >
                    {t.types.expense}
                </button>
                <button 
                    onClick={() => setType('income')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500'}`}
                >
                    {t.types.income}
                </button>
            </div>
          )}
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
            {/* Amount Input */}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                    {lang === 'zh' ? '¥' : '$'}
                </span>
                <input 
                    type="number" 
                    placeholder="0.00"
                    value={amountStr} 
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white/50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl text-2xl font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300"
                    step="0.01"
                    required
                />
            </div>

            {/* Category Selection - Compact Row */}
            <div>
                <div className="flex flex-wrap gap-2">
                    {categoryList.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`flex items-center gap-1.5 p-1.5 pr-3 rounded-full border transition-all duration-200 active:scale-95 ${
                                category === cat 
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200 shadow-sm' 
                                : 'bg-white/40 border-transparent hover:bg-white/80'
                            }`}
                        >
                            <div className={`transform transition-transform duration-200 ${category === cat ? 'scale-110' : 'scale-100'}`}>
                                {getCategoryIcon(cat, 14)}
                            </div>
                            <span className={`text-xs font-medium ${category === cat ? 'text-blue-700' : 'text-slate-600'}`}>
                                {getCategoryLabel(cat)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Description Input & Submit - Side by Side */}
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder={category ? `${t.categories[category as keyof typeof t.categories]}...` : "..."}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="flex-1 p-3 glass-input rounded-2xl text-sm outline-none text-slate-700"
                />
                <button 
                    type="submit" 
                    disabled={!amountStr}
                    className={`px-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${editingId ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200'}`}
                >
                    {editingId ? <RotateCcw size={18}/> : <Check size={18} />}
                </button>
            </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-2">
        <h3 className="font-bold text-slate-700 px-1 text-xs uppercase tracking-wider opacity-70">{t.recent_transactions}</h3>
        {transactions.length === 0 && (
            <div className="text-center py-8 text-slate-400 glass-panel rounded-2xl border-dashed">
                <p>{t.no_transactions}</p>
            </div>
        )}
        {transactions.slice(0, 20).map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between p-3 glass-card rounded-2xl hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100 hover:scale-[1.01] group ${editingId === t.id ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getCategoryIcon(t.category, 16)}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{getCategoryLabel(t.category)} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`font-bold font-mono text-base ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.type === 'income' ? '+' : '-'}{Math.abs(t.amount).toFixed(2)}
                </span>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity sm:flex-row">
                     <button 
                        onClick={() => startEdit(t)}
                        className="p-1.5 bg-white rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
                     >
                         <Pencil size={12} />
                     </button>
                     <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                     >
                         <Trash2 size={12} />
                     </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finance;
