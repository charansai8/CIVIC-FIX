import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  MapPin,
  Search,
  User,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Complaint, ComplaintCategory, SupportedLanguage } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { VectorEvidencePhoto } from './VectorEvidencePhoto.tsx';

interface InteractiveMapViewProps {
  complaints: Complaint[];
  currentLang: SupportedLanguage;
  isDark: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenReportModal: () => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  complaints,
  currentLang,
  isDark,
  onSelectComplaint,
  onOpenReportModal,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints based on user selection
  const filtered = complaints.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (statusFilter === 'active' && (c.status === 'resolved' || c.status === 'closed')) return false;
    if (statusFilter === 'resolved' && c.status !== 'resolved') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.referenceNo.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate coordinates mapping onto vector SVG canvas (viewBox 0 0 1000 600)
  // Base geographic bounds around Hyderabad (lat 17.38 - 17.52, lng 78.30 - 78.55)
  const minLat = 17.38;
  const maxLat = 17.52;
  const minLng = 78.30;
  const maxLng = 78.55;

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 60;
    const y = 600 - (((lat - minLat) / (maxLat - minLat)) * 480 + 60);
    return {
      x: Math.max(70, Math.min(930, x)),
      y: Math.max(70, Math.min(530, y)),
    };
  };

  const categories: { key: ComplaintCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Domains' },
    { key: 'roads_potholes', label: t.categories.roads_potholes },
    { key: 'streetlights', label: t.categories.streetlights },
    { key: 'water_supply', label: t.categories.water_supply },
    { key: 'drainage_sewage', label: t.categories.drainage_sewage },
    { key: 'garbage_sanitation', label: t.categories.garbage_sanitation },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-xs">
        <div>
          <h2 className="text-lg font-black flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            {t.map.title}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.map.subtitle}</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-0.5 bg-white dark:bg-neutral-800 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              {t.map.filterAll} ({complaints.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                statusFilter === 'active'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-600" />
              {t.map.filterActive}
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-neutral-600 dark:text-neutral-300'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {t.map.filterResolved}
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-neutral-900 dark:text-white cursor-pointer focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, locality..."
              className="pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 w-44 focus:w-56 transition-all focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Main Map + Side Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vector SVG Map Surface */}
        <div className="lg:col-span-2 relative rounded-2xl border border-neutral-300 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-950 p-2 shadow-inner">
          {/* Zoom & Overlay Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs p-1 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-md">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
              aria-label="Zoom in map"
              className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              aria-label="Zoom out map"
              className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-0.5"></div>
            <button
              onClick={() => setZoomLevel(1)}
              aria-label="Reset zoom"
              className="text-[10px] font-bold text-center text-teal-600 dark:text-teal-400 py-0.5"
            >
              100%
            </button>
          </div>

          {/* Map Status Legend */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Resolved ({complaints.filter((c) => c.status === 'resolved').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              In Progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              Critical / Action Needed
            </span>
          </div>

          {/* Precision SVG Vector Map Canvas */}
          <div className="w-full aspect-16/10 overflow-hidden cursor-crosshair">
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              {/* Background grid pattern */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={isDark ? '#262626' : '#E5E7EB'}
                    strokeWidth="1"
                  />
                </pattern>
                <linearGradient id="wardGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#171717' : '#F8FAFC'} />
                  <stop offset="100%" stopColor={isDark ? '#0A0A0A' : '#EFF6FF'} />
                </linearGradient>
              </defs>

              <rect width="1000" height="600" fill="url(#grid)" />

              {/* Vector Ward Boundaries (Geometric zones representing Municipal Divisions) */}
              <g stroke={isDark ? '#404040' : '#CBD5E1'} strokeWidth="1.5" strokeDasharray="3 3">
                {/* Ward 12 Madhapur */}
                <path
                  d="M 80 120 L 320 80 L 390 280 L 190 320 Z"
                  fill={isDark ? '#1E293B' : '#F1F5F9'}
                  fillOpacity="0.4"
                />
                <text x="210" y="190" fontSize="12" fontWeight="800" fill={isDark ? '#64748B' : '#94A3B8'} fontFamily="monospace">
                  WARD 12 (HITEC / MADHAPUR)
                </text>

                {/* Ward 14 Gachibowli */}
                <path
                  d="M 80 340 L 320 320 L 300 520 L 90 480 Z"
                  fill={isDark ? '#0F172A' : '#E2E8F0'}
                  fillOpacity="0.4"
                />
                <text x="140" y="420" fontSize="12" fontWeight="800" fill={isDark ? '#64748B' : '#94A3B8'} fontFamily="monospace">
                  WARD 14 (GACHIBOWLI)
                </text>

                {/* Ward 10 Banjara Hills */}
                <path
                  d="M 360 140 L 640 100 L 680 320 L 410 340 Z"
                  fill={isDark ? '#1E293B' : '#F1F5F9'}
                  fillOpacity="0.4"
                />
                <text x="470" y="220" fontSize="12" fontWeight="800" fill={isDark ? '#64748B' : '#94A3B8'} fontFamily="monospace">
                  WARD 10 (BANJARA HILLS)
                </text>

                {/* Ward 07 Begumpet */}
                <path
                  d="M 660 80 L 920 90 L 910 290 L 700 310 Z"
                  fill={isDark ? '#0F172A' : '#E2E8F0'}
                  fillOpacity="0.4"
                />
                <text x="740" y="180" fontSize="12" fontWeight="800" fill={isDark ? '#64748B' : '#94A3B8'} fontFamily="monospace">
                  WARD 07 (BEGUMPET)
                </text>

                {/* Ward 04 Charminar Old City */}
                <path
                  d="M 440 360 L 780 340 L 750 540 L 390 530 Z"
                  fill={isDark ? '#1E293B' : '#F1F5F9'}
                  fillOpacity="0.4"
                />
                <text x="520" y="450" fontSize="12" fontWeight="800" fill={isDark ? '#64748B' : '#94A3B8'} fontFamily="monospace">
                  WARD 04 (OLD CITY / CENTRAL)
                </text>
              </g>

              {/* Major Roads Vector Arteries */}
              <g stroke={isDark ? '#525252' : '#94A3B8'} strokeWidth="3" fill="none" strokeLinecap="round">
                <path d="M 100 240 Q 400 260 900 210" /> {/* Outer Ring Road */}
                <path d="M 280 80 L 280 520" /> {/* North-South Expressway */}
                <path d="M 520 100 L 520 530" /> {/* Metro Corridor */}
              </g>

              {/* Interactive Complaint Vector Pins */}
              {filtered.map((item) => {
                const { x, y } = projectToMap(item.lat, item.lng);
                const isSelected = selectedComplaint?.id === item.id;
                const isResolved = item.status === 'resolved' || item.status === 'closed';
                const isCritical = item.severity === 'critical';

                const pinFill = isResolved ? '#10B981' : isCritical ? '#EF4444' : '#F59E0B';

                return (
                  <g
                    key={item.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedComplaint(item)}
                    className="cursor-pointer transition-transform duration-150 hover:scale-125"
                    role="button"
                    tabIndex={0}
                    aria-label={`Complaint pin: ${item.title}`}
                  >
                    {/* Pulsing ring for critical/unresolved items */}
                    {isCritical && !isResolved && (
                      <circle cx="0" cy="-22" r="16" fill="#EF4444" fillOpacity="0.25">
                        <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Pin shape */}
                    <path
                      d="M 0 0 L -8 -18 C -14 -22 -14 -32 0 -36 C 14 -32 14 -22 8 -18 Z"
                      fill={pinFill}
                      stroke={isSelected ? '#FFFFFF' : '#0F172A'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                    />

                    {/* Center icon or dot */}
                    <circle cx="0" cy="-24" r="4.5" fill="#FFFFFF" />

                    {/* Pin Label on Hover or Active */}
                    {isSelected && (
                      <g transform="translate(0, -44)">
                        <rect
                          x="-60"
                          y="-20"
                          width="120"
                          height="20"
                          rx="4"
                          fill="#0F172A"
                          stroke="#FFFFFF"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-6"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {item.referenceNo}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Complaint Inspector Card */}
        <div className="rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between shadow-xs">
          {selectedComplaint ? (
            <div className="space-y-4">
              {/* Header with reference and status */}
              <div className="flex items-start justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                    {selectedComplaint.referenceNo}
                  </span>
                  <h3 className="text-base font-black leading-snug mt-0.5">{selectedComplaint.title}</h3>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    selectedComplaint.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : selectedComplaint.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {selectedComplaint.status.replace('_', ' ')}
                </span>
              </div>

              {/* Photo Evidence Thumbnail */}
              {selectedComplaint.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 aspect-16/9 flex items-center justify-center">
                  <VectorEvidencePhoto
                    title={selectedComplaint.title}
                    category={selectedComplaint.category}
                    type={selectedComplaint.status === 'resolved' ? 'resolved' : 'warning'}
                    photoUrl={selectedComplaint.photoUrl}
                  />
                </div>
              )}

              {/* Location & Metadata */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold">{selectedComplaint.locationAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Layers className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>
                    {selectedComplaint.ward} • {selectedComplaint.locality}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>
                    Reported by: <strong className="text-neutral-800 dark:text-neutral-200">{selectedComplaint.reporterName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Filed: {new Date(selectedComplaint.submittedAt).toLocaleDateString()}</span>
                </div>
                {selectedComplaint.resolvedAt && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Solved on: {new Date(selectedComplaint.resolvedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description preview */}
              <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 bg-neutral-50 dark:bg-neutral-800/50 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                {selectedComplaint.description}
              </p>

              {/* Resolution proof or official response note */}
              {selectedComplaint.responses && selectedComplaint.responses.length > 0 && (
                <div className="p-3 rounded-lg border border-teal-500/40 bg-teal-50/60 dark:bg-teal-950/30 text-xs">
                  <span className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    Official Department Update
                  </span>
                  <p className="text-neutral-700 dark:text-neutral-300 line-clamp-2">
                    {selectedComplaint.responses[selectedComplaint.responses.length - 1].responseText}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500 text-xs my-auto">
              Click any pin on the map to inspect civic report details.
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            {selectedComplaint && (
              <button
                onClick={() => onSelectComplaint(selectedComplaint)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Inspect Full Case</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onOpenReportModal}
              className="py-2 px-3 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all"
            >
              + Report Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
