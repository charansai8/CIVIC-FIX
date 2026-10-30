import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { InteractiveMapView } from './components/InteractiveMapView.tsx';
import { SolvedIssuesShowcase } from './components/SolvedIssuesShowcase.tsx';
import { AdminDashboardView } from './components/AdminDashboardView.tsx';
import { CitizenDashboardView } from './components/CitizenDashboardView.tsx';
import { ReportIssueModal } from './components/ReportIssueModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ResponseLoginPopup } from './components/ResponseLoginPopup.tsx';
import { ComplaintDetailModal } from './components/ComplaintDetailModal.tsx';
import { CivicBotChat } from './components/CivicBotChat.tsx';
import { Complaint, ComplaintCategory, SupportedLanguage, User } from './types/index.ts';
import { store } from './services/store.ts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en'); // Defaults to English with 1-click Telugu toggle
  const [isDark, setIsDark] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals & Popups State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedCategoryForReport, setSelectedCategoryForReport] = useState<ComplaintCategory | undefined>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup' | 'admin'>('signin');
  const [selectedComplaintForDetail, setSelectedComplaintForDetail] = useState<Complaint | null>(null);

  // Mandatory Next-Login Popup State
  const [unreadResponsesPopupOpen, setUnreadResponsesPopupOpen] = useState(false);
  const [unreadResponsesList, setUnreadResponsesList] = useState<
    ReturnType<typeof store.getUnreadResponsesForUser>
  >([]);

  // Subscribe to store changes
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // Sync dark class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Check for unread administrative responses on login or user switch
  useEffect(() => {
    if (currentUser && currentUser.role === 'USER') {
      const unreadItems = store.getUnreadResponsesForUser(currentUser.id);
      if (unreadItems.length > 0) {
        setUnreadResponsesList(unreadItems);
        setUnreadResponsesPopupOpen(true);
      }
    } else {
      setUnreadResponsesPopupOpen(false);
    }
  }, [currentUser]);

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = () => {
    store.setCurrentUser(null);
    setActiveTab('home');
    setSelectedComplaintForDetail(null);
  };

  const handleAuthSuccess = (user: User) => {
    if (user.role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const unreadCount = currentUser
    ? store.getNotificationsForUser(currentUser.id).filter((n) => !n.isRead).length
    : 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => {
          setSelectedCategoryForReport(undefined);
          setReportModalOpen(true);
        }}
        unreadCount={unreadCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <HomeView
            currentLang={currentLang}
            isDark={isDark}
            currentUser={currentUser}
            onOpenReportModal={(cat) => {
              setSelectedCategoryForReport(cat);
              setReportModalOpen(true);
            }}
            onOpenAuth={handleOpenAuth}
            onSelectTab={setActiveTab}
            onSelectComplaint={setSelectedComplaintForDetail}
          />
        )}

        {activeTab === 'howItWorks' && (
          <div className="py-6 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black">How CivicFix Operates</h1>
              <p className="text-xs sm:text-sm text-neutral-500">
                CivicFix guarantees complete accountability. Every reported infrastructure grievance is timestamped, routed to the responsible department, and backed by verifiable photographic resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                }`}
              >
                <span className="text-3xl">📱</span>
                <h3 className="text-lg font-black">Citizen Verification</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Citizens submit photographic evidence with GPS geotags. Two-factor authentication (2FA) ensures authenticated public feedback without spam.
                </p>
              </div>

              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                }`}
              >
                <span className="text-3xl">⚙️</span>
                <h3 className="text-lg font-black">Engineering Allocation</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Municipal administrators dispatch squads and adjust local inventory directly from the central command dashboard.
                </p>
              </div>

              <div
                className={`p-6 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                }`}
              >
                <span className="text-3xl">🛡️</span>
                <h3 className="text-lg font-black">Verified Completion</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Before closing a complaint, administrators must post a verified resolution photo and completion description, notifying the reporting citizen immediately.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setReportModalOpen(true)}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md"
              >
                + Report a Civic Issue Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mapView' && (
          <InteractiveMapView
            complaints={store.getComplaints()}
            currentLang={currentLang}
            isDark={isDark}
            onSelectComplaint={setSelectedComplaintForDetail}
            onOpenReportModal={() => setReportModalOpen(true)}
          />
        )}

        {activeTab === 'solvedIssues' && (
          <SolvedIssuesShowcase
            complaints={store.getComplaints()}
            currentLang={currentLang}
            isDark={isDark}
            onSelectComplaint={setSelectedComplaintForDetail}
            onOpenReportModal={() => setReportModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && currentUser && currentUser.role === 'USER' && (
          <CitizenDashboardView
            currentUser={currentUser}
            currentLang={currentLang}
            isDark={isDark}
            onOpenReportModal={() => setReportModalOpen(true)}
            onSelectComplaint={setSelectedComplaintForDetail}
          />
        )}

        {activeTab === 'admin' && currentUser && currentUser.role === 'ADMIN' && (
          <AdminDashboardView
            adminUser={currentUser}
            currentLang={currentLang}
            isDark={isDark}
            onSelectComplaint={setSelectedComplaintForDetail}
          />
        )}
      </main>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        currentUser={currentUser}
        currentLang={currentLang}
        isDark={isDark}
        onOpenAuth={() => handleOpenAuth('signin')}
        onViewComplaint={(id) => {
          const c = store.getComplaintById(id);
          if (c) setSelectedComplaintForDetail(c);
        }}
        initialCategory={selectedCategoryForReport}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        currentLang={currentLang}
        isDark={isDark}
      />

      {/* Complaint Detail Inspector Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaintForDetail}
        isOpen={!!selectedComplaintForDetail}
        onClose={() => setSelectedComplaintForDetail(null)}
        currentUser={currentUser}
        currentLang={currentLang}
        isDark={isDark}
      />

      {/* Mandatory Unread Official Response Login Popup */}
      <ResponseLoginPopup
        items={unreadResponsesList}
        isOpen={unreadResponsesPopupOpen}
        onClose={() => setUnreadResponsesPopupOpen(false)}
        onViewResponse={(complaintId) => {
          const cmp = store.getComplaintById(complaintId);
          if (cmp) setSelectedComplaintForDetail(cmp);
          setActiveTab('dashboard');
        }}
        isDark={isDark}
      />

      {/* AI Civic Chatbot */}
      <CivicBotChat
        currentLang={currentLang}
        isDark={isDark}
        onOpenReportModal={() => setReportModalOpen(true)}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}
