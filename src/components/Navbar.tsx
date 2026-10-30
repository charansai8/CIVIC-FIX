import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Download,
  Globe,
  MapPin,
  Menu,
  Moon,
  ShieldAlert,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { CivicFixLogo } from './CivicFixLogo.tsx';
import { SupportedLanguage, User } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { store } from '../services/store.ts';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  currentUser: User | null;
  onOpenAuth: (initialMode?: 'signin' | 'signup' | 'admin') => void;
  onSignOut: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenReportModal: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  isDark,
  onThemeToggle,
  currentUser,
  onOpenAuth,
  onSignOut,
  activeTab,
  onSelectTab,
  onOpenReportModal,
  unreadCount,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = currentUser
    ? store.getNotificationsForUser(currentUser.id)
    : [];

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${
        isDark
          ? 'bg-neutral-950/95 border-neutral-800 text-white'
          : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* CivicFix Brand with Shared-Letter Vector Logo */}
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-teal-500 rounded-lg p-1 text-left shrink-0"
            aria-label="CivicFix Home"
          >
            <div className="block sm:hidden">
              <CivicFixLogo size="sm" isDark={isDark} showTagline={false} />
            </div>
            <div className="hidden sm:block">
              <CivicFixLogo size="md" isDark={isDark} showTagline={true} />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'home'
                  ? isDark
                    ? 'bg-neutral-800 text-teal-400'
                    : 'bg-neutral-100 text-neutral-950 border border-neutral-300'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => onSelectTab('howItWorks')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'howItWorks'
                  ? isDark
                    ? 'bg-neutral-800 text-teal-400'
                    : 'bg-neutral-100 text-neutral-950 border border-neutral-300'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => onSelectTab('mapView')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'mapView'
                  ? isDark
                    ? 'bg-neutral-800 text-teal-400'
                    : 'bg-neutral-100 text-neutral-950 border border-neutral-300'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              {t.nav.mapView}
            </button>
            <button
              onClick={() => onSelectTab('solvedIssues')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'solvedIssues'
                  ? isDark
                    ? 'bg-neutral-800 text-teal-400'
                    : 'bg-neutral-100 text-neutral-950 border border-neutral-300'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.nav.solvedIssues}
            </button>

            {currentUser && (
              <button
                onClick={() => onSelectTab(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'dashboard' || activeTab === 'admin'
                    ? isDark
                      ? 'bg-neutral-800 text-teal-400'
                      : 'bg-neutral-100 text-neutral-950 border border-neutral-300'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'
                }`}
              >
                {currentUser.role === 'ADMIN' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    {t.nav.adminPanel}
                  </>
                ) : (
                  <>
                    <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    {t.nav.dashboard}
                  </>
                )}
              </button>
            )}
          </nav>

          {/* Right Action Icons & Auth Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative inline-block text-left">
              <label htmlFor="language-select" className="sr-only">
                Select Language
              </label>
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-md border text-xs font-semibold bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <select
                  id="language-select"
                  value={currentLang}
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-transparent font-semibold cursor-pointer focus:outline-hidden text-neutral-900 dark:text-white pr-0.5 text-xs max-w-[80px] sm:max-w-none"
                >
                  {languages.map((l) => (
                    <option
                      key={l.code}
                      value={l.code}
                      className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans"
                    >
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onThemeToggle}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-800" />}
            </button>

            {/* Notifications Menu */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label={`Notifications, ${unreadCount} unread`}
                  className="relative p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-neutral-950 rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl p-3 z-50 transition-all ${
                      isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="font-bold text-sm">Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => store.markAllNotificationsAsRead(currentUser.id)}
                          className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 mt-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-neutral-500 py-4 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              store.markNotificationAsRead(notif.id);
                              if (notif.complaintId) {
                                onSelectTab(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard');
                              }
                              setNotificationsOpen(false);
                            }}
                            className={`p-2.5 text-xs rounded-lg cursor-pointer transition-colors ${
                              !notif.isRead
                                ? isDark
                                  ? 'bg-neutral-800/80 hover:bg-neutral-800'
                                  : 'bg-teal-50/60 hover:bg-teal-50'
                                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span className={!notif.isRead ? 'text-teal-600 dark:text-teal-400' : ''}>
                                {notif.title}
                              </span>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              )}
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-neutral-400 block mt-1 font-mono">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Download Complete Source Code (.ZIP) */}
            <a
              href="/civicfix-complete-source-code.zip"
              download="civicfix-complete-source-code.zip"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all shadow-xs"
              title="Download Complete Source Code (.ZIP)"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Source .ZIP</span>
            </a>

            {/* Primary Action Button: Report an Issue */}
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-400 active:scale-95"
            >
              <span>+</span>
              <span>{t.nav.reportIssue}</span>
            </button>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold"
                  title={`${currentUser.fullName} (${currentUser.role})`}
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="hidden md:inline font-bold text-xs max-w-[100px] truncate">
                    {currentUser.username}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-amber-400 text-neutral-950'
                        : 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </button>
                <button
                  onClick={onSignOut}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300 transition-colors"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold border border-neutral-900 dark:border-white hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all"
                >
                  {t.nav.signIn}
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="hidden md:inline-flex px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
                >
                  {t.nav.signUp}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md border border-neutral-300 dark:border-neutral-700"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <button
              onClick={() => {
                onSelectTab('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => {
                onSelectTab('howItWorks');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => {
                onSelectTab('mapView');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t.nav.mapView}
            </button>
            <button
              onClick={() => {
                onSelectTab('solvedIssues');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t.nav.solvedIssues}
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  onSelectTab(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md font-semibold text-sm text-teal-600 dark:text-teal-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {currentUser.role === 'ADMIN' ? t.nav.adminPanel : t.nav.dashboard}
              </button>
            )}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  onOpenReportModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-bold bg-teal-600 text-white"
              >
                + {t.nav.reportIssue}
              </button>
              <a
                href="/civicfix-complete-source-code.zip"
                download="civicfix-complete-source-code.zip"
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 rounded-lg text-xs font-bold border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Download Complete Source Code (.ZIP)
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
