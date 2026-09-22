import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, LogIn, Mail, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogleProvider, signInWithEmailPass } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogleProvider();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailPass(email.trim(), password.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-3 bg-blue-950 border border-blue-500/40 rounded-2xl text-blue-400">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">
              ACCOUNT & MULTI-DEVICE SYNC
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Synchronize Laptop & Phone seamlessly
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs font-mono text-blue-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            Safe Migration: On first sign-in, your existing local IndexedDB data will be automatically backed up and merged into your account.
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs font-mono text-red-300">
            {error}
          </div>
        )}

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-3 font-mono text-[10px] text-zinc-500 uppercase">OR EMAIL LOGIN</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Email Sign-In */}
        <form onSubmit={handleEmailSignIn} className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@winterarc.os"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-sans"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow transition"
          >
            {loading ? 'Authenticating...' : 'Sign In / Register Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
