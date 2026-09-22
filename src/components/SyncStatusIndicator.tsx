import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle, LogIn, LogOut, User } from 'lucide-react';

interface SyncStatusIndicatorProps {
  onOpenAuth: () => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ onOpenAuth }) => {
  const { syncStatus, pendingQueueCount, user, signOut } = useApp();
  const [showPanel, setShowPanel] = useState(false);

  const renderBadge = () => {
    switch (syncStatus) {
      case 'synced':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Synced</span>
          </span>
        );
      case 'syncing':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-full">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing...</span>
          </span>
        );
      case 'saving':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full">
            <Cloud className="w-3.5 h-3.5" />
            <span>Saving...</span>
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-700 px-2.5 py-1 rounded-full">
            <CloudOff className="w-3.5 h-3.5 text-zinc-400" />
            <span>Offline {pendingQueueCount > 0 ? `(${pendingQueueCount})` : ''}</span>
          </span>
        );
      case 'error':
      default:
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-red-400 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Sync issue</span>
          </span>
        );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="focus:outline-none hover:opacity-90 transition"
      >
        {renderBadge()}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-64 bg-[#121215] border border-zinc-800 rounded-2xl p-4 shadow-2xl z-50 text-left space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="font-bold text-white text-xs">MULTI-DEVICE SYNC</span>
            <span className="text-[10px] text-zinc-500 uppercase">{syncStatus}</span>
          </div>

          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-blue-400" />
                )}
                <div className="truncate">
                  <p className="text-white font-semibold truncate">{user.displayName || 'Account Signed In'}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{user.email || user.uid}</p>
                </div>
              </div>

              {pendingQueueCount > 0 && (
                <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded-lg text-amber-300 text-[11px]">
                  {pendingQueueCount} offline change(s) queued. Will sync when reconnected.
                </div>
              )}

              <button
                onClick={() => {
                  signOut();
                  setShowPanel(false);
                }}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-zinc-400 text-[11px]">
                Sign in to sync your tasks, habits, and journals across laptop and mobile devices.
              </p>
              <button
                onClick={() => {
                  onOpenAuth();
                  setShowPanel(false);
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <LogIn className="w-4 h-4" /> Sign In / Sync Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
