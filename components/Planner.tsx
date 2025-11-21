
import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Sparkles, Pencil, X, Check } from 'lucide-react';
import { Task, Priority, Language } from '../types';
import { getPlanningAssistant } from '../services/geminiService';
import { translations } from '../utils/i18n';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedDate: Date;
  lang: Language;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks, selectedDate, lang }) => {
  const t = translations[lang].planner;
  const tc = translations[lang].common;

  // State
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('medium');

  // Helpers
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const selectedDateKey = formatDateKey(selectedDate);

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
      date: selectedDateKey,
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
    setPriority('medium');
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
  };

  const cancelEdit = () => {
      setEditingTaskId(null);
      setEditTaskText('');
  };

  const saveEdit = () => {
      if (editingTaskId && editTaskText.trim()) {
          setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, text: editTaskText, priority: editPriority } : t));
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header Info */}
      <div className="flex items-end justify-between px-2">
        <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t.daily_plan}</div>
            <h2 className="text-3xl font-bold text-slate-800 drop-shadow-sm">
                {selectedDateKey}
            </h2>
        </div>
        <div className="text-right">
             <span className="text-4xl font-bold text-slate-200">{filteredTasks.filter(t => t.completed).length}</span>
             <span className="text-xl font-medium text-slate-300">/{filteredTasks.length}</span>
        </div>
      </div>

      {/* AI Tip Section */}
      {filteredTasks.length > 0 && (
         <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-sky-400"></div>
             <div className="flex items-start gap-3 z-10">
                 <div className="p-2 bg-blue-50 rounded-full shadow-sm">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                 </div>
                 <p className="text-sm text-slate-700 italic leading-relaxed">
                    {aiTip || t.get_advice_ph}
                 </p>
             </div>
             {!aiTip && (
                 <button 
                    onClick={fetchAiAdvice}
                    disabled={isLoadingAi}
                    className="z-10 text-xs font-medium bg-white text-blue-600 border border-blue-100 px-4 py-2 rounded-full transition-all hover:shadow-md hover:bg-blue-50 whitespace-nowrap flex-shrink-0 ml-auto active:scale-95"
                 >
                    {isLoadingAi ? t.thinking : t.ai_advice}
                 </button>
             )}
         </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={addTask} className="relative flex gap-3">
        <div className="relative flex-1 group">
            <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={t.add_placeholder}
            className="w-full pl-5 pr-14 py-4 rounded-2xl glass-input outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-400 focus:shadow-blue-100 focus:ring-2 focus:ring-blue-100"
            />
            <button
            type="submit"
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
            >
            <Plus size={20} />
            </button>
        </div>
        <div className="flex-shrink-0">
            <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="h-full px-4 glass-input rounded-2xl text-sm text-slate-700 outline-none font-medium cursor-pointer hover:bg-white/80 transition-colors"
            >
                <option value="high">{t.priorities.high}</option>
                <option value="medium">{t.priorities.medium}</option>
                <option value="low">{t.priorities.low}</option>
            </select>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
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
            className={`group relative p-4 glass-card rounded-2xl transition-all duration-500 ease-out border border-transparent ${
              task.completed 
                ? 'opacity-50 bg-slate-50/50 grayscale-[0.2]' 
                : 'hover:shadow-md hover:border-blue-100'
            }`}
          >
            {editingTaskId === task.id ? (
                // Edit Mode
                <div className="flex flex-col gap-3 animate-in fade-in">
                    <input 
                        type="text" 
                        value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-blue-200 outline-none text-slate-800"
                        autoFocus
                    />
                    <div className="flex justify-between items-center">
                         <select 
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as Priority)}
                            className="text-sm p-1 rounded border border-slate-200 bg-white text-slate-700"
                        >
                            <option value="high">{t.priorities.high}</option>
                            <option value="medium">{t.priorities.medium}</option>
                            <option value="low">{t.priorities.low}</option>
                        </select>
                        <div className="flex gap-2">
                            <button onClick={cancelEdit} className="p-1 text-slate-400 hover:text-slate-600"><X size={18}/></button>
                            <button onClick={saveEdit} className="p-1 text-blue-600 hover:text-blue-700"><Check size={18}/></button>
                        </div>
                    </div>
                </div>
            ) : (
                // View Mode
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 transition-all duration-300 transform active:scale-90 ${
                        task.completed 
                            ? 'text-emerald-500 scale-110' 
                            : 'text-slate-300 hover:text-blue-500 hover:scale-110'
                        }`}
                    >
                        {task.completed ? (
                            <CheckCircle2 size={24} className="animate-in zoom-in duration-300" />
                        ) : (
                            <Circle size={24} />
                        )}
                    </button>
                    
                    <div className="flex flex-col gap-1 transition-all duration-300">
                        <span
                            className={`text-slate-700 font-medium text-[15px] transition-all duration-300 ${
                            task.completed ? 'line-through text-slate-400' : ''
                            }`}
                        >
                            {task.text}
                        </span>
                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                            </span>
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => startEdit(task)}
                            className="text-slate-400 hover:text-blue-500 p-2 transition-colors"
                            title={tc.edit}
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                            title={tc.delete}
                        >
                            <Trash2 size={18} />
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
