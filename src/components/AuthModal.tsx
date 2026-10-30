import React, { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  Phone,
  Shield,
  ShieldAlert,
  User as UserIcon,
  X,
} from 'lucide-react';
import { SupportedLanguage, User } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { store } from '../services/store.ts';
import { TwoFactorAuthModal } from './TwoFactorAuthModal.tsx';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'admin';
  onClose: () => void;
  onSuccess: (user: User) => void;
  currentLang: SupportedLanguage;
  isDark: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess,
  currentLang,
  isDark,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [mode, setMode] = useState<'citizen_signin' | 'citizen_signup' | 'admin_login'>(
    initialMode === 'admin'
      ? 'admin_login'
      : initialMode === 'signup'
      ? 'citizen_signup'
      : 'citizen_signin'
  );

  // Form Fields
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ward, setWard] = useState('Ward 12 - Madhapur / HITEC City');
  const [enable2FA, setEnable2FA] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Status & Error
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA modal state
  const [pendingUser2FA, setPendingUser2FA] = useState<User | null>(null);

  if (!isOpen) return null;

  const handleCitizenSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = store.authenticate(usernameOrEmail, password);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setError(res.message || 'Authentication failed. Please verify credentials.');
        return;
      }

      if (res.requires2FA) {
        setPendingUser2FA(res.user);
      } else {
        store.setCurrentUser(res.user);
        onSuccess(res.user);
        onClose();
      }
    }, 400);
  };

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Direct administrative authentication
      const res = store.authenticate(usernameOrEmail, password);
      setIsLoading(false);

      if (!res.success || !res.user || res.user.role !== 'ADMIN') {
        setError(res.message || 'Access denied: Invalid administrative credentials.');
        return;
      }

      if (res.requires2FA) {
        setPendingUser2FA(res.user);
      } else {
        store.setCurrentUser(res.user);
        onSuccess(res.user);
        onClose();
      }
    }, 400);
  };

  const handleCitizenSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (!privacyConsent) {
      setError('You must accept the CivicFix privacy and service terms.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = store.registerCitizen({
        fullName,
        username: newUsername,
        email,
        mobileNumber,
        ward,
        enable2FA,
      });

      setIsLoading(false);
      if (!res.success || !res.user) {
        setError(res.message || 'Registration failed.');
        return;
      }

      // If 2FA enabled, prompt
      if (res.user.twoFactorEnabled) {
        setPendingUser2FA(res.user);
      } else {
        store.setCurrentUser(res.user);
        onSuccess(res.user);
        onClose();
      }
    }, 400);
  };

  const handleTwoFactorSuccess = (verifiedUser: User) => {
    store.setCurrentUser(verifiedUser);
    onSuccess(verifiedUser);
    setPendingUser2FA(null);
    onClose();
  };

  const handleSocialMock = (provider: string) => {
    setInfoMessage(
      `${provider} OAuth integration requires client credentials in deployment. You can sign in directly using email or username.`
    );
  };

  const handlePhoneMock = () => {
    setInfoMessage(
      'SMS Gateway integration requires configured provider credentials. Please use standard account credentials.'
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div
          className={`relative w-full max-w-lg my-8 rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
            isDark
              ? 'bg-neutral-900 border-neutral-700 text-white'
              : 'bg-white border-neutral-300 text-neutral-900'
          }`}
        >
          {/* Top Interface Switcher: Citizen vs Administrator */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
            <button
              type="button"
              onClick={() => {
                setMode('citizen_signin');
                setError('');
                setInfoMessage('');
              }}
              className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                mode !== 'admin_login'
                  ? isDark
                    ? 'bg-neutral-900 text-teal-400 border-b-2 border-teal-500'
                    : 'bg-white text-neutral-900 border-b-2 border-teal-600 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Citizen Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('admin_login');
                setError('');
                setInfoMessage('');
              }}
              className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'admin_login'
                  ? isDark
                    ? 'bg-neutral-900 text-amber-400 border-b-2 border-amber-500'
                    : 'bg-white text-neutral-900 border-b-2 border-amber-600 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Municipal Authority Desk
            </button>
            <button
              onClick={onClose}
              className="p-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-l border-neutral-200 dark:border-neutral-800"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Feedback messages */}
            {error && (
              <div className="p-3 mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {infoMessage && (
              <div className="p-3 mb-4 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-300 text-sky-800 dark:text-sky-300 text-xs">
                {infoMessage}
              </div>
            )}

            {/* MODE 1: CITIZEN SIGN IN */}
            {mode === 'citizen_signin' && (
              <form onSubmit={handleCitizenSignIn} className="space-y-4">
                <div className="text-center pb-2">
                  <h3 className="text-xl font-black">{t.auth.signInTitle}</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Sign in to report infrastructure issues and track official municipal resolutions.
                  </p>
                </div>

                <div>
                  <label htmlFor="signin-username" className="block text-xs font-bold uppercase tracking-wider mb-1">
                    {t.auth.usernameLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      id="signin-username"
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="Username or registered email"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="signin-password" className="block text-xs font-bold uppercase tracking-wider">
                      {t.auth.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setInfoMessage('Password reset link sent to registered email.')}
                      className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : t.auth.signInBtn}
                </button>

                {/* Social Login Options */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialMock('Google')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                  >
                    <span className="font-bold text-red-500">G</span> Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialMock('GitHub')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handlePhoneMock}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" /> Sign In with Mobile Number &amp; OTP
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('citizen_signup')}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    {t.auth.noAccount}
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: CITIZEN REGISTRATION */}
            {mode === 'citizen_signup' && (
              <form onSubmit={handleCitizenSignUp} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
                <div className="text-center pb-1">
                  <h3 className="text-xl font-black">{t.auth.signUpTitle}</h3>
                  <p className="text-xs text-neutral-500">
                    Register to report civic grievances and receive official department updates.
                  </p>
                </div>

                <div>
                  <label htmlFor="signup-name" className="block text-xs font-bold uppercase tracking-wider mb-1">
                    {t.auth.fullNameLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="signup-username" className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-username"
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="citizen_handle"
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-ward" className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Residential Ward
                    </label>
                    <select
                      id="signup-ward"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Ward 12 - Madhapur / HITEC City" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Ward 12 - Madhapur</option>
                      <option value="Ward 14 - Gachibowli" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Ward 14 - Gachibowli</option>
                      <option value="Ward 07 - Begumpet" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Ward 07 - Begumpet</option>
                      <option value="Ward 10 - Banjara Hills" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Ward 10 - Banjara Hills</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="signup-email" className="block text-xs font-bold uppercase tracking-wider mb-1">
                      {t.auth.emailLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-phone" className="block text-xs font-bold uppercase tracking-wider mb-1">
                      {t.auth.phoneLabel}
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 90000 00000"
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="signup-password" className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-confirm-password" className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Confirm <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* 2FA Option */}
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enable2FA}
                    onChange={(e) => setEnable2FA(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-teal-600" /> Enable Two-Factor Authentication (2FA)
                    </span>
                    <span className="text-neutral-500 text-[11px] block">
                      Requires 6-digit verification code on login for increased account protection.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2 text-xs cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded mt-0.5"
                  />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {t.auth.privacyConsent}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md disabled:opacity-50 transition-all"
                >
                  {isLoading ? 'Creating Account...' : t.auth.signUpBtn}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('citizen_signin')}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    {t.auth.alreadyAccount}
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: MUNICIPAL ADMINISTRATION DESK */}
            {mode === 'admin_login' && (
              <form onSubmit={handleAdminSignIn} className="space-y-4">
                <div className="text-center pb-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black">Authorized Administrative Portal</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Restricted municipal command access for system maintenance, inventory, and complaint resolution.
                  </p>
                </div>

                <div>
                  <label htmlFor="admin-id" className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Administrator ID
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      id="admin-id"
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="Administrative ID"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm font-mono bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-500 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    All administrative sessions are logged with IP tracking for public accountability.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md transition-all font-mono uppercase tracking-wider disabled:opacity-50"
                >
                  {isLoading ? 'Authenticating Admin...' : 'Authenticate Officer Session'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2FA Verification Flow */}
      {pendingUser2FA && (
        <TwoFactorAuthModal
          isOpen={true}
          user={pendingUser2FA}
          onClose={() => setPendingUser2FA(null)}
          onSuccess={handleTwoFactorSuccess}
          isDark={isDark}
        />
      )}
    </>
  );
};
