import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Layout';
import {
  Zap,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Dumbbell,
  Brain,
  Flame,
  Clock,
  Code
} from 'lucide-react';

interface DashboardViewProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenDontFeelLike: () => void;
  onOpenEmergencyReset: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  onOpenDontFeelLike,
  onOpenEmergencyReset
}) => {
  const {
    dayNumber,
    settings,
    todayLog,
    todayScore,
    scoreLabel,
    habits,
    toggleHabit,
    tasks,
    user,
    focusSessions,
    academicLogs,
    careerLogs,
    bodyLogs,
    currentStreak,
    currentDateStr
  } = useApp();

  const formatDateLabel = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const userName = user?.displayName?.split(' ')[0]?.toUpperCase() || 'CHAMPION';

  // Category specific real metrics calculation for today
  const todayAcademic = academicLogs.find((a) => a.date === currentDateStr);
  const todayStudyHours = todayAcademic?.studyHours || 0;
  const todayDeepWork = todayAcademic?.deepWorkHours || 0;

  const todayCareer = careerLogs.find((c) => c.date === currentDateStr);
  const todayDsa = todayCareer?.dsaProblemsCount || 0;
  const todayCodingHours = todayCareer?.codingHours || 0;

  const todayBody = bodyLogs.find((b) => b.date === currentDateStr);
  const gymDone = todayBody?.gymCompleted || false;
  const todaySteps = todayBody?.stepsCount || 0;

  const journalDone = todayLog.habitsCompleted['habit-journal'] || false;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#F8FAFC]">
      {/* 1. Dashboard Hero Section with Blue-Purple Atmosphere */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#191C24] via-[#20242E] to-[#191C24] border border-[#2B3040] p-6 md:p-8 shadow-xl">
        {/* Subtle background atmosphere glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#4F7CFF]/20 via-[#8B5CF6]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#8B5CF6] uppercase">
                {getTimeGreeting()}, {userName}
              </span>
              <p className="text-sm font-medium text-[#A7AFBF] mt-0.5">{formatDateLabel()}</p>
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-mono text-[#A7AFBF] font-semibold uppercase tracking-wider block mb-1">
                YOUR FOCUS
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {todayLog.mainMission || (
                  <span className="text-[#A7AFBF] italic text-base">
                    No primary focus set for today yet.
                  </span>
                )}
              </h2>
            </div>

            <button
              onClick={() => onSelectTab(todayLog.mainMission ? 'lockin' : 'today')}
              className="py-2 px-4 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] hover:from-[#3B66E6] hover:to-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#4F7CFF]/25 flex items-center gap-2 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-white" />
              {todayLog.mainMission ? 'Continue Focus' : 'Set Today\'s Focus'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Today's Score Badge */}
          <div className="bg-[#111318]/80 border border-[#2B3040] backdrop-blur-md rounded-2xl p-5 text-center min-w-[150px] shrink-0 self-stretch md:self-auto flex flex-col justify-center items-center shadow-inner">
            <span className="text-4xl font-extrabold font-mono bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
              {todayScore} / 6
            </span>
            <span className="text-[10px] font-mono font-bold text-[#A7AFBF] uppercase tracking-wider mt-1">
              TODAY'S SCORE
            </span>
            <span className="text-xs font-semibold text-[#22C55E] mt-0.5">
              {scoreLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ACADEMICS CARD (Blue/Violet Identity) */}
        <div
          onClick={() => onSelectTab('academics')}
          className="bg-gradient-to-b from-[#191C24] to-[#191C24]/80 border border-[#4F7CFF]/30 hover:border-[#4F7CFF] rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#4F7CFF]/10 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#4F7CFF]/15 border border-[#4F7CFF]/30 text-[#4F7CFF]">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#4F7CFF] bg-[#4F7CFF]/10 px-2 py-0.5 rounded border border-[#4F7CFF]/20">
              Academics
            </span>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-white font-mono block">
              {todayStudyHours > 0 ? `${todayStudyHours}h` : '0h'}
            </span>
            <span className="text-xs text-[#A7AFBF]">Target: 4h study</span>
          </div>

          <div className="w-full bg-[#20242E] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (todayStudyHours / 4) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* CAREER CARD (Orange/Pink Identity) */}
        <div
          onClick={() => onSelectTab('career')}
          className="bg-gradient-to-b from-[#191C24] to-[#191C24]/80 border border-[#F97316]/30 hover:border-[#F97316] rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#F97316]/10 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316]">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded border border-[#F97316]/20">
              Career
            </span>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-white font-mono block">
              {todayDsa} DSA
            </span>
            <span className="text-xs text-[#A7AFBF]">
              {todayCodingHours > 0 ? `${todayCodingHours}h coding session` : 'No coding logged'}
            </span>
          </div>

          <div className="w-full bg-[#20242E] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F97316] to-[#EC4899] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (todayDsa / 3) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* BODY CARD (Green/Cyan Identity) */}
        <div
          onClick={() => onSelectTab('body')}
          className="bg-gradient-to-b from-[#191C24] to-[#191C24]/80 border border-[#22C55E]/30 hover:border-[#22C55E] rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#22C55E]/10 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
              Body
            </span>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-white font-mono flex items-center gap-1.5">
              Workout {gymDone ? <span className="text-[#22C55E] text-lg">✓</span> : <span className="text-[#A7AFBF] text-sm">--</span>}
            </span>
            <span className="text-xs text-[#A7AFBF]">
              {todaySteps > 0 ? `${todaySteps.toLocaleString()} steps` : 'Log physical metrics'}
            </span>
          </div>

          <div className="w-full bg-[#20242E] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] h-full rounded-full transition-all"
              style={{ width: gymDone ? '100%' : '20%' }}
            ></div>
          </div>
        </div>

        {/* MIND CARD (Purple Identity) */}
        <div
          onClick={() => onSelectTab('mind')}
          className="bg-gradient-to-b from-[#191C24] to-[#191C24]/80 border border-[#8B5CF6]/30 hover:border-[#8B5CF6] rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#8B5CF6]/10 group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/20">
              Mind
            </span>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-white font-mono flex items-center gap-1.5">
              Journal {journalDone ? <span className="text-[#8B5CF6] text-lg">✓</span> : <span className="text-[#A7AFBF] text-sm">--</span>}
            </span>
            <span className="text-xs text-[#A7AFBF]">Digital discipline active</span>
          </div>

          <div className="w-full bg-[#20242E] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] h-full rounded-full transition-all"
              style={{ width: journalDone ? '100%' : '30%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. Core Habits Checklist */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B3040] pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight">Today's Non-Negotiable Habits</h3>
          <span className="text-xs text-[#A7AFBF] font-mono font-semibold">
            {Object.values(todayLog.habitsCompleted || {}).filter(Boolean).length} / {habits.length} Complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {habits.map((habit) => {
            const isDone = !!todayLog.habitsCompleted[habit.id];
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  isDone
                    ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-white'
                    : 'bg-[#20242E]/70 border-[#2B3040] hover:border-[#4F7CFF]/50 text-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#A7AFBF] shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isDone ? 'line-through text-[#A7AFBF]' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                {habit.minimumVersion && !isDone && (
                  <span className="text-[10px] font-mono text-[#A7AFBF] bg-[#111318] px-2 py-0.5 rounded border border-[#2B3040]">
                    Min: {habit.minimumVersion}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Primary Actions Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => onSelectTab('lockin')}
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#06B6D4] via-[#4F7CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#06B6D4]/20"
        >
          <Zap className="w-4 h-4 text-white fill-current" />
          Start Focus Session
        </button>

        <button
          onClick={onOpenDontFeelLike}
          className="py-3.5 px-4 bg-[#20242E] hover:bg-[#282D3A] text-[#A7AFBF] hover:text-white border border-[#2B3040] text-xs font-semibold rounded-xl transition"
        >
          I don't feel like working
        </button>

        <button
          onClick={onOpenEmergencyReset}
          className="py-3.5 px-4 bg-[#20242E] hover:bg-[#282D3A] text-[#EF4444] border border-[#EF4444]/30 text-xs font-semibold rounded-xl transition"
        >
          Emergency Reset
        </button>
      </div>

      {/* Footer Streak Summary */}
      <div className="pt-4 border-t border-[#2B3040] flex items-center justify-between text-xs text-[#A7AFBF] font-mono">
        <span>Day {dayNumber} of {settings.totalDays || 90}</span>
        <span className="text-[#22C55E] font-bold">{currentStreak} day streak</span>
      </div>
    </div>
  );
};
