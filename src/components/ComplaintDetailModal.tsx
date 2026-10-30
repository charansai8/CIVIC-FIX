import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { Complaint, SupportedLanguage, User as UserType } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { store } from '../services/store.ts';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  currentLang: SupportedLanguage;
  isDark: boolean;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  currentUser,
  currentLang,
  isDark,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [noteText, setNoteText] = useState('');
  const [activePhoto, setActivePhoto] = useState<'evidence' | 'resolution'>('evidence');

  if (!isOpen || !complaint) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !noteText.trim()) return;

    store.addCitizenNote(complaint.id, currentUser, noteText.trim());
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl my-8 rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-black text-teal-600 dark:text-teal-400">
              {complaint.referenceNo}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                complaint.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : complaint.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
              }`}
            >
              {complaint.status.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl font-black leading-snug">{complaint.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Reported by: <strong>{complaint.reporterName}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {new Date(complaint.submittedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {complaint.ward} ({complaint.locality})
              </span>
            </div>
          </div>

          {/* Photo Evidence / Resolution proof */}
          <div>
            {complaint.resolutionPhotoUrl && (
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActivePhoto('evidence')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                    activePhoto === 'evidence'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  Reported Evidence
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto('resolution')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                    activePhoto === 'resolution'
                      ? 'bg-emerald-600 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 text-emerald-600'
                  }`}
                >
                  Verified Resolution Proof ✓
                </button>
              </div>
            )}

            <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 aspect-16/9 flex items-center justify-center">
              {activePhoto === 'resolution' && complaint.resolutionPhotoUrl ? (
                <img
                  src={complaint.resolutionPhotoUrl}
                  alt="Verified resolution"
                  className="w-full h-full object-cover"
                />
              ) : complaint.photoUrl ? (
                <img
                  src={complaint.photoUrl}
                  alt="Reported problem"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-neutral-400">No photographic evidence attached</div>
              )}
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Grievance Description
            </span>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              {complaint.description}
            </p>
          </div>

          {/* Location & Authority Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 font-bold uppercase block mb-1">
                Physical Location
              </span>
              <p className="font-semibold">{complaint.locationAddress}</p>
              <p className="text-neutral-500 font-mono text-[11px] mt-1">
                Lat: {complaint.lat.toFixed(4)}, Lng: {complaint.lng.toFixed(4)}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 font-bold uppercase block mb-1">
                Responsible Division
              </span>
              <p className="font-semibold">
                {complaint.departmentAssigned || 'Municipal Public Works'}
              </p>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                Urgency: {complaint.priority.toUpperCase()} ({complaint.severity})
              </span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Audit Resolution Timeline
            </h4>

            <div className="relative pl-6 space-y-4 border-l-2 border-teal-500/40 ml-2 text-xs">
              {complaint.history.map((step) => (
                <div key={step.id} className="relative">
                  <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white dark:border-neutral-900"></div>
                  <div className="flex items-center justify-between font-bold">
                    <span className="uppercase text-[11px] text-teal-600 dark:text-teal-400">
                      {step.newStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {new Date(step.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs mt-0.5">
                    {step.changeComment}
                  </p>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    By {step.changedBy} ({step.changedByRole})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Responses */}
          {complaint.responses && complaint.responses.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Official Administrative Responses
              </h4>

              {complaint.responses.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/20 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase">
                    <span>{r.administratorName} {r.isEdited && '(Edited)'}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                    &ldquo;{r.responseText}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Citizen Follow-up Notes */}
          {currentUser && (
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase text-neutral-400 block">
                Submit Follow-up Feedback / Note
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Have an update or verified the physical fix? Leave a note..."
                  className="flex-1 px-3 py-1.5 rounded-lg border text-xs bg-transparent border-neutral-300 dark:border-neutral-700"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Post
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
