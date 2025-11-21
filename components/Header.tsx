
import React from 'react';
import { LayoutDashboard, Calendar, ListTodo, Wallet, Home, Globe } from 'lucide-react';
import { View, Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  activeView: View;
  setView: (view: View) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setView, lang, setLang }) => {
  const t = translations[lang].nav;
  
  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'planner', label: t.planner, icon: ListTodo },
    { id: 'finance', label: t.finance, icon: Wallet },
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
  ];

  const toggleLang = () => {
      setLang(lang === 'zh' ? 'en' : 'zh');
  };

  return (
    <header className="sticky top-4 z-50 mx-4 rounded-2xl glass-panel shadow-lg shadow-blue-900/5 border-white/60 transition-all">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight flex items-center gap-1 cursor-pointer group" onClick={() => setView('home')}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-500 group-hover:opacity-80 transition-opacity">
            NortonLife
          </span>
        </div>
        
        <div className="flex items-center gap-2">
            <nav className="flex gap-1 bg-slate-100/50 p-1 rounded-full backdrop-blur-sm overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
                const isActive = activeView === item.id;
                const Icon = item.icon;
                return (
                <button
                    key={item.id}
                    onClick={() => setView(item.id as View)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 flex-shrink-0 ${
                    isActive
                        ? 'bg-white text-blue-600 shadow-sm shadow-blue-100 scale-105'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                    }`}
                >
                    <Icon size={18} />
                    <span className="hidden md:inline">{item.label}</span>
                </button>
                );
            })}
            </nav>

            <button 
                onClick={toggleLang}
                className="p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
                title={lang === 'zh' ? "Switch to English" : "切换到中文"}
            >
                <Globe size={18} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
