
import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Sparkles, Pencil, X, Check, ChevronLeft, ChevronRight, Briefcase, Home, GraduationCap, HeartPulse, Coffee } from 'lucide-react';
import { Task, Priority, TaskCategory, Language } from '../types';
import { getPlanningAssistant } from '../services/geminiService';
import { translations } from '../utils/i18n';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
  lang: Language;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks, selectedDate, onDateChange, lang }) => {
  const t = translations[lang].planner;
  const tc = translations[lang].common;

  // State
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('life');
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editCategory, setEditCategory] = useState<TaskCategory>('life');

  // Helpers
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const selectedDateKey = formatDateKey(selectedDate);

  const handleDateChange = (offset: number) => {
      if (onDateChange) {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() + offset);
          onDateChange(newDate);
      }
  };

  // Derived State
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.date === selectedDateKey);
  }, [tasks, selectedDateKey]);

  // Handlers
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      period: 'day', // Legacy/Default
      priority: priority,
      category: category,
      date: selectedDateKey,
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
    setPriority('medium');
    setCategory('life');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (editingTaskId === id) cancelEdit();
  };

  const startEdit = (task: Task) => {
      setEditingTaskId(task.id);
      setEditTaskText(task.text);
      setEditPriority(task.priority);
      setEditCategory(task.category || 'life');
  };

  const cancelEdit = () => {
      setEditingTaskId(null);
      setEditTaskText('');
  };

  const saveEdit = () => {
      if (editingTaskId && editTaskText.trim()) {
          setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, text: editTaskText, priority: editPriority, category: editCategory } : t));
          cancelEdit();
      }
  };

  const fetchAiAdvice = async () => {
    setIsLoadingAi(true);
    const advice = await getPlanningAssistant(filteredTasks, 'day', lang);
    setAiTip(advice);
    setIsLoadingAi(false);
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-500';
    }
  };

  const getPriorityLabel = (p: Priority) => {
      return t.priorities[p];
  }

  const getCategoryIcon = (c: TaskCategory) => {
      switch(c) {
          case 'work': return <Briefcase size={12} />;
          case 'life': return <Home size={12} />;
          case 'study': return <GraduationCap size={12} />;
          case 'health': return <HeartPulse size={12} />;
          case 'other': return <Coffee size={12} />;
          default: return <Circle size={12} />;
      }
  };

  const getCategoryLabel = (c: TaskCategory) => {
      return t.categories[c] || c;
  };

  const getCategoryColor = (c: TaskCategory) => {
      switch(c) {
          case 'work': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
          case 'life': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
          case 'study': return 'text-violet-600 bg-violet-50 border-violet-100';
          case 'health': return 'text-rose-600 bg-rose-50 border-rose-100';
          default: return 'text-slate-600 bg-slate-50 border-slate-100';
      }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-20">
      {/* Header Info with Date Navigation */}
      <div className="flex items-end justify-between px-2 pt-2">
        <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">{t.daily_plan}</div>
            <div className="flex items-center gap-2">
                <button onClick={() => handleDateChange(-1)} className="p-1 hover:bg-white/50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 drop-shadow-sm">
                    {selectedDateKey}
                </h2>
                <button onClick={() => handleDateChange(1)} className="p-1 hover:bg-white/50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
        <div className="text-right">
             <span className="text-3xl font-bold text-slate-200">{filteredTasks.filter(t => t.completed).length}</span>
             <span className="text-lg font-medium text-slate-300">/{filteredTasks.length}</span>
        </div>
      </div>

      {/* AI Tip Section - Compact */}
      {filteredTasks.length > 0 && (
         <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-sky-400"></div>
             <div className="flex items-start gap-2 z-10">
                 <div className="p-1.5 bg-blue-50 rounded-full shadow-sm">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                 </div>
                 <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed line-clamp-2">
                    {aiTip || t.get_advice_ph}
                 </p>
             </div>
             {!aiTip && (
                 <button 
                    onClick={fetchAiAdvice}
                    disabled={isLoadingAi}
                    className="z-10 text-[10px] font-medium bg-white text-blue-600 border border-blue-100 px-3 py-1.5 rounded-full transition-all hover:shadow-md hover:bg-blue-50 whitespace-nowrap flex-shrink-0 ml-auto active:scale-95"
                 >
                    {isLoadingAi ? t.thinking : t.ai_advice}
                 </button>
             )}
         </div>
      )}

      {/* Add Task Form - Enhanced */}
      <form onSubmit={addTask} className="relative flex flex-col gap-2">
        <div className="relative flex-1 group">
            <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={t.add_placeholder}
            className="w-full pl-4 pr-12 py-3 rounded-xl glass-input outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-400 focus:shadow-blue-100 focus:ring-2 focus:ring-blue-100 text-sm"
            />
            <button
            type="submit"
            className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
            >
            <Plus size={18} />
            </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="px-3 py-2 glass-input rounded-xl text-xs text-slate-700 outline-none font-medium cursor-pointer hover:bg-white/80 transition-colors"
            >
                <option value="high">{t.priorities.high}</option>
                <option value="medium">{t.priorities.medium}</option>
                <option value="low">{t.priorities.low}</option>
            </select>
            
            {/* Category Selector Pills */}
            <div className="flex bg-white/40 p-1 rounded-xl gap-1">
                {(['work', 'life', 'study', 'health', 'other'] as TaskCategory[]).map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${category === cat ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {t.categories[cat]}
                    </button>
                ))}
            </div>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-slate-400 glass-panel rounded-2xl border-dashed border-2 border-slate-200/50">
                <p>{t.empty}</p>
            </div>
        )}
        
        {filteredTasks
            .sort((a, b) => {
                if (a.completed === b.completed) {
                    const pMap = { high: 3, medium: 2, low: 1 };
                    return pMap[b.priority] - pMap[a.priority];
                }
                return a.completed ? 1 : -1;
            })
            .map((task) => (
          <div
            key={task.id}
            className={`group relative p-3 glass-card rounded-2xl transition-all duration-500 ease-out border border-transparent ${
              task.completed 
                ? 'opacity-50 bg-slate-50/50 grayscale-[0.2]' 
                : 'hover:shadow-md hover:border-blue-100'
            }`}
          >
            {editingTaskId === task.id ? (
                // Edit Mode
                <div className="flex flex-col gap-2 animate-in fade-in">
                    <input 
                        type="text" 
                        value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-blue-200 outline-none text-slate-800 text-sm"
                        autoFocus
                    />
                    <div className="flex justify-between items-center flex-wrap gap-2">
                         <div className="flex gap-2">
                            <select 
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value as Priority)}
                                className="text-xs p-1 rounded border border-slate-200 bg-white text-slate-700"
                            >
                                <option value="high">{t.priorities.high}</option>
                                <option value="medium">{t.priorities.medium}</option>
                                <option value="low">{t.priorities.low}</option>
                            </select>
                            <select 
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
                                className="text-xs p-1 rounded border border-slate-200 bg-white text-slate-700"
                            >
                                <option value="work">{t.categories.work}</option>
                                <option value="life">{t.categories.life}</option>
                                <option value="study">{t.categories.study}</option>
                                <option value="health">{t.categories.health}</option>
                                <option value="other">{t.categories.other}</option>
                            </select>
                         </div>
                        <div className="flex gap-2">
                            <button onClick={cancelEdit} className="p-1 text-slate-400 hover:text-slate-600"><X size={16}/></button>
                            <button onClick={saveEdit} className="p-1 text-blue-600 hover:text-blue-700"><Check size={16}/></button>
                        </div>
                    </div>
                </div>
            ) : (
                // View Mode
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 transition-all duration-300 transform active:scale-90 ${
                        task.completed 
                            ? 'text-emerald-500 scale-110' 
                            : 'text-slate-300 hover:text-blue-500 hover:scale-110'
                        }`}
                    >
                        {task.completed ? (
                            <CheckCircle2 size={22} className="animate-in zoom-in duration-300" />
                        ) : (
                            <Circle size={22} />
                        )}
                    </button>
                    
                    <div className="flex flex-col gap-0.5 transition-all duration-300 overflow-hidden w-full">
                        <span
                            className={`text-slate-700 font-medium text-sm transition-all duration-300 truncate ${
                            task.completed ? 'line-through text-slate-400' : ''
                            }`}
                        >
                            {task.text}
                        </span>
                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${getCategoryColor(task.category || 'other')}`}>
                                {getCategoryIcon(task.category || 'other')} {getCategoryLabel(task.category || 'other')}
                            </span>
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                        <button
                            onClick={() => startEdit(task)}
                            className="text-slate-400 hover:text-blue-500 p-2 transition-colors"
                            title={tc.edit}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                            title={tc.delete}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
