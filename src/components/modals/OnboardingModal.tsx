import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Check, ArrowRight } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [userName, setUserName] = useState('Operator');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(90);
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepTarget, setSleepTarget] = useState(8);
  const [studyTarget, setStudyTarget] = useState(4);
  const [careerTarget, setCareerTarget] = useState(3);
  const [gymTarget, setGymTarget] = useState(5);

  if (settings.onboardingCompleted) return null;

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      userName: userName.trim() || 'Operator',
      startDate,
      totalDays: Number(duration),
      wakeTime,
      sleepTargetHours: Number(sleepTarget),
      studyTargetHours: Number(studyTarget),
      careerTargetHours: Number(careerTarget),
      gymTargetSessions: Number(gymTarget),
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-blue-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative text-left">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-3 bg-blue-950 border border-blue-500/40 rounded-2xl text-blue-400">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold font-mono text-white tracking-wider">
              ARC OS — INITIAL SETUP
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Initialize your 90-day Winter Arc command center parameters.
            </p>
          </div>
        </div>

        <form onSubmit={handleCompleteOnboarding} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-300 font-bold mb-1">1. Your Name / Call-sign</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">2. Winter Arc Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">3. Duration (Days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">4. Target Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">5. Target Sleep (Hours)</label>
              <input
                type="number"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">6. Study Target (Hrs/Day)</label>
              <input
                type="number"
                value={studyTarget}
                onChange={(e) => setStudyTarget(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">7. Career Target (Hrs/Day)</label>
              <input
                type="number"
                value={careerTarget}
                onChange={(e) => setCareerTarget(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">8. Gym Sessions / Wk</label>
              <input
                type="number"
                value={gymTarget}
                onChange={(e) => setGymTarget(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-extrabold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 mt-4"
          >
            INITIALIZE ARC OS COMMAND CENTER <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
