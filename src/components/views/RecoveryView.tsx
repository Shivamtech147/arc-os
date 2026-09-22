import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

type BadDayScenario =
  | 'lost_morning'
  | 'missed_workout'
  | 'overslept'
  | 'scrolled_too_much'
  | 'failed_study'
  | 'missed_multiple'
  | 'slept_badly'
  | 'overwhelmed_all';

export const RecoveryView: React.FC = () => {
  const { triggerRecovery, recoveryEvents } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<BadDayScenario | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [applied, setApplied] = useState(false);

  const scenarios: { key: BadDayScenario; title: string; desc: string }[] = [
    { key: 'lost_morning', title: 'Lost the morning', desc: 'Wasted morning hours, feeling behind.' },
    { key: 'missed_workout', title: 'Missed workout', desc: 'Skipped physical training session.' },
    { key: 'overslept', title: 'Overslept', desc: 'Woke up late, routine thrown off.' },
    { key: 'scrolled_too_much', title: 'Scrolled too much', desc: 'Dopamine burnout from screen time.' },
    { key: 'failed_study', title: 'Failed to study', desc: 'Zero study hours completed today.' },
    { key: 'missed_multiple', title: 'Missed multiple days', desc: 'Fell off for 2+ consecutive days.' },
    { key: 'slept_badly', title: 'Slept badly', desc: 'Exhausted, low cognitive energy.' },
    { key: 'overwhelmed_all', title: 'Overwhelmed', desc: 'Paralyzed by task debt and stress.' },
  ];

  const handleApplyProtocol = async (reason: string, protocolText: string) => {
    await triggerRecovery(reason, protocolText, logNotes);
    setApplied(true);
  };

  const renderRescuePlan = () => {
    switch (selectedScenario) {
      case 'lost_morning':
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-[#F97316] pl-4 py-1">
              <h3 className="text-sm font-bold text-white">Rescue plan: Lost morning</h3>
              <p className="text-xs text-[#A7AFBF] mt-0.5">
                The morning is gone. The remaining hours are under your absolute control.
              </p>
            </div>

            <ol className="space-y-2 text-xs text-[#F8FAFC] list-decimal list-inside bg-[#111318] p-4 rounded-xl border border-[#2B3040]">
              <li>Drink a cold glass of water and step away from all screens for 3 minutes.</li>
              <li>Select your single highest-priority task for today.</li>
              <li>Launch a 25-minute focus session right now.</li>
              <li>Do not try to make up for 6 lost hours; execute the next 25 minutes cleanly.</li>
            </ol>

            <button
              onClick={() => handleApplyProtocol('Lost the morning', 'Executed 25-min afternoon rescue sprint')}
              className="w-full py-3.5 bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:opacity-95 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#F97316]/25 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              10 MIN RESET SPRINT
            </button>
          </div>
        );

      case 'missed_workout':
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-[#F97316] pl-4 py-1">
              <h3 className="text-sm font-bold text-white">Rescue plan: Missed workout</h3>
              <p className="text-xs text-[#A7AFBF] mt-0.5">
                Execute your Minimum Physical Version. Never let a missed gym session become a zero day.
              </p>
            </div>

            <ol className="space-y-2 text-xs text-[#F8FAFC] list-decimal list-inside bg-[#111318] p-4 rounded-xl border border-[#2B3040]">
              <li>Do 3 sets of push-ups or bodyweight squats (10 minutes total).</li>
              <li>Or take a brisk 15-minute outdoor walk without your phone.</li>
              <li>Log the minimum physical version as completed.</li>
            </ol>

            <button
              onClick={() => handleApplyProtocol('Missed workout', 'Executed 10-min minimum movement session')}
              className="w-full py-3.5 bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:opacity-95 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#F97316]/25 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              10 MIN RESET MOVEMENT
            </button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="border-l-4 border-[#F97316] pl-4 py-1">
              <h3 className="text-sm font-bold text-white">General Day Saver Protocol</h3>
              <p className="text-xs text-[#A7AFBF] mt-0.5">
                One bad day does not make a bad week. Save the remaining hours today.
              </p>
            </div>

            <ol className="space-y-2 text-xs text-[#F8FAFC] list-decimal list-inside bg-[#111318] p-4 rounded-xl border border-[#2B3040]">
              <li>Let go of past hours—guilt is baggage.</li>
              <li>Identify the single most useful task you can still do today.</li>
              <li>Execute a 10-minute reset sprint immediately.</li>
            </ol>

            <button
              onClick={() => handleApplyProtocol('Day recovery', 'Executed single task rescue sprint')}
              className="w-full py-3.5 bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:opacity-95 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#F97316]/25 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              10 MIN RESET
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans text-[#F8FAFC] pb-12">
      {/* Soft Orange/Pink Energetic Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#191C24] via-[#20242E] to-[#191C24] border border-[#F97316]/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#F97316]/20 via-[#EC4899]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <span className="text-xs font-mono font-extrabold text-[#F97316] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> RECOVERY CENTER
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            MISSED THE DAY? SAVE WHAT'S LEFT.
          </h1>
          <p className="text-xs text-[#A7AFBF]">
            The goal is not self-punishment. The goal is momentum recovery right now.
          </p>
        </div>
      </div>

      {!selectedScenario ? (
        <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-mono font-bold text-[#A7AFBF] uppercase tracking-wider">
            Select your current situation:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenarios.map((sc) => (
              <button
                key={sc.key}
                onClick={() => {
                  setSelectedScenario(sc.key);
                  setApplied(false);
                }}
                className="p-4 bg-[#111318] hover:bg-[#20242E] border border-[#2B3040] hover:border-[#F97316]/50 rounded-xl text-left transition group space-y-1"
              >
                <h3 className="text-xs font-bold text-white group-hover:text-[#F97316]">
                  {sc.title}
                </h3>
                <p className="text-[11px] text-[#A7AFBF]">{sc.desc}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-4">
          <button
            onClick={() => setSelectedScenario(null)}
            className="text-xs font-mono text-[#A7AFBF] hover:text-white transition"
          >
            ← Select a different scenario
          </button>

          {applied ? (
            <div className="p-6 bg-[#22C55E]/15 border border-[#22C55E]/40 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto" />
              <h3 className="text-sm font-bold text-white">
                Recovery Protocol Logged
              </h3>
              <p className="text-xs text-[#A7AFBF]">
                The remaining hours are under your command. Execute cleanly.
              </p>
              <button
                onClick={() => setSelectedScenario(null)}
                className="py-2 px-4 bg-[#4F7CFF] text-white font-bold text-xs rounded-xl"
              >
                Back to Recovery Center
              </button>
            </div>
          ) : (
            renderRescuePlan()
          )}
        </div>
      )}

      {/* Recovery History Log */}
      {recoveryEvents.length > 0 && (
        <div className="bg-[#191C24] border border-[#2B3040] rounded-2xl p-6 space-y-3">
          <h2 className="text-xs font-mono text-[#A7AFBF] font-bold uppercase tracking-wider">
            Past Recovery Events
          </h2>
          <div className="divide-y divide-[#2B3040] max-h-48 overflow-y-auto">
            {recoveryEvents.map((ev) => (
              <div key={ev.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#F97316]">{ev.triggerReason}</span>
                  <p className="text-[11px] text-[#A7AFBF]">{ev.protocolApplied}</p>
                </div>
                <span className="text-[10px] font-mono text-[#A7AFBF]">{ev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
