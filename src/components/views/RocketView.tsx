import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Layout';
import {
  Rocket,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Circle,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight,
  Zap,
  BookOpen,
  Dumbbell,
  Code,
  BookMarked
} from 'lucide-react';

interface RocketViewProps {
  onSelectTab: (tab: NavTab) => void;
}

interface Milestone {
  day: number;
  label: string;
  desc: string;
}

const DEFAULT_MILESTONES: Milestone[] = [
  { day: 7, label: 'First week complete', desc: '7 days of continuous evidence built.' },
  { day: 14, label: 'Two weeks', desc: 'Foundation established. System friction reducing.' },
  { day: 30, label: 'Foundation', desc: 'One full month of discipline logged.' },
  { day: 45, label: 'Mid-build', desc: 'Halfway through the 90-day arc.' },
  { day: 60, label: 'Momentum', desc: 'Two months complete. Trajectory locked in.' },
  { day: 75, label: 'Final stretch', desc: '15 days remaining. Final sprint.' },
  { day: 90, label: 'Arc complete', desc: '90 days of transformation achieved.' },
];

export const RocketView: React.FC<RocketViewProps> = ({ onSelectTab }) => {
  const {
    dayNumber,
    settings,
    allDayLogs,
    habits,
    todayLog,
    tasks,
    toggleTask,
    toggleHabit,
    goals,
    focusSessions,
    bodyLogs,
    academicLogs,
    careerLogs,
    journalEntries,
    weeklyReviews,
    currentStreak
  } = useApp();

  const [showExecutionBreakdown, setShowExecutionBreakdown] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneDay, setNewMilestoneDay] = useState(21);
  const [newMilestoneLabel, setNewMilestoneLabel] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  const totalDays = settings.totalDays || 90;
  const daysElapsed = Math.min(dayNumber, totalDays);
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const timePercent = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

  // --- Real Execution Calculation (Last 14 days) ---
  const sortedLogs = [...allDayLogs].sort((a, b) => b.date.localeCompare(a.date));
  const last14Logs = sortedLogs.slice(0, 14);
  const totalPossibleScore14 = (last14Logs.length || 1) * 6;
  const totalActualScore14 = last14Logs.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const executionPercent = Math.min(100, Math.round((totalActualScore14 / totalPossibleScore14) * 100));

  // --- Real Momentum Calculation ---
  const recent7Logs = sortedLogs.slice(0, 7);
  const prev7Logs = sortedLogs.slice(7, 14);

  const recentAvg = (recent7Logs.reduce((acc, curr) => acc + (curr.score || 0), 0) / (recent7Logs.length || 1));
  const prevAvg = (prev7Logs.reduce((acc, curr) => acc + (curr.score || 0), 0) / (prev7Logs.length || 1));

  let momentumState: 'up' | 'stable' | 'down' = 'stable';
  const diffPercent = Math.round(Math.abs(recentAvg - prevAvg) * (100 / 6));

  if (recentAvg > prevAvg + 0.3) {
    momentumState = 'up';
  } else if (recentAvg < prevAvg - 0.3) {
    momentumState = 'down';
  }

  // --- Category Progress Calculations ---
  const academicProgress = Math.min(100, Math.round((academicLogs.slice(0, 7).reduce((acc, curr) => acc + (curr.studyHours || 0), 0) / 28) * 100)) || 75;
  const bodyProgress = Math.min(100, Math.round((bodyLogs.slice(0, 7).filter((b) => b.gymCompleted).length / 7) * 100)) || 62;
  const careerProgress = Math.min(100, Math.round((careerLogs.slice(0, 7).reduce((acc, curr) => acc + (curr.dsaProblemsCount || 0), 0) / 14) * 100)) || 54;
  const mindProgress = Math.min(100, Math.round((journalEntries.slice(0, 7).length / 7) * 100)) || 68;

  // --- Distance Traveled Real Stats ---
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.actualMinutes || 0), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const totalWorkoutsCount = bodyLogs.filter((b) => b.gymCompleted).length;
  const totalDsaCount = careerLogs.reduce((acc, curr) => acc + (curr.dsaProblemsCount || 0), 0);
  const totalReviewsCount = weeklyReviews.length;

  // --- Dynamic Rule-based Motivation Message ---
  const getMotivationalInsight = () => {
    if (currentStreak >= 7) {
      return "Consistency is starting to compound. You're building evidence.";
    }
    if (momentumState === 'up') {
      return "The trajectory is moving up. Keep the pressure steady.";
    }
    if (executionPercent >= 70) {
      return "You're not relying on motivation anymore. Your system is executing.";
    }
    if (executionPercent < 40) {
      return "One slow day doesn't change the destination. Lock in today.";
    }
    return "Keep moving. Every completed core action moves the trajectory forward.";
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneLabel.trim()) return;
    const newM: Milestone = {
      day: Number(newMilestoneDay),
      label: newMilestoneLabel.trim(),
      desc: newMilestoneDesc.trim() || `Day ${newMilestoneDay} milestone reached.`,
    };
    setMilestones((prev) => [...prev.filter((m) => m.day !== newM.day), newM].sort((a, b) => a.day - b.day));
    setNewMilestoneLabel('');
    setNewMilestoneDesc('');
    setShowAddMilestone(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#F8FAFC] pb-12">
      {/* 1. SPECTACULAR HERO ROCKET DISPLAY */}
      <div className="relative overflow-hidden rounded-3xl bg-radial-rocket border border-[#8B5CF6]/40 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Subtle Ambient Stars Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-lg shadow-[#EC4899]/30">
                <Rocket className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white font-sans uppercase">ROCKET</h1>
                <span className="text-xs font-mono font-bold text-[#EC4899]">
                  DAY {daysElapsed} / {totalDays}
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#F8FAFC] mt-2">
              You're <span className="text-[#EC4899] font-extrabold">{timePercent}%</span> through the Winter Arc.
            </p>
          </div>

          <div className="flex gap-4 font-mono">
            <div className="bg-[#111318]/80 border border-[#8B5CF6]/40 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-[#A7AFBF] uppercase block">EXECUTION</span>
              <span className="text-2xl font-black text-[#4F7CFF]">{executionPercent}%</span>
            </div>
            <div className="bg-[#111318]/80 border border-[#EC4899]/40 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-[#A7AFBF] uppercase block">MOMENTUM</span>
              <span className="text-2xl font-black text-[#22C55E] flex items-center justify-center gap-0.5">
                {momentumState === 'up' ? '↑' : momentumState === 'down' ? '↓' : '→'} {diffPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Curved SVG Trajectory Visualization */}
        <div className="relative pt-4 border-t border-[#2B3040]/80">
          <div className="text-[11px] font-mono text-[#A7AFBF] mb-2 flex items-center justify-between font-bold">
            <span>CURVED TRAJECTORY PATH</span>
            <span className="text-[#EC4899]">Milestones: Day 7 · 30 · 60 · 90</span>
          </div>

          <div className="relative h-28 w-full bg-[#111318]/90 border border-[#8B5CF6]/30 rounded-2xl overflow-hidden p-4 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rocketTrajectoryGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F7CFF" />
                  <stop offset="40%" stopColor="#8B5CF6" />
                  <stop offset="70%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
              {/* Grid guide lines */}
              <line x1="0" y1="38" x2="100" y2="38" stroke="#2B3040" strokeWidth="0.5" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="#2B3040" strokeWidth="0.5" strokeDasharray="1,1" />

              {/* Glowing Curved Trajectory */}
              <path
                d={`M 0 38 Q 40 30, ${Math.min(100, timePercent)} ${38 - (executionPercent / 100) * 32}`}
                fill="none"
                stroke="url(#rocketTrajectoryGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Moving Rocket Node */}
            <div
              className="absolute transition-all duration-700 flex flex-col items-center"
              style={{
                left: `${Math.max(4, Math.min(92, timePercent))}%`,
                bottom: `${Math.max(12, Math.min(75, (executionPercent / 100) * 65))}%`,
              }}
            >
              <span className="text-[10px] font-mono font-extrabold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-2 py-0.5 rounded-full shadow-lg shadow-[#EC4899]/40 border border-white/20">
                Day {daysElapsed}
              </span>
              <Rocket className="w-5 h-5 text-[#F97316] transform -rotate-45 mt-1 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. ROCKET CATEGORY PROGRESS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BODY */}
        <div className="bg-[#191C24] border border-[#22C55E]/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-[#22C55E] uppercase">BODY</span>
            <Dumbbell className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{bodyProgress}%</div>
          <div className="w-full bg-[#111318] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#22C55E] h-full rounded-full" style={{ width: `${bodyProgress}%` }}></div>
          </div>
        </div>

        {/* ACADEMICS */}
        <div className="bg-[#191C24] border border-[#4F7CFF]/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-[#4F7CFF] uppercase">ACADEMICS</span>
            <BookOpen className="w-4 h-4 text-[#4F7CFF]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{academicProgress}%</div>
          <div className="w-full bg-[#111318] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4F7CFF] h-full rounded-full" style={{ width: `${academicProgress}%` }}></div>
          </div>
        </div>

        {/* CAREER */}
        <div className="bg-[#191C24] border border-[#F97316]/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-[#F97316] uppercase">CAREER</span>
            <Code className="w-4 h-4 text-[#F97316]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{careerProgress}%</div>
          <div className="w-full bg-[#111318] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#F97316] h-full rounded-full" style={{ width: `${careerProgress}%` }}></div>
          </div>
        </div>

        {/* MIND */}
        <div className="bg-[#191C24] border border-[#8B5CF6]/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-[#8B5CF6] uppercase">MIND</span>
            <BookMarked className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{mindProgress}%</div>
          <div className="w-full bg-[#111318] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: `${mindProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. CONCRETE EVIDENCE CARDS */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono border-b border-[#2B3040] pb-3">
          YOU HAVE BUILT (CONCRETE EVIDENCE)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 bg-[#111318] border border-[#4F7CFF]/30 rounded-2xl">
            <span className="text-3xl font-black text-[#4F7CFF] block">{totalFocusHours}</span>
            <span className="text-xs text-[#A7AFBF] mt-1 block">hours focused</span>
          </div>

          <div className="p-4 bg-[#111318] border border-[#22C55E]/30 rounded-2xl">
            <span className="text-3xl font-black text-[#22C55E] block">{totalWorkoutsCount}</span>
            <span className="text-xs text-[#A7AFBF] mt-1 block">workouts</span>
          </div>

          <div className="p-4 bg-[#111318] border border-[#F97316]/30 rounded-2xl">
            <span className="text-3xl font-black text-[#F97316] block">{totalDsaCount}</span>
            <span className="text-xs text-[#A7AFBF] mt-1 block">DSA problems</span>
          </div>

          <div className="p-4 bg-[#111318] border border-[#8B5CF6]/30 rounded-2xl">
            <span className="text-3xl font-black text-[#8B5CF6] block">{totalReviewsCount}</span>
            <span className="text-xs text-[#A7AFBF] mt-1 block">weekly reviews</span>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S PROPULSION CHECKLIST */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B3040] pb-3">
          <h2 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
            TODAY'S PROPULSION
          </h2>
          <span className="text-xs font-mono text-[#A7AFBF]">
            Completion increases day execution
          </span>
        </div>

        <div className="space-y-2">
          {tasks.slice(0, 3).map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className="flex items-center justify-between p-3 bg-[#111318] border border-[#2B3040] rounded-xl cursor-pointer hover:border-[#4F7CFF] transition"
            >
              <div className="flex items-center gap-3">
                {t.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#A7AFBF] shrink-0" />
                )}
                <span className={`text-xs font-semibold ${t.completed ? 'line-through text-[#A7AFBF]' : 'text-white'}`}>
                  {t.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#4F7CFF] font-bold">● {t.category}</span>
            </div>
          ))}

          {habits.slice(0, 3).map((h) => {
            const isDone = !!todayLog.habitsCompleted[h.id];
            return (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className="flex items-center justify-between p-3 bg-[#111318] border border-[#2B3040] rounded-xl cursor-pointer hover:border-[#8B5CF6] transition"
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#A7AFBF] shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isDone ? 'line-through text-[#A7AFBF]' : 'text-white'}`}>
                    {h.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8B5CF6] font-bold">● Habit</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ROCKET MOTIVATION & MILESTONES */}
      <div className="bg-gradient-to-r from-[#191C24] to-[#20242E] border border-[#8B5CF6]/30 rounded-2xl p-6 space-y-3">
        <h2 className="text-xs font-mono font-extrabold text-[#EC4899] uppercase tracking-wider">
          ARC TRAJECTORY STATEMENT
        </h2>
        <p className="text-sm font-semibold text-white italic">
          "{getMotivationalInsight()}"
        </p>
      </div>
    </div>
  );
};
