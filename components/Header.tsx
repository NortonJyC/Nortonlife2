
import React, { useState } from 'react';
import { Settings, Globe, Trash2, X, RotateCcw, AlertTriangle, HardDrive, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onClearData: (type: 'tasks' | 'transactions' | 'all') => void;
  privacyMode: boolean;
  setPrivacyMode: (mode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onClearData, privacyMode, setPrivacyMode }) => {
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
                onClick={() => setPrivacyMode(!privacyMode)}
                className="p-2 rounded-full hover:bg-white/60 active:scale-95 transition-all text-slate-600 border border-transparent hover:border-white/60"
                title={privacyMode ? "Show values" : "Hide values"}
            >
                {privacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50 relative">
                  
                  {/* Modal Header */}
                  <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-b from-white to-slate-50/50">
                      <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                              <Settings size={20} />
                          </div>
                          {t.title}
                      </h3>
                      <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors active:scale-95">
                          <X size={18} className="text-slate-500" />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                      
                      {/* Data Management Section */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <HardDrive size={12} /> {t.clear_data}
                          </h4>
                          <div className="space-y-2">
                              <button 
                                onClick={() => handleClear('tasks')}
                                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all active:scale-98 group border border-slate-100"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:scale-125 transition-transform"></div>
                                      <span className="font-medium text-sm">{t.clear_tasks}</span>
                                  </div>
                                  <Trash2 size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                              </button>

                              <button 
                                onClick={() => handleClear('transactions')}
                                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all active:scale-98 group border border-slate-100"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></div>
                                      <span className="font-medium text-sm">{t.clear_finance}</span>
                                  </div>
                                  <Trash2 size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                              </button>
                          </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="pt-2">
                          <button 
                            onClick={() => handleClear('all')}
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 font-bold text-sm group relative overflow-hidden"
                          >
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                              <AlertTriangle size={18} /> {t.reset_all}
                          </button>
                      </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 text-center">
                      <p className="text-[10px] text-slate-400 font-medium">NortonLife v3.0</p>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default Header;
