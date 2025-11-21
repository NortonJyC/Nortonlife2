
import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Task, View, Language } from '../types';
import { translations } from '../utils/i18n';

interface CalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  tasksMap: Record<string, boolean>; // format: "YYYY-MM-DD": hasTasks
  tasks: Task[];
  setView: (view: View) => void;
  lang: Language;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, onDateSelect, tasksMap, tasks, setView, lang }) => {
  const t = translations[lang].calendar;
  const [viewDate, setViewDate] = React.useState(currentDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (date: Date) => {
      onDateSelect(date);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 sm:h-16"></div>);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = formatDateKey(viewDate.getFullYear(), viewDate.getMonth(), i);
      const isSelected = 
        currentDate.getDate() === i && 
        currentDate.getMonth() === viewDate.getMonth() && 
        currentDate.getFullYear() === viewDate.getFullYear();
      
      const isToday = 
        new Date().getDate() === i && 
        new Date().getMonth() === viewDate.getMonth() && 
        new Date().getFullYear() === viewDate.getFullYear();

      const hasTask = tasksMap[dateKey];

      days.push(
        <button
          key={i}
          onClick={() => {
            const newDate = new Date(viewDate);
            newDate.setDate(i);
            handleDateClick(newDate);
          }}
          className={`h-12 sm:h-16 w-full rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 border active:scale-95 ${
            isSelected 
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105 z-10' 
              : isToday 
                ? 'text-blue-600 font-bold bg-blue-50 border-blue-100'
                : 'text-slate-700 bg-white/40 border-transparent hover:bg-white/80 hover:border-white'
          }`}
        >
          <span className="text-sm sm:text-base">{i}</span>
          {hasTask && !isSelected && (
            <span className="absolute bottom-2 w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
          )}
        </button>
      );
    }
    return days;
  };

  // Get tasks for the selected date preview
  const selectedDateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const selectedDateTasks = tasks.filter(t => t.date === selectedDateKey);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Calendar Main View */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white/80 rounded-full text-slate-600 transition-colors bg-white/30 active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-slate-800 text-xl tracking-tight">
            {viewDate.getFullYear()}{t.year_unit} {viewDate.getMonth() + 1}{t.month_unit}
          </span>
          <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white/80 rounded-full text-slate-600 transition-colors bg-white/30 active:scale-95">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {t.weekdays.map(d => (
            <div key={d} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Day Preview */}
      <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">
                  {selectedDateKey} {t.schedule}
              </h3>
              <button 
                onClick={() => setView('planner')}
                className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors active:scale-95"
              >
                  {t.edit_details}
              </button>
          </div>
          
          <div className="space-y-2">
              {selectedDateTasks.length === 0 ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                      <AlertCircle size={16} />
                      <span>{t.no_tasks}</span>
                  </div>
              ) : (
                  selectedDateTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/40">
                          <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-slate-300' : 'bg-blue-500'}`}></div>
                          <span className={`text-sm text-slate-700 ${task.completed ? 'line-through opacity-60' : ''}`}>
                              {task.text}
                          </span>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

export default Calendar;
