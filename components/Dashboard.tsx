
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Lightbulb, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { Transaction, Task, Language } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { translations } from '../utils/i18n';

interface DashboardProps {
  transactions: Transaction[];
  tasks: Task[];
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, tasks, lang }) => {
  const t = translations[lang].dashboard;
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // Data for Pie Chart (Expense by Category)
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: translations[lang].finance.categories[key as keyof typeof translations['zh']['finance']['categories']] || key,
    value: expensesByCategory[key],
  }));

  // Data for Bar Chart
  const barData = [
      { name: 'Total', Income: income, Expense: expense }
  ];

  // Blue/Cool chart colors
  const COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6', '#10b981', '#f43f5e'];

  useEffect(() => {
    if (transactions.length > 0) {
      setLoadingAdvice(true);
      getFinancialAdvice(transactions, lang).then(advice => {
        setAiAdvice(advice);
        setLoadingAdvice(false);
      });
    }
  }, [transactions, lang]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { style: 'currency', currency: lang === 'zh' ? 'CNY' : 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Summary Cards - Glass Style */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <div className="glass-card p-3 sm:p-5 rounded-2xl flex flex-col justify-between min-h-[7rem] sm:h-28 overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="text-[10px] sm:text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 inline-block px-2 py-1 rounded-lg w-fit mb-1">{t.income}</div>
          <div className="text-lg sm:text-2xl font-bold text-slate-800 truncate" title={formatMoney(income)}>
            {formatMoney(income)}
          </div>
        </div>
        <div className="glass-card p-3 sm:p-5 rounded-2xl flex flex-col justify-between min-h-[7rem] sm:h-28 overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="text-[10px] sm:text-xs text-rose-500 font-bold uppercase tracking-wider bg-rose-50 inline-block px-2 py-1 rounded-lg w-fit mb-1">{t.expense}</div>
          <div className="text-lg sm:text-2xl font-bold text-slate-800 truncate" title={formatMoney(expense)}>
            {formatMoney(expense)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 sm:p-5 rounded-2xl shadow-lg shadow-blue-500/30 flex flex-col justify-between min-h-[7rem] sm:h-28 text-white overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
          <div className="text-[10px] sm:text-xs text-blue-100 font-bold uppercase tracking-wider bg-white/20 inline-block px-2 py-1 rounded-lg w-fit backdrop-blur-sm mb-1">{t.balance}</div>
          <div className="text-lg sm:text-2xl font-bold truncate" title={formatMoney(balance)}>
            {formatMoney(balance)}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-panel border-blue-200 rounded-2xl p-5 shadow-sm flex gap-4 items-start bg-gradient-to-r from-white/60 to-blue-50/60 transition-all hover:shadow-md">
         <div className="bg-blue-100 p-2.5 rounded-full flex-shrink-0 text-blue-600 shadow-sm mt-1">
            <Lightbulb className="w-5 h-5" />
         </div>
         <div className="flex-1">
             <h4 className="text-sm font-bold text-blue-800 mb-1">{t.ai_insight}</h4>
             <p className="text-sm text-slate-600 leading-relaxed">
                {loadingAdvice ? t.analyzing : (aiAdvice || t.no_data)}
             </p>
         </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Structure */}
        <div className="glass-panel p-6 rounded-3xl transition-all hover:shadow-lg">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
             <Wallet size={20} className="text-blue-500" /> {t.expense_structure}
          </h3>
          <div className="h-64 w-full">
             {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            formatter={(value) => formatMoney(Number(value))} 
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                    </PieChart>
                </ResponsiveContainer>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                     <AlertCircle className="opacity-50" />
                     {t.no_data}
                 </div>
             )}
          </div>
        </div>

        {/* Income vs Expense */}
        <div className="glass-panel p-6 rounded-3xl transition-all hover:shadow-lg">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-lg">
             <TrendingUp size={20} className="text-emerald-500" /> {t.income_vs_expense}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} width={40} />
                <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} 
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => formatMoney(Number(value))} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                <Bar dataKey="Income" name={t.income} fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expense" name={t.expense} fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task Summary Widget */}
      <div className="glass-panel p-6 rounded-3xl transition-all hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-700 text-lg">{t.task_overview}</h3>
             <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                 {tasks.filter(t => !t.completed).length} {t.remaining}
             </span>
          </div>
          <div className="space-y-2">
              {tasks.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-3 text-slate-700 p-2 hover:bg-white/40 rounded-lg transition-colors">
                      <div className={`w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0 ${t.completed ? 'bg-slate-300' : 'bg-blue-500'}`}></div>
                      <span className={`text-sm font-medium truncate ${t.completed ? 'line-through opacity-50' : ''}`}>{t.text}</span>
                  </div>
              ))}
              {tasks.length === 0 && <div className="text-sm text-slate-400 pl-2">{t.no_tasks}</div>}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
