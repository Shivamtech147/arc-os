import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Zap,
  BookOpen,
  Briefcase,
  Dumbbell,
  Brain,
  Smartphone,
  Trophy,
  AlertTriangle,
  Target,
  Sparkles
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string; // e.g. "08:30" or "10:00"
  timestampMs: number;
  title: string;
  subtitle?: string;
  category: 'academics' | 'body' | 'career' | 'mind' | 'digital' | 'sleep';
  typeLabel: string;
  durationMinutes?: number;
}

export const DailyPerformanceTimeline: React.FC = () => {
  const {
    todayLog,
    tasks,
    focusSessions,
    habits,
    bodyLogs,
    academicLogs,
    careerLogs,
    digitalLogs,
    journalEntries,
    currentDateStr,
    todayScore,
    settings,
  } = useApp();

  // Extract recorded timeline events for currentDateStr
  const timelineEvents: TimelineEvent[] = React.useMemo(() => {
    const events: TimelineEvent[] = [];

    // 1. Focus Sessions
    const todaySessions = focusSessions.filter((s) => {
      const sDate = s.timestamp ? s.timestamp.split('T')[0] : '';
      return sDate === currentDateStr;
    });

    todaySessions.forEach((s) => {
      const dateObj = new Date(s.timestamp);
      const timeStr = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '12:00';
      
      const cat: TimelineEvent['category'] = 'academics';

      events.push({
        id: s.id,
        time: timeStr,
        timestampMs: !isNaN(dateObj.getTime()) ? dateObj.getTime() : 0,
        title: s.mission || 'Focus Work Session',
        subtitle: `${s.durationMinutes}m duration (${s.status})`,
        category: cat,
        typeLabel: 'Focus Block',
        durationMinutes: s.durationMinutes,
      });
    });

    // 2. Completed Tasks
    const completedTasks = tasks.filter((t) => t.completed);
    completedTasks.forEach((t) => {
      const dateObj = t.completedAt ? new Date(t.completedAt) : new Date();
      const timeStr = t.completedAt && !isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '14:00';

      events.push({
        id: t.id,
        time: timeStr,
        timestampMs: t.completedAt && !isNaN(dateObj.getTime()) ? dateObj.getTime() : Date.now(),
        title: t.title,
        subtitle: `Priority: ${t.priority.toUpperCase()}`,
        category: (t.category as any) || 'academics',
        typeLabel: 'Task Completed',
      });
    });

    // 3. Habits Logged
    habits.forEach((h) => {
      if (todayLog.habitsCompleted && todayLog.habitsCompleted[h.id]) {
        let cat: TimelineEvent['category'] = 'mind';
        if (h.category === 'academics') cat = 'academics';
        else if (h.category === 'body') cat = 'body';
        else if (h.category === 'career') cat = 'career';
        else if (h.category === 'digital') cat = 'digital';
        else if (h.category === 'sleep') cat = 'sleep';

        events.push({
          id: `habit-${h.id}`,
          time: '09:00',
          timestampMs: 9 * 3600 * 1000,
          title: h.title,
          subtitle: 'Habit Executed',
          category: cat,
          typeLabel: 'Habit',
        });
      }
    });

    // 4. Workout (Body Log)
    const todayBody = bodyLogs.find((b) => b.date === currentDateStr);
    if (todayBody && todayBody.gymCompleted) {
      events.push({
        id: 'body-workout',
        time: '16:00',
        timestampMs: 16 * 3600 * 1000,
        title: 'Gym & Physical Training Workout',
        subtitle: todayBody.stepsCount ? `${todayBody.stepsCount.toLocaleString()} steps logged` : 'Gym session completed',
        category: 'body',
        typeLabel: 'Workout',
      });
    }

    // 5. Academic Study Log
    const todayAcad = academicLogs.find((a) => a.date === currentDateStr);
    if (todayAcad && (todayAcad.studyHours || todayAcad.deepWorkHours)) {
      events.push({
        id: 'acad-log',
        time: '11:00',
        timestampMs: 11 * 3600 * 1000,
        title: `Academic Study: ${todayAcad.studyHours || todayAcad.deepWorkHours}h`,
        subtitle: todayAcad.notes ? `Notes: ${todayAcad.notes}` : 'Deep study block recorded',
        category: 'academics',
        typeLabel: 'Study Log',
      });
    }

    // 6. Career Log (DSA / Projects)
    const todayCareer = careerLogs.find((c) => c.date === currentDateStr);
    if (todayCareer && (todayCareer.dsaProblemsCount || todayCareer.codingHours)) {
      events.push({
        id: 'career-log',
        time: '18:00',
        timestampMs: 18 * 3600 * 1000,
        title: `Career & DSA: ${todayCareer.dsaProblemsCount || 0} Problems Solved`,
        subtitle: todayCareer.codingHours ? `${todayCareer.codingHours}h coding & project execution` : 'DSA problem solving session',
        category: 'career',
        typeLabel: 'Career Log',
      });
    }

    // 7. Journal Entry
    const todayJournals = journalEntries.filter((j) => j.date === currentDateStr);
    todayJournals.forEach((j) => {
      events.push({
        id: j.id,
        time: j.type === 'morning' ? '07:00' : '21:30',
        timestampMs: j.type === 'morning' ? 7 * 3600 * 1000 : 21.5 * 3600 * 1000,
        title: j.type === 'morning' ? 'Morning Intention Journal' : 'Evening Reflection Journal',
        subtitle: j.morningData?.mainMission || j.eveningData?.win || 'Reflection completed',
        category: 'mind',
        typeLabel: 'Journal',
      });
    });

    // Sort chronologically
    return events.sort((a, b) => a.time.localeCompare(b.time));
  }, [focusSessions, tasks, habits, todayLog, bodyLogs, academicLogs, careerLogs, journalEntries, currentDateStr]);

  // Planned vs Actual metrics
  const plannedHours = settings.studyTargetHours + settings.careerTargetHours; // e.g. 7h target
  const completedFocusMinutes = focusSessions
    .filter((s) => s.timestamp && s.timestamp.split('T')[0] === currentDateStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const completedHours = (completedFocusMinutes / 60);
  const executionPercentage = plannedHours > 0 ? Math.min(100, Math.round((completedHours / plannedHours) * 100)) : 0;
  const deepWorkMinutes = focusSessions
    .filter((s) => s.durationMinutes >= 25 && s.timestamp && s.timestamp.split('T')[0] === currentDateStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;

  const completedHabitsCount = Object.values(todayLog.habitsCompleted || {}).filter(Boolean).length;
  const totalHabitsCount = habits.length;

  // Deterministic Win & Leak
  const biggestWin = React.useMemo(() => {
    if (completedFocusMinutes >= 120) return `Completed ${Math.floor(completedFocusMinutes / 60)}h ${completedFocusMinutes % 60}m of total focus sessions.`;
    if (completedTasksCount > 0) return `Executed ${completedTasksCount} high-priority tasks cleanly.`;
    if (completedHabitsCount >= 4) return `Locked in ${completedHabitsCount} daily core habits.`;
    if (todayLog.mainMission) return `Targeted Main Mission: "${todayLog.mainMission}"`;
    return 'Maintained operational baseline.';
  }, [completedFocusMinutes, completedTasksCount, completedHabitsCount, todayLog.mainMission]);

  const biggestLeak = React.useMemo(() => {
    const todayDig = digitalLogs.find((d) => d.date === currentDateStr);
    if (todayDig && todayDig.unplannedScrollingCount > 0) return `${todayDig.unplannedScrollingCount} unplanned scrolling sessions logged.`;
    if (totalTasksCount - completedTasksCount > 2) return `${totalTasksCount - completedTasksCount} planned tasks remained unexecuted.`;
    if (totalHabitsCount - completedHabitsCount >= 2) return `${totalHabitsCount - completedHabitsCount} core habits were missed.`;
    return 'No critical time leaks detected today.';
  }, [digitalLogs, currentDateStr, totalTasksCount, completedTasksCount, totalHabitsCount, completedHabitsCount]);

  const getCategoryColor = (cat: TimelineEvent['category']) => {
    switch (cat) {
      case 'academics':
        return { text: 'text-[#4F7CFF]', bg: 'bg-[#4F7CFF]/15', border: 'border-[#4F7CFF]/40', dot: 'bg-[#4F7CFF]' };
      case 'body':
        return { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/15', border: 'border-[#22C55E]/40', dot: 'bg-[#22C55E]' };
      case 'career':
        return { text: 'text-[#F97316]', bg: 'bg-[#F97316]/15', border: 'border-[#F97316]/40', dot: 'bg-[#F97316]' };
      case 'mind':
        return { text: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/15', border: 'border-[#8B5CF6]/40', dot: 'bg-[#8B5CF6]' };
      case 'digital':
        return { text: 'text-[#EC4899]', bg: 'bg-[#EC4899]/15', border: 'border-[#EC4899]/40', dot: 'bg-[#EC4899]' };
      case 'sleep':
        return { text: 'text-[#6366F1]', bg: 'bg-[#6366F1]/15', border: 'border-[#6366F1]/40', dot: 'bg-[#6366F1]' };
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Planned vs Actual Execution Banner */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4F7CFF]/10 to-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B3040] pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4F7CFF]" />
              PLANNED VS ACTUAL EXECUTION
            </h3>
            <p className="text-xs text-[#A7AFBF]">Empirical daily work tracking & focus metrics</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <p className="text-[10px] text-[#A7AFBF]">EXECUTION RATE</p>
              <p className="text-lg font-bold text-white">{executionPercentage}%</p>
            </div>
            <div className="w-px h-8 bg-[#2B3040]"></div>
            <div className="text-right">
              <p className="text-[10px] text-[#A7AFBF]">DAILY SCORE</p>
              <p className="text-lg font-bold text-[#22C55E]">{todayScore} / 6</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#20242E] border border-[#2B3040] p-3 rounded-xl">
            <p className="text-[#A7AFBF] text-[10px]">TOTAL FOCUS</p>
            <p className="text-base font-bold text-[#4F7CFF] mt-0.5">
              {Math.floor(completedFocusMinutes / 60)}h {completedFocusMinutes % 60}m
            </p>
          </div>

          <div className="bg-[#20242E] border border-[#2B3040] p-3 rounded-xl">
            <p className="text-[#A7AFBF] text-[10px]">DEEP WORK</p>
            <p className="text-base font-bold text-[#8B5CF6] mt-0.5">
              {Math.floor(deepWorkMinutes / 60)}h {deepWorkMinutes % 60}m
            </p>
          </div>

          <div className="bg-[#20242E] border border-[#2B3040] p-3 rounded-xl">
            <p className="text-[#A7AFBF] text-[10px]">TASKS COMPLETED</p>
            <p className="text-base font-bold text-[#F97316] mt-0.5">
              {completedTasksCount} / {totalTasksCount}
            </p>
          </div>

          <div className="bg-[#20242E] border border-[#2B3040] p-3 rounded-xl">
            <p className="text-[#A7AFBF] text-[10px]">HABITS EXECUTED</p>
            <p className="text-base font-bold text-[#22C55E] mt-0.5">
              {completedHabitsCount} / {totalHabitsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Chronological Timeline */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-5 shadow-xl">
        <h4 className="text-xs font-bold font-mono text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          CHRONOLOGICAL DAY TIMELINE
        </h4>

        {timelineEvents.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#2B3040] rounded-xl text-xs text-[#A7AFBF] font-mono">
            No events tracked yet today. Start a focus session, complete a task, or log a habit to populate your daily timeline.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-[#2B3040] space-y-4">
            {timelineEvents.map((evt) => {
              const theme = getCategoryColor(evt.category);
              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full ${theme.dot} ring-4 ring-[#191C24]`} />

                  {/* Event Card */}
                  <div className={`p-3 rounded-xl border ${theme.bg} ${theme.border} transition flex items-start justify-between gap-3`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-white bg-[#20242E] px-2 py-0.5 rounded border border-[#2B3040]">
                          {evt.time}
                        </span>
                        <span className={`text-[10px] font-mono uppercase font-bold ${theme.text}`}>
                          {evt.typeLabel}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white mt-1">{evt.title}</h5>
                      {evt.subtitle && <p className="text-[11px] text-[#A7AFBF] mt-0.5">{evt.subtitle}</p>}
                    </div>

                    {evt.durationMinutes && (
                      <span className="text-[10px] font-mono px-2 py-1 bg-[#20242E] text-[#A7AFBF] border border-[#2B3040] rounded-lg">
                        {evt.durationMinutes}m
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Day-End Summary Card */}
      <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-5 shadow-xl space-y-4">
        <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2 border-b border-[#2B3040] pb-3">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          TODAY IN NUMBERS & SUMMARY
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Trophy className="w-4 h-4" />
              <span>BIGGEST WIN</span>
            </div>
            <p className="text-emerald-200 font-sans text-xs mt-1">{biggestWin}</p>
          </div>

          <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>BIGGEST LEAK</span>
            </div>
            <p className="text-amber-200 font-sans text-xs mt-1">{biggestLeak}</p>
          </div>
        </div>

        {todayLog.mainMission && (
          <div className="p-3 bg-[#20242E] border border-[#2B3040] rounded-xl text-xs font-mono text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-[#4F7CFF] shrink-0" />
            <div>
              <span className="text-[#A7AFBF] text-[10px]">MAIN MISSION:</span>
              <p className="font-sans font-semibold text-white">{todayLog.mainMission}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
