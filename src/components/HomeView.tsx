import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  FileCheck,
  Flame,
  HelpCircle,
  Layers,
  MapPin,
  MessageSquare,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { Complaint, ComplaintCategory, SupportedLanguage, User as UserType } from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { store } from '../services/store.ts';

interface HomeViewProps {
  currentLang: SupportedLanguage;
  isDark: boolean;
  currentUser: UserType | null;
  onOpenReportModal: (category?: ComplaintCategory) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSelectTab: (tab: string) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLang,
  isDark,
  currentUser,
  onOpenReportModal,
  onOpenAuth,
  onSelectTab,
  onSelectComplaint,
}) => {
  const t = TRANSLATIONS[currentLang];
  const complaints = store.getComplaints();
  const stats = store.getRegionalStats();

  const categories: {
    key: ComplaintCategory;
    title: string;
    desc: string;
    icon: string;
    count: number;
  }[] = [
    {
      key: 'roads_potholes',
      title: t.categories.roads_potholes,
      desc: 'Potholes, broken tar, missing manhole covers, speed breaker damage.',
      icon: '🛣️',
      count: complaints.filter((c) => c.category === 'roads_potholes').length,
    },
    {
      key: 'streetlights',
      title: t.categories.streetlights,
      desc: 'Dark pole clusters, flickering sodium lamps, open junction boxes.',
      icon: '💡',
      count: complaints.filter((c) => c.category === 'streetlights').length,
    },
    {
      key: 'water_supply',
      title: t.categories.water_supply,
      desc: 'Pipeline bursts, contaminated municipal supply, low pressure issues.',
      icon: '🚰',
      count: complaints.filter((c) => c.category === 'water_supply').length,
    },
    {
      key: 'drainage_sewage',
      title: t.categories.drainage_sewage,
      desc: 'Blocked monsoon storm drains, overflowing sewer chambers.',
      icon: '🌊',
      count: complaints.filter((c) => c.category === 'drainage_sewage').length,
    },
    {
      key: 'garbage_sanitation',
      title: t.categories.garbage_sanitation,
      desc: 'Overflowing dumpsters, unattended roadside debris, public hygiene.',
      icon: '🗑️',
      count: complaints.filter((c) => c.category === 'garbage_sanitation').length,
    },
    {
      key: 'public_infra',
      title: t.categories.public_infra,
      desc: 'Damaged footpaths, broken guardrails, bus shelter collapse.',
      icon: '🏗️',
      count: complaints.filter((c) => c.category === 'public_infra').length,
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-300 dark:border-neutral-800 bg-neutral-900 text-white dark:bg-neutral-950 p-8 sm:p-14 shadow-xl">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            {t.hero.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onOpenReportModal()}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-teal-500 hover:bg-teal-400 text-neutral-950 shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>+ {t.hero.reportBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('mapView')}
              className="px-6 py-3.5 rounded-xl text-sm font-bold border border-neutral-600 hover:bg-neutral-800 text-white transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{t.hero.trackBtn}</span>
            </button>

            <a
              href="/civicfix-complete-source-code.zip"
              download="civicfix-complete-source-code.zip"
              className="px-5 py-3.5 rounded-xl text-sm font-bold border border-neutral-700 bg-neutral-800/90 hover:bg-neutral-800 text-neutral-200 transition-all flex items-center justify-center gap-2"
              title="Download full project repository as ZIP archive"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Download Source (.ZIP)</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct Official Department Routing
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              Two-Factor Authentication Protected
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Instant Status Push Alerts
            </span>
          </div>
        </div>

        {/* Live Statistics Counter Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <span className="block text-3xl font-black font-mono text-white">{stats.total}</span>
            <span className="text-xs uppercase font-bold text-neutral-400 mt-1 block">
              {t.hero.statsTotal}
            </span>
          </div>
          <div className="p-3">
            <span className="block text-3xl font-black font-mono text-amber-400">{stats.inProgress}</span>
            <span className="text-xs uppercase font-bold text-neutral-400 mt-1 block">
              {t.hero.statsInProgress}
            </span>
          </div>
          <div className="p-3">
            <span className="block text-3xl font-black font-mono text-emerald-400">{stats.resolved}</span>
            <span className="text-xs uppercase font-bold text-neutral-400 mt-1 block">
              {t.hero.statsResolved}
            </span>
          </div>
          <div className="p-3">
            <span className="block text-3xl font-black font-mono text-teal-400">{stats.avgResolutionHours}h</span>
            <span className="text-xs uppercase font-bold text-neutral-400 mt-1 block">
              {t.hero.statsAvgTime}
            </span>
          </div>
        </div>
      </section>

      {/* Context-Sensitive Next Step Recommendation Box */}
      <section className="p-5 rounded-2xl border border-teal-500/40 bg-teal-50/60 dark:bg-teal-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Recommended Next Action
            </span>
            <p className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {currentUser
                ? `You have active reports in ${currentUser.ward || 'your ward'}. Open your citizen dashboard to inspect progress.`
                : 'Notice an issue in your neighborhood? Report it immediately with photo proof to alert municipal squads.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <button
              onClick={() => onSelectTab(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white"
            >
              Open My Dashboard →
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            >
              Sign In to Your Account →
            </button>
          )}
        </div>
      </section>

      {/* How It Works (5-Step Civic Workflow) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">How CivicFix Works</h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            From physical grievance detection to verified municipal resolution in 5 clear steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Report Problem',
              desc: 'Upload photo evidence and pin the street locality.',
              icon: '📸',
            },
            {
              step: '02',
              title: 'Receive CFX ID',
              desc: 'Get an official collision-resistant tracking reference.',
              icon: '🏷️',
            },
            {
              step: '03',
              title: 'Track Live Progress',
              desc: 'Follow status transitions from review to squad dispatch.',
              icon: '📍',
            },
            {
              step: '04',
              title: 'Official Response',
              desc: 'Receive direct updates and explanations from engineers.',
              icon: '📩',
            },
            {
              step: '05',
              title: 'Inspect Resolution',
              desc: 'Review verified completion photos on the public registry.',
              icon: '✅',
            },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:-translate-y-1 ${
                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400">
                    STEP {s.step}
                  </span>
                </div>
                <h3 className="text-sm font-black">{s.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Issue Categories Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{t.categories.title}</h2>
            <p className="text-xs sm:text-sm text-neutral-500">{t.categories.subtitle}</p>
          </div>
          <button
            onClick={() => onOpenReportModal()}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline self-start sm:self-auto"
          >
            Submit Custom Grievance →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.key}
              onClick={() => onOpenReportModal(cat.key)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all hover:border-teal-500 hover:shadow-md group ${
                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {cat.count} Active
                </span>
              </div>

              <h3 className="text-base font-black mt-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{cat.desc}</p>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                <span>Report under this domain</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Public Verified Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Recent Public Grievance Activity</h2>
            <p className="text-xs text-neutral-500">Live community complaints and official responses.</p>
          </div>
          <button
            onClick={() => onSelectTab('solvedIssues')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            View Wall of Resolutions →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complaints.slice(0, 4).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectComplaint(c)}
              className={`p-4 rounded-xl border cursor-pointer hover:border-teal-500 transition-all ${
                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="text-teal-600 dark:text-teal-400">{c.referenceNo}</span>
                <span
                  className={`uppercase px-1.5 py-0.2 rounded font-black ${
                    c.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-xs font-black line-clamp-1 mt-2">{c.title}</h4>
              <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{c.description}</p>

              <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                <span>{c.ward}</span>
                <span>{new Date(c.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="font-black text-sm text-neutral-900 dark:text-white">CivicFix</h4>
            <p className="text-xs">
              Smart civic infrastructure issue reporting, citizen communication, and resolution platform.
            </p>
            <p className="text-[11px] text-neutral-400">
              Demonstration &amp; educational civic portal version 2026.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
              Assistance &amp; Support
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>General Support: <span className="font-mono">support@civicfix.org</span></li>
              <li>Complaint Desk: <span className="font-mono">helpdesk@civicfix.org</span></li>
              <li>Helpline: <span className="font-mono">+91 94909 00000</span></li>
              <li>Hours: Mon - Sat (8 AM - 8 PM IST)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
              Regional Wards
            </h5>
            <ul className="space-y-1 text-xs">
              <li>Ward 12 (Madhapur / HITEC)</li>
              <li>Ward 14 (Gachibowli)</li>
              <li>Ward 07 (Begumpet)</li>
              <li>Ward 10 (Banjara Hills)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
              Accessibility
            </h5>
            <p className="text-[11px] leading-relaxed">
              Equipped with high-contrast monochrome design, scalable vector graphics, dark mode, 2FA security, and multi-language support in Telugu, Hindi, Marathi, Tamil, and Bengali.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© 2026 CivicFix Platform. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a
              href="/civicfix-complete-source-code.zip"
              download="civicfix-complete-source-code.zip"
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download Full Source (.ZIP)
            </a>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Security Audit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
