
import React from 'react';
import { LayoutDashboard, Calendar, ListTodo, Wallet, Home } from 'lucide-react';
import { View, Language } from '../types';
import { translations } from '../utils/i18n';

interface BottomNavProps {
  activeView: View;
  setView: (view: View) => void;
  lang: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView, lang }) => {
  const t = translations[lang].nav;
  
  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'planner', label: t.planner, icon: ListTodo },
    { id: 'finance', label: t.finance, icon: Wallet },
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pb-safe pt-2 px-4">
      <div className="max-w-3xl mx-auto mb-4 rounded-2xl glass-panel shadow-xl shadow-blue-900/10 border-white/80 flex justify-around items-center p-2 backdrop-blur-xl bg-white/90">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300 active:scale-95 min-w-[3.5rem] ${
                isActive
                  ? 'text-blue-600 bg-blue-50 scale-105'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
