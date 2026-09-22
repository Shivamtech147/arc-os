import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout, NavTab } from './components/Layout';
import { DashboardView } from './components/views/DashboardView';
import { TodayView } from './components/views/TodayView';
import { RocketView } from './components/views/RocketView';
import { LockInView } from './components/views/LockInView';
import { GoalsView } from './components/views/GoalsView';
import { BodyView } from './components/views/BodyView';
import { AcademicsView } from './components/views/AcademicsView';
import { CareerView } from './components/views/CareerView';
import { MindView } from './components/views/MindView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RecoveryView } from './components/views/RecoveryView';
import { JournalView } from './components/views/JournalView';
import { RulesView } from './components/views/RulesView';
import { SettingsView } from './components/views/SettingsView';
import { CalendarView } from './components/views/CalendarView';
import { DontFeelLikeModal } from './components/modals/DontFeelLikeModal';
import { EmergencyResetModal } from './components/modals/EmergencyResetModal';
import { WeeklyReviewModal } from './components/modals/WeeklyReviewModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AuthModal } from './components/modals/AuthModal';

const AppContent: React.FC = () => {
  const { loading } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [dontFeelLikeOpen, setDontFeelLikeOpen] = useState(false);
  const [emergencyResetOpen, setEmergencyResetOpen] = useState(false);
  const [weeklyReviewOpen, setWeeklyReviewOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-zinc-500 border-t-zinc-100 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs tracking-widest text-zinc-400 uppercase">Loading ARC OS...</p>
      </div>
    );
  }

  const handleStartLockInFromModal = (mission: string, duration: 10 | 25 | 50 | 90) => {
    setCurrentTab('lockin');
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectTab={setCurrentTab}
            onOpenDontFeelLike={() => setDontFeelLikeOpen(true)}
            onOpenEmergencyReset={() => setEmergencyResetOpen(true)}
          />
        );
      case 'today':
        return <TodayView />;
      case 'rocket':
        return <RocketView onSelectTab={setCurrentTab} />;
      case 'lockin':
        return <LockInView />;
      case 'goals':
        return <GoalsView />;
      case 'body':
        return <BodyView />;
      case 'academics':
        return <AcademicsView />;
      case 'career':
        return <CareerView />;
      case 'mind':
        return <MindView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'recovery':
        return <RecoveryView />;
      case 'journal':
        return <JournalView />;
      case 'rules':
        return <RulesView />;
      case 'settings':
        return <SettingsView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return (
          <DashboardView
            onSelectTab={setCurrentTab}
            onOpenDontFeelLike={() => setDontFeelLikeOpen(true)}
            onOpenEmergencyReset={() => setEmergencyResetOpen(true)}
          />
        );
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onOpenDontFeelLike={() => setDontFeelLikeOpen(true)}
      onOpenEmergencyReset={() => setEmergencyResetOpen(true)}
      onOpenAuth={() => setAuthModalOpen(true)}
    >
      {renderTabContent()}

      {/* Global Modals */}
      <DontFeelLikeModal
        isOpen={dontFeelLikeOpen}
        onClose={() => setDontFeelLikeOpen(false)}
        onStartLockIn={handleStartLockInFromModal}
      />

      <EmergencyResetModal
        isOpen={emergencyResetOpen}
        onClose={() => setEmergencyResetOpen(false)}
        onStartLockIn={handleStartLockInFromModal}
      />

      <WeeklyReviewModal
        isOpen={weeklyReviewOpen}
        onClose={() => setWeeklyReviewOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <OnboardingModal />
    </Layout>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
