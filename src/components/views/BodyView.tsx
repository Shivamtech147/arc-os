import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Dumbbell, Moon, Flame, Droplets, Scale, Footprints } from 'lucide-react';

export const BodyView: React.FC = () => {
  const { bodyLogs, saveBodyLog, currentDateStr } = useApp();

  const todayBody = bodyLogs.find((b) => b.date === currentDateStr) || {
    date: currentDateStr,
    gymCompleted: false,
  };

  const [weight, setWeight] = useState<number | ''>(todayBody.weightKg || '');
  const [gymCompleted, setGymCompleted] = useState<boolean>(todayBody.gymCompleted || false);
  const [steps, setSteps] = useState<number | ''>(todayBody.stepsCount || '');
  const [sleep, setSleep] = useState<number | ''>(todayBody.sleepHours || '');
  const [protein, setProtein] = useState<number | ''>(todayBody.proteinGrams || '');
  const [water, setWater] = useState<number | ''>(todayBody.waterLiters || '');
  const [notes, setNotes] = useState<string>(todayBody.notes || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBodyLog({
      date: currentDateStr,
      weightKg: weight !== '' ? Number(weight) : undefined,
      gymCompleted,
      stepsCount: steps !== '' ? Number(steps) : undefined,
      sleepHours: sleep !== '' ? Number(sleep) : undefined,
      proteinGrams: protein !== '' ? Number(protein) : undefined,
      waterLiters: water !== '' ? Number(water) : undefined,
      notes,
    });
  };

  const recentLogs = [...bodyLogs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const avgWeight = (
    recentLogs.filter((l) => l.weightKg).reduce((acc, curr) => acc + (curr.weightKg || 0), 0) /
      (recentLogs.filter((l) => l.weightKg).length || 1)
  ).toFixed(1);

  const avgSleep = (
    recentLogs.filter((l) => l.sleepHours).reduce((acc, curr) => acc + (curr.sleepHours || 0), 0) /
      (recentLogs.filter((l) => l.sleepHours).length || 1)
  ).toFixed(1);

  const totalGymWeek = recentLogs.filter((l) => l.gymCompleted).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-[#F8FAFC] pb-12">
      <div className="bg-[#191C24] border border-[#22C55E]/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-[#22C55E]" />
            BODY & PHYSICAL RECOVERY
          </h2>
          <p className="text-xs text-[#A7AFBF] mt-0.5 font-medium">
            "Sleep is training. Nutrition is fuel." Track weight trends, workout consistency, and sleep.
          </p>
        </div>

        <div className="flex gap-3 font-mono text-xs">
          <div className="p-3 bg-[#111318] border border-[#2B3040] rounded-xl text-center min-w-[90px]">
            <span className="text-[#A7AFBF] text-[10px] block font-bold">AVG WEIGHT</span>
            <span className="text-white font-bold text-sm">{avgWeight !== '0.0' ? `${avgWeight} kg` : 'N/A'}</span>
          </div>
          <div className="p-3 bg-[#111318] border border-[#22C55E]/30 rounded-xl text-center min-w-[90px]">
            <span className="text-[#A7AFBF] text-[10px] block font-bold">GYM</span>
            <span className="text-[#22C55E] font-bold text-sm">{totalGymWeek} / 7 Days</span>
          </div>
          <div className="p-3 bg-[#111318] border border-[#06B6D4]/30 rounded-xl text-center min-w-[90px]">
            <span className="text-[#A7AFBF] text-[10px] block font-bold">SLEEP</span>
            <span className="text-[#06B6D4] font-bold text-sm">{avgSleep !== '0.0' ? `${avgSleep} hrs` : 'N/A'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-6 shadow-md">
        <h3 className="font-mono font-bold text-sm text-[#22C55E] uppercase border-b border-[#2B3040] pb-3">
          LOG TODAY'S BODY METRICS ({currentDateStr})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#111318] border border-[#2B3040] rounded-xl space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#22C55E]" /> Body Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value !== '' ? Number(e.target.value) : '')}
              placeholder="e.g. 74.5"
              className="w-full bg-[#191C24] border border-[#2B3040] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-[#111318] border border-[#2B3040] rounded-xl space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-[#22C55E]" /> Workout / Gym Today
            </label>
            <button
              type="button"
              onClick={() => setGymCompleted(!gymCompleted)}
              className={`w-full py-2 px-3 rounded-lg font-mono text-xs font-bold border transition ${
                gymCompleted
                  ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]'
                  : 'bg-[#191C24] text-[#A7AFBF] border-[#2B3040]'
              }`}
            >
              {gymCompleted ? '✓ Workout Complete Today' : 'Workout Not Done Today'}
            </button>
          </div>

          <div className="p-4 bg-[#111318] border border-[#2B3040] rounded-xl space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-[#06B6D4]" /> Sleep Duration (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(e.target.value !== '' ? Number(e.target.value) : '')}
              placeholder="e.g. 8.0"
              className="w-full bg-[#191C24] border border-[#2B3040] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-[#111318] border border-[#2B3040] rounded-xl space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F97316]" /> Protein Intake (Grams)
            </label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value !== '' ? Number(e.target.value) : '')}
              placeholder="e.g. 160"
              className="w-full bg-[#191C24] border border-[#2B3040] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-[#111318] border border-[#2B3040] rounded-xl space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#38BDF8]" /> Water Intake (Liters)
            </label>
            <input
              type="number"
              step="0.5"
              value={water}
              onChange={(e) => setWater(e.target.value !== '' ? Number(e.target.value) : '')}
              placeholder="e.g. 3.5"
              className="w-full bg-[#191C24] border border-[#2B3040] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-[#111318] border border-[#2B3040] rounded-xl space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-[#22C55E]" /> Steps Count
            </label>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value !== '' ? Number(e.target.value) : '')}
              placeholder="e.g. 10000"
              className="w-full bg-[#191C24] border border-[#2B3040] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#A7AFBF] mb-1">Workout Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes..."
            className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#22C55E]/20 transition"
        >
          Save Body Metrics
        </button>
      </form>
    </div>
  );
};
