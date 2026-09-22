import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Play, Pause, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

type DurationMinutes = 10 | 25 | 50 | 90;

export const LockInView: React.FC = () => {
  const { todayLog, addFocusSession } = useApp();

  const [mission, setMission] = useState(todayLog.mainMission || 'Deep Work Session');
  const [selectedDuration, setSelectedDuration] = useState<DurationMinutes>(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);

  // Session evaluation modal
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evalOutcome, setEvalOutcome] = useState<'completed' | 'partially_completed' | 'abandoned'>('completed');
  const [abandonedReason, setAbandonedReason] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = (duration: DurationMinutes) => {
    setSelectedDuration(duration);
    setSecondsRemaining(duration * 60);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            setEvalOutcome('completed');
            setShowEvaluation(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const totalSeconds = selectedDuration * 60;
  const progressPercent = Math.min(100, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleFinishEarly = () => {
    setIsTimerRunning(false);
    setEvalOutcome('completed');
    setShowEvaluation(true);
  };

  const handleExitSession = () => {
    setIsTimerRunning(false);
    setEvalOutcome('abandoned');
    setShowEvaluation(true);
  };

  const handleSaveEvaluation = async () => {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    await addFocusSession({
      mission: mission || 'Deep Work Session',
      durationMinutes: selectedDuration,
      actualMinutes: evalOutcome === 'completed' ? selectedDuration : elapsedMinutes,
      status: evalOutcome,
      abandonedReason: evalOutcome === 'abandoned' ? abandonedReason || 'Exited early' : null,
      date: new Date().toISOString().split('T')[0],
    });
    setShowEvaluation(false);
    setIsTimerRunning(false);
    setSecondsRemaining(selectedDuration * 60);
  };

  // Circular progress SVG values
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <div className="max-w-3xl mx-auto py-6 font-sans text-[#F8FAFC] select-none">
      {/* SETUP PHASE */}
      {!isTimerRunning && secondsRemaining === selectedDuration * 60 && !showEvaluation && (
        <div className="bg-[#191C24] border border-[#06B6D4]/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#06B6D4]/20 via-[#4F7CFF]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="border-b border-[#2B3040] pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#06B6D4] fill-current" />
                LOCK-IN MODE
              </h1>
              <p className="text-xs text-[#A7AFBF] mt-0.5">
                Distraction-minimal focus block. Do not negotiate during Lock-In.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 uppercase">
              Technology & Focus
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-[#A7AFBF] font-mono font-bold uppercase">
              Target Mission
            </label>
            <input
              type="text"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="What are you locking in on?"
              className="w-full bg-[#111318] border border-[#2B3040] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#06B6D4]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-[#A7AFBF] font-mono font-bold uppercase">
              Select Session Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([10, 25, 50, 90] as DurationMinutes[]).map((dur) => (
                <button
                  key={dur}
                  onClick={() => {
                    setSelectedDuration(dur);
                    setSecondsRemaining(dur * 60);
                  }}
                  className={`py-3.5 px-4 rounded-xl font-mono text-xs font-extrabold border transition-all ${
                    selectedDuration === dur
                      ? 'bg-gradient-to-r from-[#06B6D4] to-[#4F7CFF] text-white border-transparent shadow-lg shadow-[#06B6D4]/30'
                      : 'bg-[#111318] text-[#A7AFBF] border-[#2B3040] hover:border-[#06B6D4]/50 hover:text-white'
                  }`}
                >
                  {dur} MIN
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => startSession(selectedDuration)}
            className="w-full py-4 bg-gradient-to-r from-[#06B6D4] via-[#4F7CFF] to-[#8B5CF6] hover:opacity-95 text-white font-extrabold text-sm tracking-wider rounded-xl shadow-xl shadow-[#06B6D4]/30 flex items-center justify-center gap-2 transition"
          >
            <Zap className="w-5 h-5 fill-current text-white" />
            START LOCK-IN SESSION
          </button>
        </div>
      )}

      {/* ACTIVE LOCK-IN TIMER MODE (Immersive Fullscreen Atmosphere) */}
      {(isTimerRunning || secondsRemaining < selectedDuration * 60) && !showEvaluation && (
        <div className="bg-radial-lockin border border-[#06B6D4]/40 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-between min-h-[480px] text-center shadow-2xl relative overflow-hidden space-y-8">
          {/* Top Mission Title */}
          <div>
            <span className="px-3 py-1 bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/40 rounded-full font-mono text-xs font-extrabold tracking-widest uppercase flex items-center gap-1.5 mx-auto w-max">
              <Zap className="w-3.5 h-3.5 fill-current animate-pulse" /> ACTIVE LOCK-IN
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-3 max-w-lg mx-auto">
              "{mission}"
            </h2>
          </div>

          {/* Large Countdown with Circular Progress Ring */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="70"
                stroke="#20242E"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="128"
                cy="128"
                r="70"
                stroke="url(#lockinGradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="lockinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="50%" stopColor="#4F7CFF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute font-mono text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {formatTime(secondsRemaining)}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="py-3 px-5 bg-[#20242E] hover:bg-[#282D3A] text-white rounded-xl font-mono text-xs font-bold border border-[#2B3040] flex items-center gap-2 transition"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'PAUSE' : 'RESUME'}
            </button>

            <button
              onClick={handleFinishEarly}
              className="py-3 px-6 bg-gradient-to-r from-[#22C55E] to-[#06B6D4] hover:opacity-95 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-[#22C55E]/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> COMPLETE
            </button>

            <button
              onClick={handleExitSession}
              className="py-3 px-4 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition"
            >
              <XCircle className="w-4 h-4" /> EXIT
            </button>
          </div>
        </div>
      )}

      {/* POST-SESSION EVALUATION MODAL */}
      {showEvaluation && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#191C24] border border-[#2B3040] rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 text-center shadow-2xl">
            <h3 className="text-xl font-extrabold font-mono text-white">SESSION EVALUATION</h3>

            <p className="text-xs text-[#A7AFBF]">
              Mission: <span className="text-white font-bold">"{mission}"</span>
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setEvalOutcome('completed')}
                className={`p-3.5 rounded-xl font-mono text-xs font-bold border flex items-center justify-center gap-2 transition ${
                  evalOutcome === 'completed'
                    ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]'
                    : 'bg-[#111318] text-[#A7AFBF] border-[#2B3040]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Completed Fully
              </button>

              <button
                onClick={() => setEvalOutcome('partially_completed')}
                className={`p-3.5 rounded-xl font-mono text-xs font-bold border flex items-center justify-center gap-2 transition ${
                  evalOutcome === 'partially_completed'
                    ? 'bg-[#F97316]/20 text-[#F97316] border-[#F97316]'
                    : 'bg-[#111318] text-[#A7AFBF] border-[#2B3040]'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-[#F97316]" /> Partially Completed
              </button>

              <button
                onClick={() => setEvalOutcome('abandoned')}
                className={`p-3.5 rounded-xl font-mono text-xs font-bold border flex items-center justify-center gap-2 transition ${
                  evalOutcome === 'abandoned'
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]'
                    : 'bg-[#111318] text-[#A7AFBF] border-[#2B3040]'
                }`}
              >
                <XCircle className="w-4 h-4 text-[#EF4444]" /> Interrupted / Abandoned
              </button>
            </div>

            {evalOutcome === 'abandoned' && (
              <div className="text-left space-y-1 animate-fadeIn">
                <label className="block text-xs font-mono text-[#EF4444] font-bold">
                  Reason for interruption
                </label>
                <input
                  type="text"
                  value={abandonedReason}
                  onChange={(e) => setAbandonedReason(e.target.value)}
                  placeholder="e.g. Phone distraction, interruption"
                  className="w-full bg-[#111318] border border-[#2B3040] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EF4444]"
                />
              </div>
            )}

            <button
              onClick={handleSaveEvaluation}
              className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#4F7CFF] text-white font-extrabold text-xs rounded-xl shadow-lg"
            >
              Log Session & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
