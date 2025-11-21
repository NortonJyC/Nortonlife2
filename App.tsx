
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Planner from './components/Planner';
import Finance from './components/Finance';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Home from './components/Home';
import SplashScreen from './components/SplashScreen';
import { Task, Transaction, View, Language, GreetingData } from './types';
import { translations } from './utils/i18n';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese
  const [greeting, setGreeting] = useState<GreetingData>(() => {
    const saved = localStorage.getItem('norton_greeting');
    return saved ? JSON.parse(saved) : { emoji: '☀️', text: '早安, 开始高效的一天。' };
  });
  
  // Swipe Logic State
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const viewOrder: View[] = ['home', 'calendar', 'planner', 'finance', 'dashboard'];

  // Helper for date strings
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  // DUMMY DATA CONSTANTS
  const INITIAL_TASKS: Task[] = [
    { id: '1', text: '完成项目报告', completed: false, period: 'day', priority: 'high', date: todayStr, createdAt: Date.now() },
    { id: '2', text: '健身房锻炼', completed: true, period: 'day', priority: 'medium', date: todayStr, createdAt: Date.now() - 10000 },
    { id: '3', text: '超市采购', completed: false, period: 'day', priority: 'low', date: yesterdayStr, createdAt: Date.now() },
    { id: '4', text: '准备周会材料', completed: false, period: 'week', priority: 'high', date: todayStr, createdAt: Date.now() },
  ];

  const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: '1', amount: 15000, type: 'income', category: 'Salary', description: '三月工资', date: Date.now() - 86400000 * 2 },
    { id: '2', amount: 45, type: 'expense', category: 'Food', description: '午餐', date: Date.now() },
    { id: '3', amount: 2400, type: 'expense', category: 'Housing', description: '房租', date: Date.now() - 86400000 },
    { id: '4', amount: 320, type: 'expense', category: 'Transport', description: '地铁充值', date: Date.now() },
    { id: '5', amount: 580, type: 'expense', category: 'Shopping', description: '买衣服', date: Date.now() - 86400000 * 5 },
  ];

  // Initialize State from LocalStorage or fallback to Dummy Data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('norton_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('norton_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Budget State Persistence (New)
  const [budget, setBudget] = useState<string>(() => {
    return localStorage.getItem('norton_budget') || '5000';
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('norton_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('norton_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('norton_greeting', JSON.stringify(greeting));
  }, [greeting]);

  useEffect(() => {
    localStorage.setItem('norton_budget', budget);
  }, [budget]);

  const handleClearData = (type: 'tasks' | 'transactions' | 'all') => {
      if (type === 'tasks' || type === 'all') {
          setTasks([]);
      }
      if (type === 'transactions' || type === 'all') {
          setTransactions([]);
          setBudget('5000'); // Reset budget on full clear
      }
  };

  const tasksMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    tasks.forEach(t => {
        if (!t.completed) map[t.date] = true;
    });
    return map;
  }, [tasks]);

  // Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null; 
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    const currentIndex = viewOrder.indexOf(activeView);
    
    if (isLeftSwipe && currentIndex < viewOrder.length - 1) {
        setActiveView(viewOrder[currentIndex + 1]);
    }
    
    if (isRightSwipe && currentIndex > 0) {
        setActiveView(viewOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-800 selection:bg-blue-200 font-sans pb-24">
      
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Decorative Background Blobs - Blue Theme */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/30 rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-100/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-indigo-100/40 rounded-full blur-[100px] opacity-50 mix-blend-multiply"></div>
      </div>

      <Header 
        lang={lang} 
        setLang={setLang} 
        onClearData={handleClearData}
      />
      
      {/* Main Content with Smooth Transitions and Swipe Support */}
      <main 
        key={activeView}
        className={`max-w-3xl mx-auto px-4 py-1 transition-all duration-500 ${showSplash ? 'opacity-0' : 'opacity-100 animate-slide-up'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {activeView === 'home' && (
          <Home 
            tasks={tasks} 
            setTasks={setTasks} 
            transactions={transactions} 
            setTransactions={setTransactions} 
            setView={setActiveView}
            lang={lang}
            greeting={greeting}
            setGreeting={setGreeting}
          />
        )}
        {activeView === 'calendar' && (
          <Calendar 
            currentDate={selectedDate} 
            onDateSelect={setSelectedDate} 
            tasksMap={tasksMap}
            tasks={tasks}
            setView={setActiveView}
            lang={lang}
          />
        )}
        {activeView === 'planner' && (
          <Planner tasks={tasks} setTasks={setTasks} selectedDate={selectedDate} lang={lang} />
        )}
        {activeView === 'finance' && (
          <Finance 
            transactions={transactions} 
            setTransactions={setTransactions} 
            lang={lang}
            budget={budget}
            setBudget={setBudget}
          />
        )}
        {activeView === 'dashboard' && (
          <Dashboard transactions={transactions} tasks={tasks} lang={lang} />
        )}
      </main>

      <BottomNav 
        activeView={activeView}
        setView={setActiveView}
        lang={lang}
      />
    </div>
  );
};

export default App;
