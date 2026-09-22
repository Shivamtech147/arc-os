import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, CategoryType, PriorityType } from '../../types';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Zap,
  Check,
  Sparkles
} from 'lucide-react';
import { NavTab } from '../Layout';

interface TodayViewProps {
  onSelectTab?: (tab: NavTab) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onSelectTab }) => {
  const {
    todayLog,
    updateDayMissions,
    updateDayReflection,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    currentDateStr
  } = useApp();

  // Local mission edit state
  const [editingMissions, setEditingMissions] = useState(false);
  const [mainMissionInput, setMainMissionInput] = useState(todayLog.mainMission || '');
  const [academicMissionInput, setAcademicMissionInput] = useState(todayLog.academicMission || '');
  const [careerMissionInput, setCareerMissionInput] = useState(todayLog.careerMission || '');
  const [bodyMissionInput, setBodyMissionInput] = useState(todayLog.bodyMission || '');

  // Local task creation modal/form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<CategoryType>('Academics');
  const [taskPriority, setTaskPriority] = useState<PriorityType>('medium');
  const [taskDuration, setTaskDuration] = useState(30);
  const [taskDeadline, setTaskDeadline] = useState('');

  // Reflection local state
  const [win, setWin] = useState(todayLog.reflection?.win || '');
  const [mistake, setMistake] = useState(todayLog.reflection?.mistake || '');
  const [timeWasted, setTimeWasted] = useState(todayLog.reflection?.timeWasted || '');
  const [tomorrowMission, setTomorrowMission] = useState(todayLog.reflection?.tomorrowMission || '');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const handleSaveMissions = async () => {
    await updateDayMissions(currentDateStr, {
      main: mainMissionInput,
      academic: academicMissionInput,
      career: careerMissionInput,
      body: bodyMissionInput,
    });
    setEditingMissions(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await addTask({
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      estimatedDurationMinutes: taskDuration,
      deadline: taskDeadline || null,
      date: currentDateStr,
    });
    setTaskTitle('');
    setShowAddTask(false);
  };

  const handleSaveReflection = async () => {
    await updateDayReflection(currentDateStr, {
      win,
      mistake,
      timeWasted,
      tomorrowMission,
    });
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2000);
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const getCategoryDot = (cat: CategoryType) => {
    switch (cat) {
      case 'Academics': return <span className="w-2.5 h-2.5 rounded-full bg-[#4F7CFF] shrink-0"></span>;
      case 'Career': return <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0"></span>;
      case 'Body': return <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0"></span>;
      case 'Mind': return <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0"></span>;
      default: return <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shrink-0"></span>;
    }
  };

  const formatDateLabel = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#F8FAFC] pb-12">
      {/* 1. Header */}
      <div className="border-b border-[#2B3040] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">TODAY</h1>
          <p className="text-xs font-medium text-[#A7AFBF] mt-0.5">{formatDateLabel()}</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="py-2 px-4 bg-[#4F7CFF] hover:bg-[#3B66E6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-[#4F7CFF]/20"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* 2. ONE THING Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#191C24] via-[#20242E] to-[#191C24] border border-[#4F7CFF]/30 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#4F7CFF]/20 via-[#8B5CF6]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold tracking-wider text-[#4F7CFF] uppercase flex items-center gap-1.5">
                <Target className="w-4 h-4" /> ONE THING
              </span>
              <button
                onClick={() => {
                  if (!editingMissions) {
                    setMainMissionInput(todayLog.mainMission || '');
                    setAcademicMissionInput(todayLog.academicMission || '');
                    setCareerMissionInput(todayLog.careerMission || '');
                    setBodyMissionInput(todayLog.bodyMission || '');
                  }
                  setEditingMissions(!editingMissions);
                }}
                className="text-xs text-[#A7AFBF] hover:text-white transition flex items-center gap-1 font-mono"
              >
                <Edit2 className="w-3 h-3" />
                {editingMissions ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editingMissions ? (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={mainMissionInput}
                  onChange={(e) => setMainMissionInput(e.target.value)}
                  placeholder="Primary objective..."
                  className="w-full bg-[#111318] border border-[#4F7CFF]/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={academicMissionInput}
                    onChange={(e) => setAcademicMissionInput(e.target.value)}
                    placeholder="Academics goal..."
                    className="bg-[#111318] border border-[#2B3040] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={careerMissionInput}
                    onChange={(e) => setCareerMissionInput(e.target.value)}
                    placeholder="Career goal..."
                    className="bg-[#111318] border border-[#2B3040] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={bodyMissionInput}
                    onChange={(e) => setBodyMissionInput(e.target.value)}
                    placeholder="Body goal..."
                    className="bg-[#111318] border border-[#2B3040] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <button
                  onClick={handleSaveMissions}
                  className="py-2 px-4 bg-[#4F7CFF] text-white font-bold text-xs rounded-xl"
                >
                  Save Mission
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                  {todayLog.mainMission || (
                    <span className="text-[#A7AFBF] italic text-base">
                      No primary mission set. Specify today's core objective.
                    </span>
                  )}
                </h2>

                {(todayLog.academicMission || todayLog.careerMission || todayLog.bodyMission) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 font-mono text-xs">
                    {todayLog.academicMission && (
                      <div className="p-2.5 bg-[#111318]/70 border border-[#4F7CFF]/30 rounded-xl">
                        <span className="text-[10px] text-[#4F7CFF] font-bold uppercase block">● Academics</span>
                        <span className="text-[#F8FAFC] truncate block mt-0.5">{todayLog.academicMission}</span>
                      </div>
                    )}
                    {todayLog.careerMission && (
                      <div className="p-2.5 bg-[#111318]/70 border border-[#F97316]/30 rounded-xl">
                        <span className="text-[10px] text-[#F97316] font-bold uppercase block">● Career</span>
                        <span className="text-[#F8FAFC] truncate block mt-0.5">{todayLog.careerMission}</span>
                      </div>
                    )}
                    {todayLog.bodyMission && (
                      <div className="p-2.5 bg-[#111318]/70 border border-[#22C55E]/30 rounded-xl">
                        <span className="text-[10px] text-[#22C55E] font-bold uppercase block">● Body</span>
                        <span className="text-[#F8FAFC] truncate block mt-0.5">{todayLog.bodyMission}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {!editingMissions && (
            <button
              onClick={() => onSelectTab && onSelectTab('lockin')}
              className="py-3 px-6 bg-gradient-to-r from-[#06B6D4] via-[#4F7CFF] to-[#8B5CF6] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#06B6D4]/25 flex items-center gap-2 transition shrink-0"
            >
              <Zap className="w-4 h-4 fill-current text-white" />
              START FOCUS
            </button>
          )}
        </div>
      </div>

      {/* Inline Task Form */}
      {showAddTask && (
        <form onSubmit={handleCreateTask} className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-5 space-y-3 animate-fadeIn">
          <span className="text-xs font-bold text-white uppercase">New Task Entry</span>
          <input
            type="text"
            required
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full bg-[#111318] border border-[#2B3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <label className="block text-[#A7AFBF] mb-1">Category</label>
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as CategoryType)}
                className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="Academics">Academics</option>
                <option value="Career">Career</option>
                <option value="Body">Body</option>
                <option value="Mind">Mind</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-[#A7AFBF] mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as PriorityType)}
                className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[#A7AFBF] mb-1">Duration (m)</label>
              <input
                type="number"
                min="5"
                max="480"
                value={taskDuration}
                onChange={(e) => setTaskDuration(Number(e.target.value))}
                className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2.5 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[#A7AFBF] mb-1">Deadline</label>
              <input
                type="text"
                placeholder="e.g. 18:00"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2.5 py-2 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="py-2 px-4 bg-[#4F7CFF] text-white font-bold text-xs rounded-xl"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className="py-2 px-4 bg-[#20242E] text-[#A7AFBF] text-xs rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 3. TODAY'S PLAN Task List */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B3040] pb-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
            TODAY'S PLAN
          </h3>
          <span className="text-xs font-mono font-bold text-[#A7AFBF]">
            {completedTasksCount} / {tasks.length} Completed
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A7AFBF] border border-dashed border-[#2B3040] rounded-xl">
            No tasks planned for today yet. Click '+ Add Task' above.
          </div>
        ) : (
          <div className="divide-y divide-[#2B3040]/60">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`py-3.5 px-2 flex items-center justify-between transition-all hover:bg-[#20242E]/50 rounded-xl ${
                  task.completed ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id)} className="shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#A7AFBF] hover:text-white" />
                    )}
                  </button>

                  <div className="flex items-center gap-2.5">
                    {getCategoryDot(task.category)}
                    <div>
                      <span className={`text-xs font-semibold ${task.completed ? 'line-through text-[#A7AFBF]' : 'text-white'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-[#A7AFBF]">
                        <span>{task.category}</span>
                        <span>·</span>
                        <span>{task.estimatedDurationMinutes}m</span>
                        {task.deadline && (
                          <>
                            <span>·</span>
                            <span className="text-[#F97316]">Due {task.deadline}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-[#A7AFBF] hover:text-[#EF4444] rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Evening Reflection */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B3040] pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">Evening Reflection</h3>
          <div className="flex items-center gap-2">
            {reflectionSaved && (
              <span className="text-xs text-[#22C55E] font-mono font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              onClick={handleSaveReflection}
              className="py-1.5 px-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#8B5CF6]/20"
            >
              Save Reflection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[#22C55E] font-bold mb-1">Win Today</label>
            <textarea
              rows={2}
              value={win}
              onChange={(e) => setWin(e.target.value)}
              placeholder="What went exceptionally well?"
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-white focus:outline-none focus:border-[#22C55E]"
            />
          </div>
          <div>
            <label className="block text-[#EF4444] font-bold mb-1">Mistake Today</label>
            <textarea
              rows={2}
              value={mistake}
              onChange={(e) => setMistake(e.target.value)}
              placeholder="Where did discipline falter?"
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-white focus:outline-none focus:border-[#EF4444]"
            />
          </div>
          <div>
            <label className="block text-[#F97316] font-bold mb-1">Time Wasted On</label>
            <textarea
              rows={2}
              value={timeWasted}
              onChange={(e) => setTimeWasted(e.target.value)}
              placeholder="Distractions or lost hours..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-white focus:outline-none focus:border-[#F97316]"
            />
          </div>
          <div>
            <label className="block text-[#4F7CFF] font-bold mb-1">Tomorrow's #1 Focus</label>
            <textarea
              rows={2}
              value={tomorrowMission}
              onChange={(e) => setTomorrowMission(e.target.value)}
              placeholder="Define tomorrow's core objective..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-white focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
