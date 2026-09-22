import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import {
  LayoutDashboard,
  CalendarCheck,
  Rocket,
  Zap,
  Target,
  Dumbbell,
  BookOpen,
  Briefcase,
  Brain,
  BarChart3,
  ShieldAlert,
  BookMarked,
  ScrollText,
  Settings as SettingsIcon,
  Menu,
  X,
  CalendarDays,
  User
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'today'
  | 'rocket'
  | 'lockin'
  | 'goals'
  | 'body'
  | 'academics'
  | 'career'
  | 'mind'
  | 'analytics'
  | 'recovery'
  | 'journal'
  | 'rules'
  | 'settings'
  | 'calendar';

interface LayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenDontFeelLike: () => void;
  onOpenEmergencyReset: () => void;
  onOpenAuth: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onSelectTab,
  onOpenDontFeelLike,
  onOpenEmergencyReset,
  onOpenAuth,
  children
}) => {
  const { dayNumber, settings, currentDateStr, currentStreak, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavItems: {
    tab: NavTab;
    label: string;
    icon: React.ReactNode;
    colorClass: string;
    activeBg: string;
  }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-[#4F7CFF]" />,
      colorClass: 'text-[#4F7CFF]',
      activeBg: 'bg-[#4F7CFF]/15 text-white border-l-2 border-[#4F7CFF]'
    },
    {
      tab: 'today',
      label: 'Today',
      icon: <CalendarCheck className="w-4 h-4 text-[#4F7CFF]" />,
      colorClass: 'text-[#4F7CFF]',
      activeBg: 'bg-[#4F7CFF]/15 text-white border-l-2 border-[#4F7CFF]'
    },
    {
      tab: 'rocket',
      label: 'Rocket',
      icon: <Rocket className="w-4 h-4 text-[#EC4899]" />,
      colorClass: 'text-[#EC4899]',
      activeBg: 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 text-white border-l-2 border-[#EC4899]'
    },
    {
      tab: 'lockin',
      label: 'Lock-In',
      icon: <Zap className="w-4 h-4 text-[#06B6D4]" />,
      colorClass: 'text-[#06B6D4]',
      activeBg: 'bg-[#06B6D4]/15 text-white border-l-2 border-[#06B6D4]'
    },
    {
      tab: 'goals',
      label: 'Goals',
      icon: <Target className="w-4 h-4 text-[#38BDF8]" />,
      colorClass: 'text-[#38BDF8]',
      activeBg: 'bg-[#38BDF8]/15 text-white border-l-2 border-[#38BDF8]'
    },
    {
      tab: 'body',
      label: 'Body',
      icon: <Dumbbell className="w-4 h-4 text-[#22C55E]" />,
      colorClass: 'text-[#22C55E]',
      activeBg: 'bg-[#22C55E]/15 text-white border-l-2 border-[#22C55E]'
    },
    {
      tab: 'academics',
      label: 'Academics',
      icon: <BookOpen className="w-4 h-4 text-[#4F7CFF]" />,
      colorClass: 'text-[#4F7CFF]',
      activeBg: 'bg-[#4F7CFF]/15 text-white border-l-2 border-[#4F7CFF]'
    },
    {
      tab: 'career',
      label: 'Career',
      icon: <Briefcase className="w-4 h-4 text-[#F97316]" />,
      colorClass: 'text-[#F97316]',
      activeBg: 'bg-[#F97316]/15 text-white border-l-2 border-[#F97316]'
    },
    {
      tab: 'mind',
      label: 'Mind',
      icon: <Brain className="w-4 h-4 text-[#8B5CF6]" />,
      colorClass: 'text-[#8B5CF6]',
      activeBg: 'bg-[#8B5CF6]/15 text-white border-l-2 border-[#8B5CF6]'
    },
    {
      tab: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4 text-[#A855F7]" />,
      colorClass: 'text-[#A855F7]',
      activeBg: 'bg-[#A855F7]/15 text-white border-l-2 border-[#A855F7]'
    },
    {
      tab: 'calendar',
      label: 'Calendar',
      icon: <CalendarDays className="w-4 h-4 text-[#38BDF8]" />,
      colorClass: 'text-[#38BDF8]',
      activeBg: 'bg-[#38BDF8]/15 text-white border-l-2 border-[#38BDF8]'
    },
    {
      tab: 'recovery',
      label: 'Recovery',
      icon: <ShieldAlert className="w-4 h-4 text-[#EF4444]" />,
      colorClass: 'text-[#EF4444]',
      activeBg: 'bg-[#EF4444]/15 text-white border-l-2 border-[#EF4444]'
    },
    {
      tab: 'journal',
      label: 'Journal',
      icon: <BookMarked className="w-4 h-4 text-[#EAB308]" />,
      colorClass: 'text-[#EAB308]',
      activeBg: 'bg-[#EAB308]/15 text-white border-l-2 border-[#EAB308]'
    },
    {
      tab: 'rules',
      label: 'Rules',
      icon: <ScrollText className="w-4 h-4 text-[#F59E0B]" />,
      colorClass: 'text-[#F59E0B]',
      activeBg: 'bg-[#F59E0B]/15 text-white border-l-2 border-[#F59E0B]'
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <SettingsIcon className="w-4 h-4 text-[#9CA3AF]" />,
      colorClass: 'text-[#9CA3AF]',
      activeBg: 'bg-[#9CA3AF]/15 text-white border-l-2 border-[#9CA3AF]'
    },
  ];

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-[#111318] text-[#F8FAFC] flex flex-col md:flex-row font-sans selection:bg-[#4F7CFF] selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="fixed inset-0 bg-radial-ambient pointer-events-none z-0"></div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-[#191C24] border-r border-[#2B3040] shrink-0 select-none z-10">
        <div className="p-5 border-b border-[#2B3040] relative">
          <h1 className="text-xl font-extrabold tracking-tight text-white font-sans flex items-center justify-between">
            <span className="bg-gradient-to-r from-[#4F7CFF] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              ARC OS
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#20242E] text-[#4F7CFF] border border-[#4F7CFF]/30 font-bold">
              Day {dayNumber}/90
            </span>
          </h1>
          <p className="text-[11px] text-[#A7AFBF] mt-1 font-medium">Personal Operating System</p>
        </div>

        {/* Consistency Streak Banner */}
        <div className="px-5 py-3 border-b border-[#2B3040] flex items-center justify-between text-xs">
          <span className="text-[#A7AFBF] font-medium">Consistency</span>
          <span className="font-mono text-[#22C55E] font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            {currentStreak} day streak
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {primaryNavItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? item.activeBg
                    : 'text-[#A7AFBF] hover:text-white hover:bg-[#20242E]/70'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Account & Unblock Buttons */}
        <div className="p-3.5 border-t border-[#2B3040] space-y-2 bg-[#191C24]">
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#3B66E6] rounded-lg flex items-center justify-center gap-2 transition shadow-md shadow-[#4F7CFF]/20"
            >
              <User className="w-3.5 h-3.5 text-white" />
              Sign in to sync
            </button>
          ) : (
            <div className="px-2 py-1 text-[11px] text-[#A7AFBF] truncate font-mono">
              Synced: <span className="text-white font-bold">{user.email || user.displayName}</span>
            </div>
          )}

          <button
            onClick={onOpenDontFeelLike}
            className="w-full py-2 px-3 text-xs font-medium text-[#A7AFBF] bg-[#20242E] hover:bg-[#282D3A] hover:text-white border border-[#2B3040] rounded-lg flex items-center justify-center gap-2 transition"
          >
            I don't feel like working
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Sticky Header */}
        <header className="bg-[#191C24]/90 backdrop-blur-md border-b border-[#2B3040] px-4 md:px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#A7AFBF] hover:text-white bg-[#20242E] rounded-lg border border-[#2B3040]"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>{formatDateLabel(currentDateStr)}</span>
              </h2>
              <p className="text-xs text-[#A7AFBF] font-medium">
                Day <span className="text-[#4F7CFF] font-bold">{dayNumber}</span> of {settings.totalDays || 90}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SyncStatusIndicator onOpenAuth={onOpenAuth} />

            <button
              onClick={() => onSelectTab('lockin')}
              className="py-1.5 px-4 bg-gradient-to-r from-[#06B6D4] to-[#4F7CFF] hover:from-[#08A3BE] hover:to-[#3B66E6] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-[#06B6D4]/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-white" />
              Start Focus
            </button>
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex justify-start">
            <div className="w-72 bg-[#191C24] h-full border-r border-[#2B3040] flex flex-col p-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2B3040]">
                <span className="font-extrabold text-base bg-gradient-to-r from-[#4F7CFF] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
                  ARC OS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#A7AFBF] hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-3 space-y-1">
                {primaryNavItems.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onSelectTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      currentTab === item.tab
                        ? item.activeBg
                        : 'text-[#A7AFBF] hover:bg-[#20242E]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-[#2B3040] space-y-2">
                {!user ? (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-bold text-white bg-[#4F7CFF] rounded-lg"
                  >
                    Sign in to sync
                  </button>
                ) : (
                  <div className="text-[11px] text-[#A7AFBF] font-mono">
                    Signed in as <span className="text-white font-bold">{user.email || user.displayName}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    onOpenDontFeelLike();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-medium text-[#A7AFBF] bg-[#20242E] border border-[#2B3040] rounded-lg"
                >
                  I don't feel like working
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main View Display Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full mb-16 md:mb-0 relative">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#191C24]/95 backdrop-blur-md border-t border-[#2B3040] px-3 py-2 z-40 flex items-center justify-around">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
              currentTab === 'dashboard' ? 'text-[#4F7CFF] font-bold' : 'text-[#A7AFBF]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('today')}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
              currentTab === 'today' ? 'text-[#4F7CFF] font-bold' : 'text-[#A7AFBF]'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span className="text-[10px]">Today</span>
          </button>

          <button
            onClick={() => onSelectTab('rocket')}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
              currentTab === 'rocket' ? 'text-[#EC4899] font-bold' : 'text-[#A7AFBF]'
            }`}
          >
            <Rocket className="w-5 h-5" />
            <span className="text-[10px]">Rocket</span>
          </button>

          <button
            onClick={() => onSelectTab('lockin')}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
              currentTab === 'lockin' ? 'text-[#06B6D4] font-bold' : 'text-[#A7AFBF]'
            }`}
          >
            <Zap className="w-5 h-5 text-[#06B6D4] fill-current" />
            <span className="text-[10px]">Focus</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 p-1 text-[#A7AFBF]"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
