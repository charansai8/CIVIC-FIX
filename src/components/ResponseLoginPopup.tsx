import React from 'react';
import { ArrowRight, CheckCircle, MessageSquareQuote, ShieldAlert, X } from 'lucide-react';
import { Complaint, ComplaintResponse, InAppNotification } from '../types/index.ts';
import { store } from '../services/store.ts';

interface ResponseLoginPopupProps {
  items: {
    complaint: Complaint;
    response: ComplaintResponse;
    notification: InAppNotification;
  }[];
  isOpen: boolean;
  onClose: () => void;
  onViewResponse: (complaintId: string) => void;
  isDark: boolean;
}

export const ResponseLoginPopup: React.FC<ResponseLoginPopupProps> = ({
  items,
  isOpen,
  onClose,
  onViewResponse,
  isDark,
}) => {
  if (!isOpen || items.length === 0) return null;

  const currentItem = items[0];
  const { complaint, response, notification } = currentItem;

  const handleAcknowledgeAndView = () => {
    store.markNotificationAsRead(notification.id);
    onViewResponse(complaint.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-neutral-900 border-teal-500/50 text-white'
            : 'bg-white border-teal-600 text-neutral-900 ring-2 ring-teal-500/20'
        }`}
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-600"></div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 block">
                Official Municipal Notice
              </span>
              <h2 className="text-lg font-black leading-tight">
                📩 You&apos;ve Received an Official Response!
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close notification alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            An administrator has published an official response regarding your reported infrastructure grievance:
          </p>

          {/* Complaint Context Card */}
          <div className="p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                {complaint.referenceNo}
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                Status: {complaint.status.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-sm font-bold leading-snug">{complaint.title}</h3>

            <div className="text-[11px] text-neutral-500">
              Location: {complaint.locationAddress} ({complaint.ward})
            </div>

            {/* Official Response Quote Box */}
            <div className="mt-3 p-3.5 rounded-lg border-l-4 border-teal-500 bg-white dark:bg-neutral-900 text-xs shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase">
                <span>{response.administratorName}</span>
                <span>{new Date(response.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-neutral-800 dark:text-neutral-200 italic font-medium">
                &ldquo;{response.responseText}&rdquo;
              </p>
            </div>
          </div>

          {items.length > 1 && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold text-center">
              + You have {items.length - 1} other unread update in your notifications inbox.
            </p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 px-6 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Review Later
          </button>

          <button
            onClick={handleAcknowledgeAndView}
            className="px-5 py-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>View Full Case File &amp; Reply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
