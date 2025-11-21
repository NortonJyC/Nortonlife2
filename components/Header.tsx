
import React, { useState } from 'react';
import { LayoutDashboard, Calendar, ListTodo, Wallet, Home, Globe, Settings, Trash2, X, Github } from 'lucide-react';
import { View, Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  activeView: View;
  setView: (view: View) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onClearData: (type: 'tasks' | 'transactions' | 'all') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setView, lang, setLang, onClearData }) => {
  const t = translations[lang].nav;
  const ts = translations[lang].settings;
  const [showSettings, setShowSettings] = useState(false);
  
  // REPLACE THIS WITH YOUR ACTUAL GITHUB URL
  const GITHUB_REPO_URL = "https://github.com/YOUR_USERNAME/norton-life";
  
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

  const handleClear = (type: 'tasks' | 'transactions' | 'all') => {
      if (window.confirm(ts.confirm_msg)) {
          onClearData(type);
          setShowSettings(false);
      }
  };

  return (
    <>
      <header className="sticky top-4 z-40 mx-3 sm:mx-4 rounded-2xl glass-panel shadow-lg shadow-blue-900/5 border-white/60 transition-all">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Area */}
          <div className="font-bold text-lg sm:text-xl tracking-tight flex items-center gap-1 cursor-pointer group flex-shrink-0 mr-2" onClick={() => setView('home')}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-500 group-hover:opacity-80 transition-opacity">
              NortonLife
            </span>
          </div>
          
          {/* Right Side: Nav + Actions */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-hidden justify-end flex-1">
              {/* Scrollable Nav Menu */}
              <nav className="flex gap-1 bg-slate-100/50 p-1 rounded-full backdrop-blur-sm overflow-x-auto scrollbar-hide max-w-[110px] xs:max-w-[140px] sm:max-w-none flex-shrink">
              {navItems.map((item) => {
                  const isActive = activeView === item.id;
                  const Icon = item.icon;
                  return (
                  <button
                      key={item.id}
                      onClick={() => setView(item.id as View)}
                      className={`flex items-center justify-center gap-2 px-2.5 py-2 sm:px-3 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 flex-shrink-0 ${
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

              {/* Action Buttons */}
              <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <button 
                    onClick={toggleLang}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
                    title={lang === 'zh' ? "Switch to English" : "切换到中文"}
                >
                    <Globe size={18} />
                </button>

                <button 
                    onClick={() => setShowSettings(true)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
                >
                    <Settings size={18} />
                </button>
              </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Settings size={18} className="text-blue-500"/> {ts.title}
                      </h3>
                      <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                          <X size={20} className="text-slate-400" />
                      </button>
                  </div>
                  <div className="p-5 space-y-3">
                      {/* GitHub Link */}
                      <a 
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition-colors text-sm font-medium justify-center mb-4 active:scale-95"
                      >
                          <Github size={18} /> {ts.github}
                      </a>

                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{ts.clear_data}</p>
                      
                      <button 
                        onClick={() => handleClear('tasks')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-medium border border-transparent hover:border-red-100"
                      >
                          <Trash2 size={16} /> {ts.clear_tasks}
                      </button>

                      <button 
                        onClick={() => handleClear('transactions')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-medium border border-transparent hover:border-red-100"
                      >
                          <Trash2 size={16} /> {ts.clear_finance}
                      </button>

                      <hr className="border-slate-100 my-2"/>

                      <button 
                        onClick={() => handleClear('all')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200 text-sm font-medium justify-center"
                      >
                          <Trash2 size={16} /> {ts.reset_all}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default Header;
