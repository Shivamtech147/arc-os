import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicSubject } from '../../types';
import { BookOpen, Plus, Trash2, Clock, Award, Calendar } from 'lucide-react';

export const AcademicsView: React.FC = () => {
  const { academicLogs, saveAcademicLog, subjects, saveSubject, deleteSubject, currentDateStr } = useApp();

  const todayAcademic = academicLogs.find((a) => a.date === currentDateStr) || {
    date: currentDateStr,
    studyHours: 0,
    deepWorkHours: 0,
    revisionHours: 0,
  };

  const [studyHours, setStudyHours] = useState<number>(todayAcademic.studyHours || 0);
  const [deepWorkHours, setDeepWorkHours] = useState<number>(todayAcademic.deepWorkHours || 0);
  const [revisionHours, setRevisionHours] = useState<number>(todayAcademic.revisionHours || 0);
  const [notes, setNotes] = useState<string>(todayAcademic.notes || '');

  // Subject Modal state
  const [showSubModal, setShowSubModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subTargetHours, setSubTargetHours] = useState(5);
  const [subExamDate, setSubExamDate] = useState('');

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAcademicLog({
      date: currentDateStr,
      studyHours: Number(studyHours),
      deepWorkHours: Number(deepWorkHours),
      revisionHours: Number(revisionHours),
      notes,
    });
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    await saveSubject({
      id: 'sub-' + Date.now(),
      name: subName.trim(),
      targetHoursPerWeek: Number(subTargetHours),
      upcomingExamDate: subExamDate || undefined,
    });
    setSubName('');
    setShowSubModal(false);
  };

  const totalStudyWeek = academicLogs.slice(0, 7).reduce((acc, curr) => acc + (curr.studyHours || 0), 0);
  const totalDeepWorkWeek = academicLogs.slice(0, 7).reduce((acc, curr) => acc + (curr.deepWorkHours || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-[#121215] border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            ACADEMIC COMMAND & DEEP WORK TRACKER
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            "Deep work is the superpower of the 21st century." Track hours, subjects, and exams.
          </p>
        </div>

        <div className="flex gap-4 font-mono text-xs">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">7-DAY STUDY</span>
            <span className="text-blue-400 font-bold text-sm">{totalStudyWeek} Hours</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-zinc-500 text-[10px] block font-bold">7-DAY DEEP WORK</span>
            <span className="text-emerald-400 font-bold text-sm">{totalDeepWorkWeek} Hours</span>
          </div>
        </div>
      </div>

      {/* Log Today's Study Sessions */}
      <form onSubmit={handleSaveLog} className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-mono font-bold text-sm text-white uppercase border-b border-zinc-800 pb-3">
          LOG TODAY'S ACADEMIC METRICS ({currentDateStr})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 font-bold mb-1">Total Study Hours</label>
            <input
              type="number"
              step="0.5"
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-blue-400 font-bold mb-1">Deep Work Hours</label>
            <input
              type="number"
              step="0.5"
              value={deepWorkHours}
              onChange={(e) => setDeepWorkHours(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-emerald-400 font-bold mb-1">Revision Hours</label>
            <input
              type="number"
              step="0.5"
              value={revisionHours}
              onChange={(e) => setRevisionHours(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Study Notes / Output</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Revised Operating Systems Memory Management, solved 10 practice problems"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl transition shadow"
        >
          Save Academic Log
        </button>
      </form>

      {/* Academic Subjects Manager */}
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="font-mono font-bold text-base text-white">CONFIGURED SUBJECTS</h3>
          <button
            onClick={() => setShowSubModal(true)}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-400">No subjects configured yet.</p>
            <button onClick={() => setShowSubModal(true)} className="text-xs font-mono text-blue-400 hover:underline">
              + Add First Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-white">{sub.name}</h4>
                  <button onClick={() => deleteSubject(sub.id)} className="p-1 text-zinc-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-mono text-zinc-400 space-y-1">
                  <div>Target: <span className="text-white font-bold">{sub.targetHoursPerWeek} hrs/week</span></div>
                  {sub.upcomingExamDate && (
                    <div className="text-amber-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Exam: {sub.upcomingExamDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSubject} className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold font-mono text-white">Add Academic Subject</h3>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Target Hours / Week</label>
              <input
                type="number"
                value={subTargetHours}
                onChange={(e) => setSubTargetHours(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Upcoming Exam Date (Optional)</label>
              <input
                type="date"
                value={subExamDate}
                onChange={(e) => setSubExamDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-mono text-xs font-bold rounded-lg">
                Save Subject
              </button>
              <button type="button" onClick={() => setShowSubModal(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 font-mono text-xs rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
