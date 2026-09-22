import React, { useState } from 'react';
import { useApp, calculateDayNumber } from '../../context/AppContext';
import { DayLog } from '../../types';
import { CalendarDays, X, CheckCircle2, Zap } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { allDayLogs, settings, currentDateStr, focusSessions } = useApp();
  const [selectedDayLog, setSelectedDayLog] = useState<DayLog | null>(null);

  const totalDays = settings.totalDays || 90;
  const startDate = new Date(settings.startDate);

  // Generate array of 90 days
  const gridDays = Array.from({ length: totalDays }, (_, idx) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];
    const dayLog = allDayLogs.find((l) => l.date === dateStr);
    const isFuture = dateStr > currentDateStr;
    const isToday = dateStr === currentDateStr;

    return {
      dayNumber: idx + 1,
      dateStr,
      dayLog,
      isFuture,
      isToday,
    };
  });

  const getDayColorClass = (d: (typeof gridDays)[0]) => {
    if (d.isFuture) return 'bg-zinc-950/40 border-zinc-800/40 text-zinc-600';
    if (!d.dayLog) return 'bg-zinc-900 border-zinc-800 text-zinc-400';
    const score = d.dayLog.score;
    if (score >= 5) return 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300 font-bold';
    if (score === 4) return 'bg-blue-950/80 border-blue-600/60 text-blue-300 font-bold';
    if (score === 3) return 'bg-amber-950/80 border-amber-600/60 text-amber-300 font-bold';
    return 'bg-red-950/80 border-red-600/60 text-red-300 font-bold';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="bg-[#121215] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            90-DAY WINTER ARC GRID
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Full 90-day consistency heatmap and daily drilldown.
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-emerald-900 border border-emerald-500 rounded"></span> Strong (5-6)
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-900 border border-blue-500 rounded"></span> Acceptable (4)
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-900 border border-amber-500 rounded"></span> Warning (3)
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-900 border border-red-500 rounded"></span> Poor (0-2)
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6">
        <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-10 gap-2 font-mono">
          {gridDays.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => d.dayLog && setSelectedDayLog(d.dayLog)}
              disabled={d.isFuture}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-between h-16 ${getDayColorClass(
                d
              )} ${d.isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <span className="text-[10px] opacity-70">D{d.dayNumber}</span>
              <span className="text-xs">
                {d.isFuture ? '-' : d.dayLog ? `${d.dayLog.score}/6` : '0/6'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDayLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 relative">
            <button
              onClick={() => setSelectedDayLog(null)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold font-mono text-white">
              DAY {selectedDayLog.dayNumber} ({selectedDayLog.date})
            </h3>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 font-mono text-xs">
              <div>
                Score: <span className="text-white font-bold">{selectedDayLog.score}/6</span>
              </div>
              <div>
                Main Mission:{' '}
                <span className="text-blue-400 font-semibold">
                  {selectedDayLog.mainMission || 'None specified'}
                </span>
              </div>
            </div>

            {/* Reflection snippet */}
            {selectedDayLog.reflection && (
              <div className="space-y-2 text-xs font-mono">
                {selectedDayLog.reflection.win && (
                  <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded text-emerald-300">
                    Win: {selectedDayLog.reflection.win}
                  </div>
                )}
                {selectedDayLog.reflection.mistake && (
                  <div className="p-2 bg-red-950/40 border border-red-800/40 rounded text-red-300">
                    Mistake: {selectedDayLog.reflection.mistake}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedDayLog(null)}
              className="w-full py-2 bg-blue-600 text-white font-mono text-xs font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
