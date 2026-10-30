import React, { useState } from 'react';
import { KeyRound, ShieldCheck, X } from 'lucide-react';
import { validateTwoFactorOtp } from '../utils/pureLogic.ts';
import { User } from '../types/index.ts';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (verifiedUser: User) => void;
  isDark: boolean;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
  isDark,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !user) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      // Validate using our pure logic function
      const isValid = validateTwoFactorOtp(code, user.twoFactorSecret);
      setIsVerifying(false);

      if (isValid) {
        onSuccess(user);
        onClose();
      } else {
        setError('Invalid authentication code. Please check your authenticator or SMS.');
      }
    }, 400);
  };

  const handleAutoFillDemo = () => {
    // Provide a convenient code for test demonstration
    const demoCode = user.twoFactorSecret || '123456';
    setCode(demoCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-6 transition-all ${
          isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">Two-Factor Authentication</h2>
              <p className="text-xs text-neutral-500">Security checkpoint for {user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="mt-4 space-y-4">
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            A temporary 6-digit authentication code has been generated for your registered security credential.
          </p>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-600 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="twofa-code" className="block text-xs font-bold uppercase tracking-wider mb-2">
              Enter 6-Digit OTP Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                id="twofa-code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-lg font-mono font-bold tracking-widest bg-transparent border-neutral-300 dark:border-neutral-700 text-center focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Fill Demo OTP (123456)
            </button>
            <span className="text-neutral-400 font-mono text-[11px]">Expires in 5m</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-lg text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md disabled:opacity-50 transition-all"
            >
              {isVerifying ? 'Verifying 2FA...' : 'Verify & Proceed to Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
