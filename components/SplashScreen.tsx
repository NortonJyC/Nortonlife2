
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Start text animation slightly after mount
    setTimeout(() => setShowText(true), 100);

    // Start exit sequence
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinish, 800); // Wait for exit animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-3xl transition-all duration-700 ease-in-out ${
            isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
    >
      <div className="relative">
        {/* Decorative background glow */}
        <div className={`absolute -inset-8 bg-blue-400/20 rounded-full blur-3xl transition-opacity duration-1000 ${showText ? 'opacity-100' : 'opacity-0'}`}></div>
        
        <div className={`flex flex-col items-center transform transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            showText ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tighter animate-float">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500">
                    Hi~
                </span>
                <span className="text-slate-800 ml-2">
                    Norton
                </span>
            </h1>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
