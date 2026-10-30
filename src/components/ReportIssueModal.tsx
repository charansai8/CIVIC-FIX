import React, { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Copy,
  FileText,
  MapPin,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { ComplaintCategory, SeverityLevel, SupportedLanguage, User } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { calculateDefaultPriority } from '../utils/pureLogic.ts';
import { createVectorPhotoUrl, store } from '../services/store.ts';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentLang: SupportedLanguage;
  isDark: boolean;
  onOpenAuth: () => void;
  onViewComplaint: (complaintId: string) => void;
  initialCategory?: ComplaintCategory;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLang,
  isDark,
  onOpenAuth,
  onViewComplaint,
  initialCategory,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>(initialCategory || 'roads_potholes');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [locationAddress, setLocationAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [ward, setWard] = useState('Ward 12 - Madhapur');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Pre-configured wards for realistic municipal administration
  const wards = [
    'Ward 12 - Madhapur / HITEC City',
    'Ward 14 - Gachibowli',
    'Ward 07 - Begumpet',
    'Ward 10 - Banjara Hills',
    'Ward 18 - Jubilee Hills',
    'Ward 04 - Charminar / Old City',
    'Ward 22 - Kukatpally',
    'Ward 02 - Secunderabad',
  ];

  const categories: { key: ComplaintCategory; label: string; icon: string }[] = [
    { key: 'roads_potholes', label: t.categories.roads_potholes, icon: '🛣️' },
    { key: 'streetlights', label: t.categories.streetlights, icon: '💡' },
    { key: 'water_supply', label: t.categories.water_supply, icon: '🚰' },
    { key: 'drainage_sewage', label: t.categories.drainage_sewage, icon: '🌊' },
    { key: 'garbage_sanitation', label: t.categories.garbage_sanitation, icon: '🗑️' },
    { key: 'public_infra', label: t.categories.public_infra, icon: '🏗️' },
    { key: 'other', label: t.categories.other, icon: '⚠️' },
  ];

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const selectSamplePhoto = () => {
    // Generate clean vector photo preview for instant proof
    const colorScheme = severity === 'critical' ? 'danger' : severity === 'high' ? 'warning' : 'info';
    const sample = createVectorPhotoUrl(title || 'EVIDENCE PHOTO', category, colorScheme);
    setPhotoPreview(sample);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationAddress('Cyber Towers Outer Ring Junction, HITEC City');
          setLocality('Madhapur');
          setWard('Ward 12 - Madhapur / HITEC City');
        },
        () => {
          setLocationAddress('Main Commercial Road, Ward 12');
          setLocality('Madhapur');
        }
      );
    } else {
      setLocationAddress('Main Commercial Road, Ward 12');
      setLocality('Madhapur');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!title.trim() || !description.trim() || !locationAddress.trim()) {
      setErrorMessage('Please fill in the complaint title, description, and location address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      try {
        const priority = calculateDefaultPriority(category, severity);
        const newComplaint = store.submitComplaint({
          userId: currentUser.id,
          reporterName: currentUser.fullName,
          reporterEmail: currentUser.email,
          reporterPhone: currentUser.mobileNumber,
          title: title.trim(),
          description: description.trim(),
          category,
          severity,
          priority,
          status: 'submitted',
          locationAddress: locationAddress.trim(),
          locality: locality.trim() || 'Central Ward',
          ward,
          city: currentUser.city || 'Hyderabad',
          state: currentUser.state || 'Telangana',
          lat: 17.448 + (Math.random() - 0.5) * 0.05,
          lng: 78.38 + (Math.random() - 0.5) * 0.05,
          photoUrl: photoPreview || createVectorPhotoUrl(title.trim(), category, 'danger'),
          departmentAssigned: 'Municipal Engineering & Public Works Division',
        });

        setSubmittedRef(newComplaint.referenceNo);
        setSubmittedId(newComplaint.id);
        setIsSubmitting(false);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage('Failed to save complaint. Please try again.');
        console.error(err);
      }
    }, 600);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocationAddress('');
    setLocality('');
    setPhotoPreview(null);
    setSubmittedRef(null);
    setSubmittedId(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl my-8 rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-600 text-white text-xs font-black">CIVIC</span>
            <div>
              <h2 className="text-lg font-bold leading-tight">{t.reportModal.heading}</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.reportModal.subheading}</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen after submission */}
        {submittedRef ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black">{t.reportModal.successTitle}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {t.reportModal.successMessage}
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/80 inline-flex flex-col items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {t.reportModal.refNoLabel}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-black font-mono tracking-wider text-teal-600 dark:text-teal-400">
                  {submittedRef}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedRef);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                  title="Copy reference number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-emerald-500 font-bold mt-1">Copied to clipboard!</span>}
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Our engineering team has been alerted. You will receive an immediate in-app notification when the administrative division begins inspection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              {submittedId && (
                <button
                  onClick={() => {
                    onViewComplaint(submittedId);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white"
                >
                  {t.reportModal.viewComplaint}
                </button>
              )}
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-bold border border-neutral-400 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Complaint Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Citizen Authentication Notice */}
            {!currentUser && (
              <div className="p-3.5 rounded-xl border border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>You are browsing as a guest. Please sign in to record this issue under your citizen profile.</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="font-bold underline text-teal-600 dark:text-teal-400 whitespace-nowrap ml-2"
                >
                  Sign In Now
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="complaint-title" className="block text-xs font-bold uppercase tracking-wider mb-1">
                {t.reportModal.titleLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                id="complaint-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.reportModal.titlePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium bg-transparent border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Category Selector Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                {t.reportModal.categoryLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                      category === c.key
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500'
                        : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                {t.reportModal.severityLabel}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'critical'] as SeverityLevel[]).map((sev) => {
                  const colors = {
                    low: 'text-neutral-700 border-neutral-300 dark:border-neutral-700',
                    medium: 'text-sky-600 border-sky-400',
                    high: 'text-amber-600 border-amber-400',
                    critical: 'text-rose-600 border-rose-500 bg-rose-50 dark:bg-rose-950/30',
                  }[sev];

                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 px-2 rounded-lg border text-xs font-bold uppercase text-center transition-all ${
                        severity === sev ? `ring-2 ring-neutral-900 dark:ring-white ${colors}` : 'opacity-60'
                      }`}
                    >
                      {t.severity[sev]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label htmlFor="complaint-desc" className="block text-xs font-bold uppercase tracking-wider mb-1">
                {t.reportModal.descriptionLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="complaint-desc"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.reportModal.descriptionPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium bg-transparent border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            {/* Location & Ward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="complaint-location" className="block text-xs font-bold uppercase tracking-wider">
                    {t.reportModal.locationLabel} <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> Auto-Detect
                  </button>
                </div>
                <input
                  id="complaint-location"
                  type="text"
                  required
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder={t.reportModal.locationPlaceholder}
                  className="w-full px-3.5 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="complaint-ward" className="block text-xs font-bold uppercase tracking-wider mb-1">
                  {t.reportModal.wardLabel}
                </label>
                <select
                  id="complaint-ward"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border text-sm bg-transparent border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  {wards.map((w) => (
                    <option key={w} value={w} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo Evidence Upload Tool */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                {t.reportModal.photoLabel}
              </label>
              <p className="text-[11px] text-neutral-500 mb-2">{t.reportModal.photoHelp}</p>

              {photoPreview ? (
                <div className="relative rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-2 flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Uploaded evidence preview"
                    className="max-h-52 w-auto object-contain rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-5 text-center bg-neutral-50 dark:bg-neutral-950 hover:border-teal-500 transition-colors">
                  <UploadCloud className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Drag and drop evidence image, or{' '}
                    <label className="text-teal-600 dark:text-teal-400 cursor-pointer underline">
                      browse files
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={selectSamplePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                      Attach Simulated Vector Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submission Actions */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? t.reportModal.submitting : t.reportModal.submitBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
