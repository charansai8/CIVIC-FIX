import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Filter,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Complaint, ComplaintCategory, SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { VectorEvidencePhoto } from './VectorEvidencePhoto.tsx';

interface SolvedIssuesShowcaseProps {
  complaints: Complaint[];
  currentLang: SupportedLanguage;
  isDark: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenReportModal: () => void;
}

export const SolvedIssuesShowcase: React.FC<SolvedIssuesShowcaseProps> = ({
  complaints,
  currentLang,
  isDark,
  onSelectComplaint,
  onOpenReportModal,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhotoView, setActivePhotoView] = useState<Record<string, 'before' | 'after'>>({});

  // Filter for resolved complaints only
  const solvedComplaints = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'closed'
  );

  const filtered = solvedComplaints.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.referenceNo.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.reporterName.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories: { key: ComplaintCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'roads_potholes', label: t.categories.roads_potholes },
    { key: 'streetlights', label: t.categories.streetlights },
    { key: 'water_supply', label: t.categories.water_supply },
    { key: 'drainage_sewage', label: t.categories.drainage_sewage },
    { key: 'garbage_sanitation', label: t.categories.garbage_sanitation },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-900 text-white dark:bg-neutral-950 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Verified Public Infrastructure Resolutions
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Wall of Resolved Civic Grievances</h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
              Transparent proof of municipal accountability. Inspect resolved complaints, before-and-after photo evidence, reporter credits, and official completion dates.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-800/80 p-4 rounded-xl border border-neutral-700 shrink-0">
            <div className="text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {solvedComplaints.length}
              </span>
              <span className="block text-[10px] uppercase font-bold text-neutral-400">
                Verified Fixes
              </span>
            </div>
            <div className="h-8 w-px bg-neutral-700"></div>
            <div className="text-center">
              <span className="text-2xl font-black text-teal-400 font-mono">100%</span>
              <span className="block text-[10px] uppercase font-bold text-neutral-400">
                Photo Proof
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold uppercase">Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 focus:outline-hidden"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resolved issues or reporters..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Grid of Solved Issue Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
          <CheckCircle className="w-12 h-12 mx-auto text-neutral-400 mb-2" />
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No resolved issues matching criteria.</p>
          <p className="text-xs text-neutral-500 mt-1">Try selecting all categories or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const currentPhotoMode = activePhotoView[item.id] || (item.resolutionPhotoUrl ? 'after' : 'before');
            const displayPhoto = currentPhotoMode === 'after' && item.resolutionPhotoUrl
              ? item.resolutionPhotoUrl
              : item.photoUrl;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                }`}
              >
                <div>
                  {/* Card Header with Reporter, Ref, Solved Date */}
                  <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                          {item.referenceNo}
                        </span>
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Resolved
                        </span>
                      </div>
                      <h3 className="text-base font-black leading-snug mt-1.5">{item.title}</h3>
                    </div>
                  </div>

                  {/* Photo Evidence with Before/After Toggle */}
                  <div className="relative bg-neutral-100 dark:bg-neutral-800 aspect-16/9 flex items-center justify-center overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
                    <VectorEvidencePhoto
                      title={currentPhotoMode === 'after' ? 'ASPHALT REPAIRED & LEVELED' : item.title}
                      category={item.category}
                      type={currentPhotoMode === 'after' ? 'resolved' : 'warning'}
                      photoUrl={displayPhoto}
                    />

                    {/* Before / After Switcher Badge */}
                    {item.resolutionPhotoUrl && (
                      <div className="absolute top-3 right-3 z-10 inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-900/90 text-white p-0.5 backdrop-blur-xs text-[10px] font-bold">
                        <button
                          onClick={() =>
                            setActivePhotoView((prev) => ({ ...prev, [item.id]: 'before' }))
                          }
                          className={`px-2.5 py-1 rounded transition-colors ${
                            currentPhotoMode === 'before'
                              ? 'bg-rose-600 text-white'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                        >
                          Reported State
                        </button>
                        <button
                          onClick={() =>
                            setActivePhotoView((prev) => ({ ...prev, [item.id]: 'after' }))
                          }
                          className={`px-2.5 py-1 rounded transition-colors ${
                            currentPhotoMode === 'after'
                              ? 'bg-emerald-600 text-white'
                              : 'text-neutral-300 hover:text-white'
                          }`}
                        >
                          Fixed Proof ✓
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Reporter & Solved Date Showcase */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                          <User className="w-3 h-3 text-teal-600" />
                          Problem Reporter
                        </span>
                        <strong className="block font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                          {item.reporterName}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          Solved Date
                        </span>
                        <strong className="block font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : 'Verified Fixed'}
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-semibold">{item.locationAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Layers className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{item.ward} • {item.locality}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Official Resolution Summary */}
                    {item.resolutionNotes && (
                      <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                          Department Resolution Note:
                        </span>
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {item.resolutionNotes}
                        </p>
                        {item.departmentAssigned && (
                          <span className="text-[10px] font-semibold text-neutral-400 block mt-1 font-mono">
                            Authority: {item.departmentAssigned}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800 mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    Public Audit Record
                  </span>
                  <button
                    onClick={() => onSelectComplaint(item)}
                    className="px-4 py-2 rounded-lg text-xs font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    View Complete Case File
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-6 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-center space-y-3">
        <h3 className="text-base font-black">Spotted an infrastructure hazard in your ward?</h3>
        <p className="text-xs text-neutral-500 max-w-lg mx-auto">
          Take a photo, log the exact street location, and notify municipal squads immediately.
        </p>
        <button
          onClick={onOpenReportModal}
          className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm"
        >
          + Report an Issue Now
        </button>
      </div>
    </div>
  );
};
