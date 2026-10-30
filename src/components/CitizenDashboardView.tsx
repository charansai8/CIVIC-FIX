import React, { useState } from 'react';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Shield,
  ShieldAlert,
  User as UserIcon,
} from 'lucide-react';
import { Complaint, SupportedLanguage, User } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { store } from '../services/store.ts';

interface CitizenDashboardViewProps {
  currentUser: User;
  currentLang: SupportedLanguage;
  isDark: boolean;
  onOpenReportModal: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  currentUser,
  currentLang,
  isDark,
  onOpenReportModal,
  onSelectComplaint,
}) => {
  const t = TRANSLATIONS[currentLang];

  const complaints = store.getComplaints().filter((c) => c.userId === currentUser.id);
  const notifications = store.getNotificationsForUser(currentUser.id);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );
  const [citizenNoteText, setCitizenNoteText] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editFullName, setEditFullName] = useState(currentUser.fullName);
  const [editPhone, setEditPhone] = useState(currentUser.mobileNumber || '');
  const [editWard, setEditWard] = useState(currentUser.ward || 'Ward 12 - Madhapur');
  const [edit2FA, setEdit2FA] = useState(currentUser.twoFactorEnabled);
  const [profileMsg, setProfileMsg] = useState('');

  // Statistics
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const underReviewCount = complaints.filter((c) => c.status === 'under_review' || c.status === 'submitted').length;

  const handleSendCitizenNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !citizenNoteText.trim()) return;

    store.addCitizenNote(selectedComplaint.id, currentUser, citizenNoteText.trim());
    setCitizenNoteText('');

    const updated = store.getComplaintById(selectedComplaint.id);
    if (updated) setSelectedComplaint(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateUserProfile(currentUser.id, {
      fullName: editFullName.trim(),
      mobileNumber: editPhone.trim(),
      ward: editWard,
      twoFactorEnabled: edit2FA,
    });
    setProfileMsg('Profile updated successfully.');
    setTimeout(() => {
      setProfileMsg('');
      setShowProfileModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Citizen Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-900 text-white dark:bg-neutral-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Verified Resident Citizen
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {currentUser.ward || 'General Division'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t.dashboard.welcome}, {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
            Track your reported infrastructure problems, read official municipal responses, and submit progress notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5" /> Edit Profile &amp; 2FA
          </button>
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Report Issue
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-neutral-400">Total Grievances</span>
          <span className="block text-2xl font-black font-mono mt-1">{complaints.length}</span>
          <span className="text-[11px] text-neutral-500">Filed by your account</span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-amber-500">Under Review</span>
          <span className="block text-2xl font-black font-mono text-amber-500 mt-1">
            {underReviewCount}
          </span>
          <span className="text-[11px] text-neutral-500">Awaiting squad dispatch</span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-sky-500">In Active Progress</span>
          <span className="block text-2xl font-black font-mono text-sky-500 mt-1">
            {inProgressCount}
          </span>
          <span className="text-[11px] text-neutral-500">Engineering work underway</span>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-emerald-500">Resolved &amp; Closed</span>
          <span className="block text-2xl font-black font-mono text-emerald-500 mt-1">
            {resolvedCount}
          </span>
          <span className="text-[11px] text-neutral-500">Verified by authorities</span>
        </div>
      </div>

      {/* Location-based Public Alert Banner */}
      <div className="p-4 rounded-xl border border-teal-500/40 bg-teal-50/70 dark:bg-teal-950/30 flex items-start gap-3">
        <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-teal-900 dark:text-teal-200 block">
            Ward Alert for {currentUser.ward || 'Your Locality'}
          </span>
          <p className="text-neutral-700 dark:text-neutral-300 mt-0.5">
            Monsoon pipeline maintenance and rapid asphalt cold-patch squads are operating in this ward. Emergency teams respond within 24 hours of verified photo reports.
          </p>
        </div>
      </div>

      {/* Main Grid: My Complaints List (Left) + Detail & Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaints list */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500">
            {t.dashboard.myComplaints} ({complaints.length})
          </h3>

          {complaints.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 mx-auto text-neutral-400" />
              <p className="text-xs font-bold">{t.dashboard.emptyComplaints}</p>
              <p className="text-[11px] text-neutral-500">{t.dashboard.emptyComplaintsDesc}</p>
              <button
                onClick={onOpenReportModal}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 text-white"
              >
                + Report Now
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {complaints.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;
                const hasOfficialResp = c.responses && c.responses.length > 0;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 ring-2 ring-teal-500/30'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        : 'bg-white border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                          {c.referenceNo}
                        </span>
                        <h4 className="text-sm font-black leading-snug mt-1">{c.title}</h4>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : c.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
                      <span>{c.ward}</span>
                      <span>{new Date(c.submittedAt).toLocaleDateString()}</span>
                    </div>

                    {hasOfficialResp && (
                      <div className="mt-2 text-[11px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> 1 Official Response Received
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Complaint Inspector & Lifecycle Timeline */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div
              className={`p-6 rounded-2xl border space-y-5 ${
                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                    {selectedComplaint.referenceNo}
                  </span>
                  <h3 className="text-lg font-black leading-snug mt-1">{selectedComplaint.title}</h3>
                </div>
                <button
                  onClick={() => onSelectComplaint(selectedComplaint)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Photo Evidence Comparison (if resolved) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedComplaint.photoUrl && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                      Reported Evidence
                    </span>
                    <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 aspect-16/10 bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={selectedComplaint.photoUrl}
                        alt="Initial evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {selectedComplaint.resolutionPhotoUrl && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-500 block mb-1">
                      Official Fixed Proof ✓
                    </span>
                    <div className="rounded-xl overflow-hidden border border-emerald-500 aspect-16/10 bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={selectedComplaint.resolutionPhotoUrl}
                        alt="Resolution proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description & Address */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-semibold">{selectedComplaint.locationAddress}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Resolution Progress Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
                  Official Status &amp; Progress History
                </h4>

                <div className="relative pl-6 space-y-4 border-l-2 border-teal-500/40 ml-2 text-xs">
                  {selectedComplaint.history.map((step) => (
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

              {/* Official Administrative Responses Received */}
              {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Official Responses from Municipal Engineers
                  </h4>

                  {selectedComplaint.responses.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-xl border border-teal-400/40 bg-teal-50/50 dark:bg-teal-950/20 text-xs space-y-1.5"
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

              {/* Citizen Add Note / Follow-up Message */}
              <form onSubmit={handleSendCitizenNote} className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-xs font-bold uppercase text-neutral-400 block">
                  Add Citizen Follow-up Note
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={citizenNoteText}
                    onChange={(e) => setCitizenNoteText(e.target.value)}
                    placeholder="Provide additional details or verify work..."
                    className="flex-1 px-3 py-1.5 rounded-lg border text-xs bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {selectedComplaint.citizenNotes && selectedComplaint.citizenNotes.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {selectedComplaint.citizenNotes.map((note, idx) => (
                      <p key={idx} className="text-[11px] text-neutral-500 italic">
                        • {note}
                      </p>
                    ))}
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-neutral-300 dark:border-neutral-800 text-neutral-500 text-xs">
              Select any reported grievance to inspect its timeline and responses.
            </div>
          )}
        </div>
      </div>

      {/* Profile & 2FA Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
              isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
            }`}
          >
            <h3 className="text-base font-bold mb-4">Edit Citizen Profile &amp; Security</h3>

            {profileMsg && (
              <div className="p-2.5 mb-3 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Residential Ward</label>
                <input
                  type="text"
                  value={editWard}
                  onChange={(e) => setEditWard(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                />
              </div>

              {/* 2FA Toggle */}
              <label className="flex items-center gap-2 p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={edit2FA}
                  onChange={(e) => setEdit2FA(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <div>
                  <span className="font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-teal-600" /> Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Secures account login with 6-digit OTP verification code.
                  </span>
                </div>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-bold bg-teal-600 text-white"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
