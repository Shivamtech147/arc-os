import React, { useState } from 'react';
import { X, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface DontFeelLikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLockIn: (mission: string, duration: 10 | 25 | 50 | 90) => void;
}

type BlockingState =
  | 'tired'
  | 'distracted'
  | 'overwhelmed'
  | 'no_start'
  | 'bored'
  | 'difficult'
  | 'anxious'
  | 'just_dont'
  | 'wasted_time';

export const DontFeelLikeModal: React.FC<DontFeelLikeModalProps> = ({
  isOpen,
  onClose,
  onStartLockIn,
}) => {
  const [selectedState, setSelectedState] = useState<BlockingState | null>(null);

  if (!isOpen) return null;

  const options: { key: BlockingState; label: string; desc: string }[] = [
    { key: 'tired', label: "I'm tired", desc: 'Low energy or lack of sleep' },
    { key: 'distracted', label: "I'm distracted", desc: 'Checking phone or notifications' },
    { key: 'overwhelmed', label: "I'm overwhelmed", desc: 'Too many tasks in head' },
    { key: 'no_start', label: "I don't know where to start", desc: 'Task feels unclear' },
    { key: 'bored', label: "I'm bored", desc: 'Task feels repetitive' },
    { key: 'difficult', label: 'The task is too difficult', desc: 'Stuck or confused' },
    { key: 'anxious', label: "I'm anxious", desc: 'Fear of failure or stress' },
    { key: 'just_dont', label: "I just don't feel like it", desc: 'No motivation' },
    { key: 'wasted_time', label: 'I wasted too much time already', desc: 'Guilt over lost morning' },
  ];

  const renderProtocol = () => {
    switch (selectedState) {
      case 'tired':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">TIREDNESS PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Check your sleep duration from last night.</li>
              <li>If sleep was &lt; 6 hours: Execute your configured minimum version.</li>
              <li>If sleep was &gt;= 6 hours: Start a 10-minute activation block.</li>
              <li>Reassess energy levels after 10 minutes of execution.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('10-Min Activation Block', 10);
                onClose();
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Start 10-Min Activation Lock-In
            </button>
          </div>
        );

      case 'distracted':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">DISTRACTION PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Put your phone in another room or face down.</li>
              <li>Close all unrelated browser tabs and messaging apps.</li>
              <li>Enter Lock-In mode immediately for a 25-minute sprint.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('25-Min Distraction-Free Sprint', 25);
                onClose();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Enter 25-Min Lock-In Sprint
            </button>
          </div>
        );

      case 'overwhelmed':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">OVERWHELM PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Do a 60-second brain dump: write down everything confusing you.</li>
              <li>Break your target task into the smallest single action possible.</li>
              <li>Ignore everything else and focus exclusively on that tiny action.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('Smallest Action Lock-In', 10);
                onClose();
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Start 10-Min Tiny Action Lock-In
            </button>
          </div>
        );

      case 'no_start':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">CLARITY PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Define the exact desired output in one sentence.</li>
              <li>Break the process into 3 sequential steps.</li>
              <li>Execute step one right now without thinking about steps 2 & 3.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('Step 1 Execution', 25);
                onClose();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Lock In on Step 1
            </button>
          </div>
        );

      case 'bored':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">BOREDOM PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Reduce session length down to just 10 minutes.</li>
              <li>Start immediately—the friction disappears once momentum begins.</li>
              <li>Increase session duration only after completing the 10 minutes.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('10-Min Boredom Buster', 10);
                onClose();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Start 10-Min Sprint
            </button>
          </div>
        );

      case 'difficult':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">DIFFICULTY PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Break the difficult task into smaller sub-problems.</li>
              <li>Identify missing documentation, context, or knowledge.</li>
              <li>Create a dedicated 20-minute learning & research block.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('25-Min Research Block', 25);
                onClose();
              }}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Start Learning & Research Block
            </button>
          </div>
        );

      case 'anxious':
        return (
          <div className="space-y-4 text-left">
            <h4 className="font-mono font-bold text-amber-400 text-sm">ANXIETY RESET PROTOCOL</h4>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Perform slow box breathing for 2 minutes (4s in, 4s hold, 4s out, 4s hold).</li>
              <li>Write down the specific fear or concern on paper.</li>
              <li>Separate uncontrollable outcomes from controllable actions.</li>
              <li>Take one single controllable action right now.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('10-Min Controllable Action', 10);
                onClose();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Execute 1 Controllable Action
            </button>
          </div>
        );

      case 'just_dont':
        return (
          <div className="space-y-4 text-left">
            <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-center">
              <p className="font-mono font-extrabold text-sm text-amber-300 uppercase">
                "YOU DON'T NEED MOTIVATION TO START."
              </p>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Discipline is doing what must be done regardless of emotional state.
              </p>
            </div>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Select your configured Minimum Version.</li>
              <li>Set a 10-minute timer.</li>
              <li>Begin execution without negotiating with yourself.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('Minimum Version Lock-In', 10);
                onClose();
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Execute Minimum Version (10 Min)
            </button>
          </div>
        );

      case 'wasted_time':
        return (
          <div className="space-y-4 text-left">
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-center">
              <p className="font-mono font-bold text-xs text-red-300 uppercase">
                "THE PAST IS GONE. SAVE THE REMAINING HOURS TODAY."
              </p>
            </div>
            <ol className="space-y-2 text-xs text-zinc-300 font-mono list-decimal list-inside">
              <li>Stop wallowing in guilt—it wastes even more time.</li>
              <li>Pick the single most useful thing you can still accomplish today.</li>
              <li>Start a 10-minute rescue session right now.</li>
            </ol>
            <button
              onClick={() => {
                onStartLockIn('Day Rescue Session', 10);
                onClose();
              }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Lock In & Save The Day
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono text-white">
              "I DON'T FEEL LIKE WORKING" ENGINE
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Deterministic rule-based mental unblocker
            </p>
          </div>
        </div>

        {!selectedState ? (
          <div className="space-y-3">
            <label className="block text-xs font-mono text-zinc-400 uppercase font-bold text-left">
              What's blocking you right now?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedState(opt.key)}
                  className="p-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl transition text-left group"
                >
                  <div className="font-mono text-xs font-bold text-zinc-200 group-hover:text-amber-400">
                    {opt.label}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {renderProtocol()}
            <button
              onClick={() => setSelectedState(null)}
              className="mt-4 text-xs font-mono text-zinc-400 hover:underline block text-left"
            >
              ← Pick a different blocking reason
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
