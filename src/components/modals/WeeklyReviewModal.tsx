import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({ isOpen, onClose }) => {
  const { allDayLogs, focusSessions, bodyLogs, academicLogs, saveWeeklyReview, weeklyReviews } = useApp();

  const currentWeekNum = Math.ceil((allDayLogs.length || 1) / 7);

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [q6, setQ6] = useState('');

  if (!isOpen) return null;

  // Calculate 7-day stats
  const recent7 = allDayLogs.slice(-7);
  const avgScore = (
    recent7.reduce((acc, curr) => acc + (curr.score || 0), 0) / (recent7.length || 1)
  ).toFixed(1);

  const totalWorkouts = bodyLogs.slice(-7).filter((b) => b.gymCompleted).length;
  const totalDeepWork = academicLogs.slice(-7).reduce((acc, curr) => acc + (curr.deepWorkHours || 0), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWeeklyReview({
      weekNumber: currentWeekNum,
      startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      averageScore: Number(avgScore),
      totalDeepWorkHours: totalDeepWork,
      totalWorkouts,
      sleepAverage: 8,
      digitalDisciplineAvg: 100,
      focusSessionsCount: focusSessions.length,
      responses: {
        improved: q1,
        wentWrong: q2,
        cause: q3,
        remove: q4,
        increase: q5,
        nextWeekPriority: q6,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-blue-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-3 bg-blue-950 border border-blue-500/40 rounded-2xl text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">
              WEEK {currentWeekNum} MANDATORY REVIEW
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Pause, analyze metrics, confront failures, adjust parameters.
            </p>
          </div>
        </div>

        {/* 7-Day Stats Overview */}
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">AVG SCORE</span>
            <span className="text-blue-400 font-bold text-sm">{avgScore} / 6</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">WORKOUTS</span>
            <span className="text-purple-400 font-bold text-sm">{totalWorkouts} Sessions</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">DEEP WORK</span>
            <span className="text-emerald-400 font-bold text-sm">{totalDeepWork} Hrs</span>
          </div>
        </div>

        {/* 6 Reflection Questions */}
        <form onSubmit={handleSave} className="space-y-4 text-left font-mono text-xs">
          <div>
            <label className="block text-zinc-300 font-bold mb-1">1. What improved this week?</label>
            <textarea
              rows={2}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-bold mb-1">2. What went wrong?</label>
            <textarea
              rows={2}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-bold mb-1">3. What caused the problem?</label>
            <textarea
              rows={2}
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-bold mb-1">4. What should be removed?</label>
            <textarea
              rows={2}
              value={q4}
              onChange={(e) => setQ4(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-300 font-bold mb-1">5. What should be increased?</label>
            <textarea
              rows={2}
              value={q5}
              onChange={(e) => setQ5(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
            />
          </div>
          <div>
            <label className="block text-blue-400 font-bold mb-1">
              6. What is next week's #1 priority?
            </label>
            <textarea
              rows={2}
              value={q6}
              onChange={(e) => setQ6(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow"
          >
            Save Weekly Review
          </button>
        </form>
      </div>
    </div>
  );
};
