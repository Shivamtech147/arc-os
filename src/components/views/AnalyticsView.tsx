import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Zap, Dumbbell, BookOpen, Flame, Briefcase } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { allDayLogs, focusSessions, academicLogs, bodyLogs, careerLogs, currentStreak, settings } = useApp();
  const [range, setRange] = useState<'weekly' | 'full'>('weekly');

  const sortedLogs = [...allDayLogs].sort((a, b) => a.date.localeCompare(b.date));
  const recentLogs = range === 'weekly' ? sortedLogs.slice(-7) : sortedLogs.slice(-30);

  const chartData = recentLogs.map((l) => {
    const acad = academicLogs.find((a) => a.date === l.date);
    const body = bodyLogs.find((b) => b.date === l.date);
    const career = careerLogs.find((c) => c.date === l.date);

    return {
      date: l.date.substring(5),
      score: l.score,
      studyHours: acad?.studyHours || 0,
      gymDone: body?.gymCompleted ? 1 : 0,
      dsaSolved: career?.dsaProblemsCount || 0,
    };
  });

  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.actualMinutes || 0), 0);
  const totalFocusHours = Math.round(totalFocusMinutes / 60);

  const totalStudyHours = academicLogs.reduce((acc, curr) => acc + (curr.studyHours || 0), 0);
  const totalGymSessions = bodyLogs.filter((b) => b.gymCompleted).length;
  const totalDsaCount = careerLogs.reduce((acc, curr) => acc + (curr.dsaProblemsCount || 0), 0);

  // Heatmap calculation (90 Days grid)
  const totalDays = settings.totalDays || 90;
  const startDate = new Date(settings.startDate);
  const heatmapGrid = Array.from({ length: totalDays }, (_, idx) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];
    const dayLog = allDayLogs.find((l) => l.date === dateStr);
    const score = dayLog?.score || 0;

    let intensityClass = 'bg-[#20242E] border-[#2B3040]';
    if (score >= 5) intensityClass = 'bg-[#22C55E] border-[#22C55E]/60';
    else if (score === 4) intensityClass = 'bg-[#4F7CFF] border-[#4F7CFF]/60';
    else if (score === 3) intensityClass = 'bg-[#8B5CF6] border-[#8B5CF6]/60';
    else if (score > 0) intensityClass = 'bg-[#F97316] border-[#F97316]/60';

    return { dayNumber: idx + 1, dateStr, score, intensityClass };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-[#F8FAFC] pb-12">
      <div className="bg-[#191C24] border border-[#A855F7]/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#A855F7]" />
            ANALYTICS & METRICS
          </h2>
          <p className="text-xs text-[#A7AFBF] mt-0.5">
            Empirical data visualization across Academics, Body, Career, and Discipline.
          </p>
        </div>

        <div className="flex bg-[#111318] border border-[#2B3040] p-1 rounded-xl font-mono text-xs">
          <button
            onClick={() => setRange('weekly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              range === 'weekly' ? 'bg-[#4F7CFF] text-white' : 'text-[#A7AFBF]'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setRange('full')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              range === 'full' ? 'bg-[#4F7CFF] text-white' : 'text-[#A7AFBF]'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* KPI CARDS WITH CATEGORY COLORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#191C24] border border-[#EC4899]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#EC4899] font-bold uppercase flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> STREAK
          </span>
          <div className="text-2xl font-extrabold text-white">{currentStreak} Days</div>
        </div>

        <div className="bg-[#191C24] border border-[#06B6D4]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#06B6D4] font-bold uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> DEEP WORK
          </span>
          <div className="text-2xl font-extrabold text-white">{totalFocusHours} Hrs</div>
        </div>

        <div className="bg-[#191C24] border border-[#4F7CFF]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#4F7CFF] font-bold uppercase flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> STUDY HOURS
          </span>
          <div className="text-2xl font-extrabold text-white">{totalStudyHours} Hrs</div>
        </div>

        <div className="bg-[#191C24] border border-[#22C55E]/30 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#22C55E] font-bold uppercase flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" /> WORKOUTS
          </span>
          <div className="text-2xl font-extrabold text-white">{totalGymSessions} Sessions</div>
        </div>
      </div>

      {/* SCORE & STUDY CHART */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <h3 className="font-mono font-extrabold text-sm text-white uppercase flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#4F7CFF]" /> DAILY DISCIPLINE SCORE (BLUE) & STUDY HOURS (VIOLET)
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B3040" />
              <XAxis dataKey="date" stroke="#A7AFBF" fontSize={11} />
              <YAxis domain={[0, 6]} stroke="#A7AFBF" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#191C24', borderColor: '#2B3040', color: '#fff' }}
              />
              <Bar dataKey="score" fill="#4F7CFF" radius={[4, 4, 0, 0]} name="Score (0-6)" />
              <Bar dataKey="studyHours" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Study (Hrs)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 90-DAY ACTIVITY HEATMAP */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B3040] pb-3">
          <h3 className="font-mono font-extrabold text-sm text-white uppercase">
            90-DAY ACTIVITY HEATMAP
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#A7AFBF]">
            <span>Low</span>
            <span className="w-2.5 h-2.5 rounded bg-[#F97316]"></span>
            <span className="w-2.5 h-2.5 rounded bg-[#8B5CF6]"></span>
            <span className="w-2.5 h-2.5 rounded bg-[#4F7CFF]"></span>
            <span className="w-2.5 h-2.5 rounded bg-[#22C55E]"></span>
            <span>High</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 font-mono">
          {heatmapGrid.map((h) => (
            <div
              key={h.dayNumber}
              title={`Day ${h.dayNumber} (${h.dateStr}): Score ${h.score}/6`}
              className={`h-7 rounded-md border flex items-center justify-center text-[10px] text-white font-bold transition-all ${h.intensityClass}`}
            >
              {h.dayNumber}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
