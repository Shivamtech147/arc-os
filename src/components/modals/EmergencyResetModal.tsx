import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, Zap, ArrowRight, Circle } from 'lucide-react';

interface EmergencyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLockIn: (mission: string, duration: 10 | 25 | 50 | 90) => void;
}

export const EmergencyResetModal: React.FC<EmergencyResetModalProps> = ({
  isOpen,
  onClose,
  onStartLockIn,
}) => {
  const [step, setStep] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>([false, false, false, false, false]);
  const [resetTimerSeconds, setResetTimerSeconds] = useState(10 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [singleTaskInput, setSingleTaskInput] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (timerActive && resetTimerSeconds > 0) {
      interval = setInterval(() => {
        setResetTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (resetTimerSeconds === 0) {
      setTimerActive(false);
      setStep(2); // Ask single task
    }
    return () => clearInterval(interval);
  }, [timerActive, resetTimerSeconds]);

  if (!isOpen) return null;

  const protocolSteps = [
    '1. Stand up immediately from your current seat.',
    '2. Drink a full glass of cold water.',
    '3. Wash your face with cold water.',
    '4. Clean your desk / workspace for 3 minutes.',
    '5. Put your phone in another room or face down.',
  ];

  const toggleCheckStep = (idx: number) => {
    const updated = [...checkedSteps];
    updated[idx] = !updated[idx];
    setCheckedSteps(updated);
  };

  const allPhysicalStepsDone = checkedSteps.every(Boolean);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStart10MinTimer = () => {
    setStep(1);
    setTimerActive(true);
  };

  const handleFinishReset = () => {
    if (!singleTaskInput.trim()) return;
    onStartLockIn(singleTaskInput.trim(), 10);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-red-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl text-red-400">
            <RefreshCw className="w-6 h-6 animate-spin duration-1000" />
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-extrabold font-mono text-white">
            EMERGENCY RESET PROTOCOL
          </h3>
          <p className="text-xs text-red-400 font-mono mt-1 font-semibold uppercase">
            "I'M WASTING THE DAY" — RECOVERY IN PROGRESS
          </p>
        </div>

        {/* STEP 0: Physical Checklist */}
        {step === 0 && (
          <div className="space-y-4 text-left">
            <p className="text-xs text-zinc-300 font-mono">
              Complete these 5 physical actions right now to break passive momentum:
            </p>

            <div className="space-y-2">
              {protocolSteps.map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCheckStep(idx)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition ${
                    checkedSteps[idx]
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {checkedSteps[idx] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600 shrink-0" />
                  )}
                  <span className="text-xs font-mono font-medium">{st}</span>
                </div>
              ))}
            </div>

            <button
              disabled={!allPhysicalStepsDone}
              onClick={handleStart10MinTimer}
              className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition ${
                allPhysicalStepsDone
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
              }`}
            >
              Start 10-Minute Guided Reset Timer <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: 10-Minute Guided Timer */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="font-mono text-6xl font-extrabold text-red-400 tracking-wider">
              {formatTimer(resetTimerSeconds)}
            </div>
            <p className="text-xs text-zinc-300 font-mono">
              Cleaning desk & grounding mind. Breathe deeply.
            </p>
            <button
              onClick={() => {
                setTimerActive(false);
                setStep(2);
              }}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold rounded-xl border border-zinc-700"
            >
              Skip to Task Selection
            </button>
          </div>
        )}

        {/* STEP 2: Ask Single Task & Launch Lock-In */}
        {step === 2 && (
          <div className="space-y-4 text-left">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <label className="block text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                What is the single most useful thing you can still accomplish today?
              </label>
              <input
                type="text"
                value={singleTaskInput}
                onChange={(e) => setSingleTaskInput(e.target.value)}
                placeholder="e.g. Solve 1 DSA problem / Write 2 pages of notes"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              onClick={handleFinishReset}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Lock In on This Task Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
