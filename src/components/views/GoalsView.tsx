import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Goal } from '../../types';
import { Target, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, saveGoal, deleteGoal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [category, setCategory] = useState<'Body' | 'Academics' | 'Career' | 'Mind'>('Body');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [metric, setMetric] = useState('');
  const [target, setTarget] = useState(100);
  const [currentValue, setCurrentValue] = useState(0);
  const [status, setStatus] = useState<Goal['status']>('In Progress');

  const openNewModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setCategory('Body');
    setMetric('');
    setTarget(100);
    setCurrentValue(0);
    setStatus('In Progress');
    setShowModal(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description);
    setCategory(goal.category);
    setStartDate(goal.startDate);
    setEndDate(goal.endDate);
    setMetric(goal.metric);
    setTarget(goal.target);
    setCurrentValue(goal.currentValue);
    setStatus(goal.status);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const goalToSave: Goal = {
      id: editingGoal ? editingGoal.id : 'goal-' + Date.now(),
      category,
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate: endDate || startDate,
      metric: metric || 'Units',
      target: Number(target),
      currentValue: Number(currentValue),
      status,
    };

    await saveGoal(goalToSave);
    setShowModal(false);
  };

  const getCategoryTheme = (cat: Goal['category']) => {
    switch (cat) {
      case 'Academics':
        return {
          border: 'border-[#4F7CFF]/40 hover:border-[#4F7CFF]',
          badge: 'bg-[#4F7CFF]/15 text-[#4F7CFF] border-[#4F7CFF]/30',
          bar: 'bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6]',
          text: 'text-[#4F7CFF]',
        };
      case 'Career':
        return {
          border: 'border-[#F97316]/40 hover:border-[#F97316]',
          badge: 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30',
          bar: 'bg-gradient-to-r from-[#F97316] to-[#EC4899]',
          text: 'text-[#F97316]',
        };
      case 'Body':
        return {
          border: 'border-[#22C55E]/40 hover:border-[#22C55E]',
          badge: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
          bar: 'bg-gradient-to-r from-[#22C55E] to-[#06B6D4]',
          text: 'text-[#22C55E]',
        };
      case 'Mind':
      default:
        return {
          border: 'border-[#8B5CF6]/40 hover:border-[#8B5CF6]',
          badge: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30',
          bar: 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]',
          text: 'text-[#8B5CF6]',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-[#F8FAFC] pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#191C24] border border-[#38BDF8]/30 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-[#38BDF8]" />
            90-DAY GOALS COMMAND
          </h2>
          <p className="text-xs text-[#A7AFBF] mt-0.5">
            High-leverage target metrics categorized by Body, Academics, Career, and Mind.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="py-2.5 px-4 bg-[#38BDF8] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#38BDF8]/20 transition"
        >
          <Plus className="w-4 h-4" /> Create Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-[#191C24] border border-dashed border-[#2B3040] rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm text-[#A7AFBF]">No 90-day targets set yet.</p>
          <button onClick={openNewModal} className="text-xs font-mono text-[#38BDF8] hover:underline font-bold">
            + Define First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progressPercent = Math.min(
              100,
              Math.max(0, Math.round((goal.currentValue / (goal.target || 1)) * 100))
            );
            const theme = getCategoryTheme(goal.category);

            return (
              <div
                key={goal.id}
                className={`bg-[#191C24] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md ${theme.border}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-extrabold ${theme.badge}`}>
                      {goal.category}
                    </span>
                    <h3 className="font-extrabold text-base text-white mt-2">{goal.title}</h3>
                    <p className="text-xs text-[#A7AFBF] mt-1">{goal.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20242E] text-[#A7AFBF] border border-[#2B3040] uppercase shrink-0">
                    {goal.status}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#2B3040]">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#A7AFBF]">
                      Progress: <span className="text-white font-bold">{goal.currentValue}</span> / {goal.target} {goal.metric}
                    </span>
                    <span className={`font-extrabold ${theme.text}`}>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#111318] rounded-full h-2 overflow-hidden border border-[#2B3040]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-[#A7AFBF] pt-1">
                  <span>Target Date: {goal.endDate}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(goal)} className="p-1 hover:text-white transition">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteGoal(goal.id)} className="p-1 hover:text-[#EF4444] transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-[#191C24] border border-[#2B3040] rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl"
          >
            <h3 className="text-lg font-bold font-mono text-white">
              {editingGoal ? 'Edit Goal' : 'New 90-Day Goal'}
            </h3>

            <div>
              <label className="block text-xs text-[#A7AFBF] mb-1">Goal Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bench Press 100kg / 50 DSA Problems"
                className="w-full bg-[#111318] border border-[#2B3040] rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="block text-[#A7AFBF] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2 py-1.5 text-white"
                >
                  <option value="Body">Body</option>
                  <option value="Academics">Academics</option>
                  <option value="Career">Career</option>
                  <option value="Mind">Mind</option>
                </select>
              </div>
              <div>
                <label className="block text-[#A7AFBF] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2 py-1.5 text-white"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Achieved">Achieved</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A7AFBF] mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why does this goal matter for your Winter Arc?"
                className="w-full bg-[#111318] border border-[#2B3040] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <label className="block text-[#A7AFBF] mb-1">Metric Unit</label>
                <input
                  type="text"
                  placeholder="e.g. kg, hrs"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-[#A7AFBF] mb-1">Current</label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-[#A7AFBF] mb-1">Target</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full bg-[#111318] border border-[#2B3040] rounded-lg px-2 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button type="submit" className="flex-1 py-2 bg-[#38BDF8] text-white font-bold text-xs rounded-xl">
                Save Goal
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#20242E] text-[#A7AFBF] text-xs rounded-xl">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
