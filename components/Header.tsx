
import React, { useState } from 'react';
import { Settings, Globe, Trash2, X, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onClearData: (type: 'tasks' | 'transactions' | 'all') => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onClearData }) => {
  const t = translations[lang].settings;
  const tc = translations[lang].common;
  const [showSettings, setShowSettings] = useState(false);

  const toggleLang = () => {
      setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const handleClear = (type: 'tasks' | 'transactions' | 'all') => {
      if (window.confirm(t.confirm_msg)) {
          onClearData(type);
          setShowSettings(false);
      }
  };

  const handleRefresh = () => {
      window.location.reload();
  };

  return (
    <>
      <header className="sticky top-4 z-40 mx-3 sm:mx-4 rounded-2xl glass-panel shadow-lg shadow-blue-900/5 border-white/60 transition-all mb-4">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo Area */}
          <div className="font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2 cursor-default">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-500">
              NortonLife
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
                onClick={handleRefresh}
                className="p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
                title={tc.refresh}
            >
                <RotateCcw size={18} />
            </button>

            <button 
                onClick={toggleLang}
                className="p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
                title={lang === 'zh' ? "Switch to English" : "切换到中文"}
            >
                <Globe size={18} />
            </button>

            <button 
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
            >
                <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Settings size={18} className="text-blue-500"/> {t.title}
                      </h3>
                      <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                          <X size={20} className="text-slate-400" />
                      </button>
                  </div>
                  <div className="p-5 space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.clear_data}</p>
                      
                      <button 
                        onClick={() => handleClear('tasks')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-medium border border-transparent hover:border-red-100"
                      >
                          <Trash2 size={16} /> {t.clear_tasks}
                      </button>

                      <button 
                        onClick={() => handleClear('transactions')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-medium border border-transparent hover:border-red-100"
                      >
                          <Trash2 size={16} /> {t.clear_finance}
                      </button>

                      <hr className="border-slate-100 my-2"/>

                      <button 
                        onClick={() => handleClear('all')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200 text-sm font-medium justify-center"
                      >
                          <Trash2 size={16} /> {t.reset_all}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default Header;
