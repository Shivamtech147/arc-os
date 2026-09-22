import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, BookOpen, Smartphone, ShieldCheck, Play, Pause, RefreshCw } from 'lucide-react';

export const MindView: React.FC = () => {
  const { digitalLogs, saveDigitalLog, currentDateStr } = useApp();

  const todayDigital = digitalLogs.find((d) => d.date === currentDateStr) || {
    date: currentDateStr,
    instagramMinutes: 0,
    youtubeMinutes: 0,
    totalScreenTimeMinutes: 0,
    pornFree: true,
    unplannedScrollingCount: 0,
  };

  const [insta, setInsta] = useState<number>(todayDigital.instagramMinutes || 0);
  const [yt, setYt] = useState<number>(todayDigital.youtubeMinutes || 0);
  const [screenTime, setScreenTime] = useState<number>(todayDigital.totalScreenTimeMinutes || 0);
  const [pornFree, setPornFree] = useState<boolean>(todayDigital.pornFree ?? true);
  const [scrolling, setScrolling] = useState<number>(todayDigital.unplannedScrollingCount || 0);

  // Simple Breathing exercise timer
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathCounter, setBreathCounter] = useState(4);

  const handleSaveDigital = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDigitalLog({
      date: currentDateStr,
      instagramMinutes: Number(insta),
      youtubeMinutes: Number(yt),
      totalScreenTimeMinutes: Number(screenTime),
      pornFree,
      unplannedScrollingCount: Number(scrolling),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-[#121215] border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            MIND & DIGITAL DISCIPLINE
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Mental clarity, emotional control, and digital friction reduction.
          </p>
        </div>
      </div>

      {/* Box Breathing Tool */}
      <div className="bg-[#121215] border border-indigo-500/30 rounded-2xl p-6 text-center space-y-4">
        <h3 className="font-mono font-bold text-sm text-indigo-400 uppercase">
          2-MINUTE BOX BREATHING (4-4-4-4)
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Calm your nervous system before starting a high-leverage Lock-In session.
        </p>

        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500/40 flex flex-col items-center justify-center bg-indigo-950/30">
            <span className="font-mono text-sm font-bold text-indigo-300">{breathPhase}</span>
            <span className="font-mono text-3xl font-extrabold text-white mt-1">4s</span>
          </div>
        </div>
      </div>

      {/* Digital Discipline Tracker Form */}
      <form onSubmit={handleSaveDigital} className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-mono font-bold text-sm text-white uppercase border-b border-zinc-800 pb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          DIGITAL DISCIPLINE LOG ({currentDateStr})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 font-bold mb-1">Instagram Time (Mins)</label>
            <input
              type="number"
              value={insta}
              onChange={(e) => setInsta(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 font-bold mb-1">YouTube Time (Mins)</label>
            <input
              type="number"
              value={yt}
              onChange={(e) => setYt(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 font-bold mb-1">Total Screen Time (Mins)</label>
            <input
              type="number"
              value={screenTime}
              onChange={(e) => setScreenTime(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 font-bold mb-1">Unplanned Scrolling Events</label>
            <input
              type="number"
              value={scrolling}
              onChange={(e) => setScrolling(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-xs font-mono text-zinc-200 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Porn-Free Day Status
            </span>
            <button
              type="button"
              onClick={() => setPornFree(!pornFree)}
              className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                pornFree ? 'bg-emerald-950 text-emerald-400 border-emerald-600' : 'bg-red-950 text-red-400 border-red-600'
              }`}
            >
              {pornFree ? '✓ Clean Day' : 'Relapse Logged'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-xl transition shadow"
        >
          Save Digital Discipline Metrics
        </button>
      </form>
    </div>
  );
};
