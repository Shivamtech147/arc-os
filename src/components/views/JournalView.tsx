import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Check, BookMarked } from 'lucide-react';

export const JournalView: React.FC = () => {
  const { journalEntries, saveJournalEntry, currentDateStr } = useApp();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  const morningEntry = journalEntries.find((j) => j.date === currentDateStr && j.type === 'morning') || {
    id: `journal-${currentDateStr}-morning`,
    date: currentDateStr,
    type: 'morning',
    morningData: { mainMission: '', behaviorTarget: '', potentialDerailers: '' },
  };

  const eveningEntry = journalEntries.find((j) => j.date === currentDateStr && j.type === 'evening') || {
    id: `journal-${currentDateStr}-evening`,
    date: currentDateStr,
    type: 'evening',
    eveningData: { win: '', mistake: '', timeWasted: '', lesson: '', tomorrowMission: '' },
  };

  const [m1, setM1] = useState(morningEntry.morningData?.mainMission || '');
  const [m2, setM2] = useState(morningEntry.morningData?.behaviorTarget || '');
  const [m3, setM3] = useState(morningEntry.morningData?.potentialDerailers || '');

  const [e1, setE1] = useState(eveningEntry.eveningData?.win || '');
  const [e2, setE2] = useState(eveningEntry.eveningData?.mistake || '');
  const [e3, setE3] = useState(eveningEntry.eveningData?.timeWasted || '');
  const [e4, setE4] = useState(eveningEntry.eveningData?.lesson || '');
  const [e5, setE5] = useState(eveningEntry.eveningData?.tomorrowMission || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMorning = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveJournalEntry({
      date: currentDateStr,
      type: 'morning',
      morningData: {
        mainMission: m1,
        behaviorTarget: m2,
        potentialDerailers: m3,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveEvening = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveJournalEntry({
      date: currentDateStr,
      type: 'evening',
      eveningData: {
        win: e1,
        mistake: e2,
        timeWasted: e3,
        lesson: e4,
        tomorrowMission: e5,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans text-[#F8FAFC] pb-12">
      {/* Notebook Header with Soft Purple/Blue Ambient Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#191C24] via-[#20242E] to-[#191C24] border border-[#8B5CF6]/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#8B5CF6]/20 via-[#4F7CFF]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">DIGITAL JOURNAL</h1>
              <p className="text-xs text-[#A7AFBF] mt-0.5">
                Morning Intentions & Evening Reflection.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <span className="px-3 py-1 bg-[#22C55E]/20 border border-[#22C55E]/40 text-xs font-mono text-[#22C55E] font-bold rounded-lg flex items-center gap-1 animate-fadeIn">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 text-xs font-mono border-b border-[#2B3040] pb-2">
        <button
          onClick={() => setActiveTab('morning')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
            activeTab === 'morning'
              ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40'
              : 'text-[#A7AFBF] hover:text-white'
          }`}
        >
          <Sun className="w-4 h-4 text-[#8B5CF6]" /> MORNING INTENTION
        </button>

        <button
          onClick={() => setActiveTab('evening')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
            activeTab === 'evening'
              ? 'bg-[#4F7CFF]/20 text-[#4F7CFF] border border-[#4F7CFF]/40'
              : 'text-[#A7AFBF] hover:text-white'
          }`}
        >
          <Moon className="w-4 h-4 text-[#4F7CFF]" /> EVENING REFLECTION
        </button>
      </div>

      {/* Morning Journal Form */}
      {activeTab === 'morning' && (
        <form onSubmit={handleSaveMorning} className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4 shadow-md">
          <div>
            <label className="block text-xs font-bold text-[#8B5CF6] mb-1 uppercase font-mono">
              1. What is today's #1 mission?
            </label>
            <textarea
              rows={2}
              value={m1}
              onChange={(e) => setM1(e.target.value)}
              placeholder="Primary objective..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B5CF6] mb-1 uppercase font-mono">
              2. Behavioral target today
            </label>
            <textarea
              rows={2}
              value={m2}
              onChange={(e) => setM2(e.target.value)}
              placeholder="e.g. Calm focus, no complaining, deep work..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B5CF6] mb-1 uppercase font-mono">
              3. Potential derailers & distractions
            </label>
            <textarea
              rows={2}
              value={m3}
              onChange={(e) => setM3(e.target.value)}
              placeholder="What might distract you?"
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl transition shadow-lg shadow-[#8B5CF6]/20"
          >
            Save Morning Journal
          </button>
        </form>
      )}

      {/* Evening Journal Form */}
      {activeTab === 'evening' && (
        <form onSubmit={handleSaveEvening} className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4 shadow-md">
          <div>
            <label className="block text-xs font-bold text-[#22C55E] mb-1 uppercase font-mono">1. Biggest win today</label>
            <textarea
              rows={2}
              value={e1}
              onChange={(e) => setE1(e.target.value)}
              placeholder="What did you execute well?"
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EF4444] mb-1 uppercase font-mono">2. Biggest mistake today</label>
            <textarea
              rows={2}
              value={e2}
              onChange={(e) => setE2(e.target.value)}
              placeholder="Where did discipline falter?"
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#EF4444]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F97316] mb-1 uppercase font-mono">3. What wasted my time?</label>
            <textarea
              rows={2}
              value={e3}
              onChange={(e) => setE3(e.target.value)}
              placeholder="Distractions or lost hours..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#F97316]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4F7CFF] mb-1 uppercase font-mono">4. Lesson learned</label>
            <textarea
              rows={2}
              value={e4}
              onChange={(e) => setE4(e.target.value)}
              placeholder="Key takeaway..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EC4899] mb-1 uppercase font-mono">5. Tomorrow's #1 focus</label>
            <textarea
              rows={2}
              value={e5}
              onChange={(e) => setE5(e.target.value)}
              placeholder="Tomorrow's core objective..."
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#EC4899]"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 bg-[#4F7CFF] hover:bg-[#3B66E6] text-white font-bold text-xs rounded-xl transition shadow-lg shadow-[#4F7CFF]/20"
          >
            Save Evening Journal
          </button>
        </form>
      )}
    </div>
  );
};
