import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Code, Brain, Send, Terminal, CheckCircle2 } from 'lucide-react';

export const CareerView: React.FC = () => {
  const { careerLogs, saveCareerLog, currentDateStr } = useApp();

  const todayCareer = careerLogs.find((c) => c.date === currentDateStr) || {
    date: currentDateStr,
    dsaProblemsCount: 0,
    codingHours: 0,
    mlHours: 0,
    applicationsSubmitted: 0,
  };

  const [dsaCount, setDsaCount] = useState<number>(todayCareer.dsaProblemsCount || 0);
  const [codingHours, setCodingHours] = useState<number>(todayCareer.codingHours || 0);
  const [mlHours, setMlHours] = useState<number>(todayCareer.mlHours || 0);
  const [applications, setApplications] = useState<number>(todayCareer.applicationsSubmitted || 0);
  const [notes, setNotes] = useState<string>(todayCareer.notes || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCareerLog({
      date: currentDateStr,
      dsaProblemsCount: Number(dsaCount),
      codingHours: Number(codingHours),
      mlHours: Number(mlHours),
      applicationsSubmitted: Number(applications),
      notes,
    });
  };

  const totalDsaArc = careerLogs.reduce((acc, curr) => acc + (curr.dsaProblemsCount || 0), 0);
  const totalCodingArc = careerLogs.reduce((acc, curr) => acc + (curr.codingHours || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-[#121215] border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            CAREER & TECHNICAL MASTERY
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            "Build real systems. Solve real algorithms." Track DSA problems, ML study, and code.
          </p>
        </div>

        <div className="flex gap-4 font-mono text-xs">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">TOTAL DSA SOLVED</span>
            <span className="text-emerald-400 font-bold text-sm">{totalDsaArc} Problems</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">TOTAL CODING</span>
            <span className="text-blue-400 font-bold text-sm">{totalCodingArc} Hours</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-mono font-bold text-sm text-white uppercase border-b border-zinc-800 pb-3">
          LOG TODAY'S CAREER METRICS ({currentDateStr})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <label className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-400" /> DSA / LeetCode Solved
            </label>
            <input
              type="number"
              value={dsaCount}
              onChange={(e) => setDsaCount(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <label className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-400" /> Coding & Project Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={codingHours}
              onChange={(e) => setCodingHours(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <label className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" /> ML / AI Study Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={mlHours}
              onChange={(e) => setMlHours(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <label className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-1.5">
              <Send className="w-4 h-4 text-amber-400" /> Job Applications
            </label>
            <input
              type="number"
              value={applications}
              onChange={(e) => setApplications(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Project & Technical Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Implemented custom IndexedDB migration logic in ARC OS project"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition shadow"
        >
          Save Career Metrics
        </button>
      </form>
    </div>
  );
};
