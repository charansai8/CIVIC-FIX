import React, { useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Camera,
  CheckCircle2,
  Clock,
  Edit2,
  FileText,
  Filter,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react';
import {
  CivicInventoryItem,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  PriorityLevel,
  SupportedLanguage,
  SystemLog,
  User,
} from '../types/index.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { createVectorPhotoUrl, store } from '../services/store.ts';

interface AdminDashboardViewProps {
  adminUser: User;
  currentLang: SupportedLanguage;
  isDark: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  currentLang,
  isDark,
  onSelectComplaint,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [activeTab, setActiveTab] = useState<'complaints' | 'inventory' | 'logs' | 'users'>(
    'complaints'
  );

  // Complaints state
  const complaints = store.getComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Response & Status Update State
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [statusComment, setStatusComment] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string | null>(null);
  const [editingResponseId, setEditingResponseId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Inventory State
  const inventory = store.getInventory();
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState<CivicInventoryItem['category']>('lighting');
  const [newAssetWard, setNewAssetWard] = useState('Ward 12 - Madhapur');
  const [newAssetQty, setNewAssetQty] = useState(10);
  const [newAssetTeam, setNewAssetTeam] = useState('Rapid Response Maintenance Unit');

  // Logs & Users State
  const logs = store.getLogs();
  const allUsers = store.getAllUsers();
  const stats = store.getRegionalStats();

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
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

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !responseText.trim()) return;

    store.addAdminResponse(
      selectedComplaint.id,
      adminUser,
      responseText.trim(),
      resolutionPhoto || undefined
    );

    setResponseText('');
    setResolutionPhoto(null);
    setFeedbackMsg('Official response sent and citizen notified.');
    setTimeout(() => setFeedbackMsg(''), 3000);

    // Refresh selected complaint
    const updated = store.getComplaintById(selectedComplaint.id);
    if (updated) setSelectedComplaint(updated);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    store.updateComplaintStatus(
      selectedComplaint.id,
      newStatus,
      adminUser,
      statusComment.trim() || `Status updated to ${newStatus} by ${adminUser.fullName}`,
      resolutionPhoto || undefined,
      newStatus === 'resolved' ? 'Civic infrastructure repaired and verified by authority.' : undefined
    );

    setStatusComment('');
    setResolutionPhoto(null);
    setFeedbackMsg(`Complaint status successfully transitioned to ${newStatus}.`);
    setTimeout(() => setFeedbackMsg(''), 3000);

    const updated = store.getComplaintById(selectedComplaint.id);
    if (updated) setSelectedComplaint(updated);
  };

  const handleSaveEditedResponse = (responseId: string) => {
    if (!selectedComplaint || !editedText.trim()) return;
    store.editAdminResponse(selectedComplaint.id, responseId, editedText.trim(), adminUser);
    setEditingResponseId(null);
    setEditedText('');
    setFeedbackMsg('Message updated successfully.');
    setTimeout(() => setFeedbackMsg(''), 3000);

    const updated = store.getComplaintById(selectedComplaint.id);
    if (updated) setSelectedComplaint(updated);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetTag.trim()) return;

    store.addInventoryItem(
      {
        name: newAssetName.trim(),
        assetTag: newAssetTag.trim(),
        category: newAssetCategory,
        ward: newAssetWard,
        locality: newAssetWard.split('-')[1]?.trim() || 'Central',
        quantity: Number(newAssetQty),
        unit: 'units',
        status: 'operational',
        assignedTeam: newAssetTeam.trim(),
      },
      adminUser
    );

    setShowAddAssetModal(false);
    setNewAssetName('');
    setNewAssetTag('');
    setFeedbackMsg('Civic asset registered to municipal inventory.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Title Header */}
      <div className="p-6 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-900 text-white dark:bg-neutral-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500 text-neutral-950 font-black">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{t.dashboard.adminTitle}</h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
                SYSTEM ROOT ADMIN
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Logged in as {adminUser.fullName} • System maintenance &amp; inventory command desk
            </p>
          </div>
        </div>

        {/* Global Statistics Badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-center">
            <span className="block text-lg font-black font-mono text-white">{stats.total}</span>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Cases</span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-center">
            <span className="block text-lg font-black font-mono text-amber-400">{stats.inProgress}</span>
            <span className="text-[10px] uppercase font-bold text-neutral-400">In Progress</span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-center">
            <span className="block text-lg font-black font-mono text-emerald-400">{stats.resolved}</span>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Resolved</span>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 space-x-2">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'complaints'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Complaints &amp; Responses ({complaints.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Civic Inventory ({inventory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'logs'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Logs ({logs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Citizen Registry ({allUsers.length})</span>
        </button>
      </div>

      {/* TAB 1: COMPLAINTS MANAGEMENT */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Complaints Table & Filter (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Toolbar */}
            <div className="p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-md border text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-md border text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                >
                  <option value="all">All Categories</option>
                  <option value="roads_potholes">Roads &amp; Potholes</option>
                  <option value="streetlights">Streetlights</option>
                  <option value="water_supply">Water Supply</option>
                  <option value="drainage_sewage">Drainage</option>
                  <option value="garbage_sanitation">Garbage</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search complaints..."
                  className="pl-8 pr-2 py-1 rounded-md border text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 w-40"
                />
              </div>
            </div>

            {/* Complaints List Cards */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">No complaints matching filter.</p>
              ) : (
                filteredComplaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
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
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                              {c.referenceNo}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                c.severity === 'critical'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                              }`}
                            >
                              {c.severity}
                            </span>
                          </div>
                          <h4 className="text-sm font-black leading-snug mt-1">{c.title}</h4>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
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
                        <span>Reporter: {c.reporterName}</span>
                        <span>{c.ward}</span>
                        <span>{new Date(c.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Complaint Action & Response Console (5 cols) */}
          <div className="lg:col-span-5">
            {selectedComplaint ? (
              <div
                className={`p-5 rounded-2xl border sticky top-24 space-y-4 ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                      {selectedComplaint.referenceNo}
                    </span>
                    <h3 className="text-base font-black leading-snug mt-0.5">{selectedComplaint.title}</h3>
                  </div>
                  <button
                    onClick={() => onSelectComplaint(selectedComplaint)}
                    className="text-xs font-bold text-teal-600 hover:underline"
                  >
                    Open View
                  </button>
                </div>

                {/* Evidence Thumbnail */}
                {selectedComplaint.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 aspect-16/9 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={selectedComplaint.photoUrl}
                      alt="Uploaded evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Status Transition Control */}
                <form onSubmit={handleUpdateStatus} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-2">
                  <span className="text-xs font-bold uppercase block text-neutral-500">
                    Update Resolution Lifecycle
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-bold bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    >
                      <option value="under_review">Under Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Mark as Resolved</option>
                      <option value="closed">Close Ticket</option>
                      <option value="reopened">Reopen Investigation</option>
                    </select>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white"
                    >
                      Apply Status
                    </button>
                  </div>
                  <input
                    type="text"
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Administrative change note (visible on timeline)..."
                    className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                  />
                  {newStatus === 'resolved' && (
                    <button
                      type="button"
                      onClick={() =>
                        setResolutionPhoto(
                          createVectorPhotoUrl('VERIFIED REPAIR COMPLETION', selectedComplaint.category, 'success')
                        )
                      }
                      className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Camera className="w-3 h-3" /> Attach Verified Resolution Proof Photo
                    </button>
                  )}
                </form>

                {/* Published Responses History & Editing Feature */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase block text-neutral-500">
                    Administrative Messages &amp; Citizen Replies
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {selectedComplaint.responses.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No responses published yet.</p>
                    ) : (
                      selectedComplaint.responses.map((resp) => (
                        <div
                          key={resp.id}
                          className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400">
                            <span>
                              {resp.administratorName} {resp.isEdited && '(Edited)'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span>{new Date(resp.createdAt).toLocaleDateString()}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingResponseId(resp.id);
                                  setEditedText(resp.responseText);
                                }}
                                className="text-teal-600 hover:text-teal-400 font-bold"
                                title="Edit already sent message"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {editingResponseId === resp.id ? (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                rows={2}
                                className="w-full p-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingResponseId(null)}
                                  className="px-2 py-0.5 rounded border text-[10px]"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditedResponse(resp.id)}
                                  className="px-2.5 py-0.5 rounded bg-teal-600 text-white font-bold text-[10px]"
                                >
                                  Save Edit
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                              {resp.responseText}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Send Official Response Composer */}
                <form onSubmit={handleSendResponse} className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs font-bold uppercase block text-neutral-500">
                    Send Official Administrative Response
                  </span>
                  <textarea
                    rows={2}
                    required
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter formal update for citizen (e.g. Linesman team deployed, repairs scheduled)..."
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent border-neutral-300 dark:border-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setResponseText(
                          'Thank you for reporting this issue. A municipal inspection team has been dispatched to assess and address the hazard.'
                        )
                      }
                      className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                    >
                      Insert Standard Template
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Send &amp; Push Notify
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                Select a complaint from the list to inspect details and respond.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT CIVIC INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div>
              <h3 className="text-base font-black">Public Infrastructure Asset &amp; Inventory Depot</h3>
              <p className="text-xs text-neutral-500">
                Direct administrator inventory controls. Update stock levels, reassign municipal maintenance teams, and monitor operational readiness.
              </p>
            </div>
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Civic Asset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                      {item.assetTag}
                    </span>
                    <h4 className="text-sm font-black leading-snug mt-0.5">{item.name}</h4>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'operational'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.status === 'under_maintenance'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Location:</span>
                    <span className="font-semibold">{item.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Assigned Squad:</span>
                    <span className="font-semibold truncate max-w-[150px]">{item.assignedTeam}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-neutral-400">Current Stock:</span>
                    <div className="flex items-center gap-1 font-mono font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          store.updateInventoryItem(
                            item.id,
                            { quantity: Math.max(0, item.quantity - 1) },
                            adminUser
                          )
                        }
                        className="w-5 h-5 rounded border flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        -
                      </button>
                      <span className="px-1.5">{item.quantity} {item.unit}</span>
                      <button
                        type="button"
                        onClick={() =>
                          store.updateInventoryItem(
                            item.id,
                            { quantity: item.quantity + 1 },
                            adminUser
                          )
                        }
                        className="w-5 h-5 rounded border flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Toggle buttons */}
                <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-neutral-400">Last: {item.lastInspected}</span>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      store.updateInventoryItem(
                        item.id,
                        { status: e.target.value as CivicInventoryItem['status'] },
                        adminUser
                      )
                    }
                    className="text-[11px] font-bold rounded border bg-transparent p-1 border-neutral-300 dark:border-neutral-700"
                  >
                    <option value="operational" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Operational</option>
                    <option value="under_maintenance" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Maintenance</option>
                    <option value="faulty" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Faulty</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add Asset Modal */}
          {showAddAssetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div
                className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
                  isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-base font-bold">Register New Civic Asset</h3>
                  <button onClick={() => setShowAddAssetModal(false)}>
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                <form onSubmit={handleAddAsset} className="space-y-3 mt-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Asset Name</label>
                    <input
                      type="text"
                      required
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      placeholder="e.g. 150W LED Street Lamp Bulbs"
                      className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Asset Tag Identifier</label>
                    <input
                      type="text"
                      required
                      value={newAssetTag}
                      onChange={(e) => setNewAssetTag(e.target.value)}
                      placeholder="INV-ELEC-9901"
                      className="w-full p-2 rounded-lg border font-mono bg-transparent border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={newAssetQty}
                        onChange={(e) => setNewAssetQty(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Ward Location</label>
                      <input
                        type="text"
                        value={newAssetWard}
                        onChange={(e) => setNewAssetWard(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Assigned Maintenance Team</label>
                    <input
                      type="text"
                      value={newAssetTeam}
                      onChange={(e) => setNewAssetTeam(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-transparent border-neutral-300 dark:border-neutral-700"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAssetModal(false)}
                      className="px-3 py-2 rounded-lg border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg font-bold bg-teal-600 text-white"
                    >
                      Save Asset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SYSTEM LOGS & AUDIT TRAIL */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black">System Audit Trail &amp; Security Logs</h3>
              <p className="text-xs text-neutral-500">
                Immutable chronological log of all administrative actions, logins, status changes, and notifications.
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800">
              Total Recorded: {logs.length}
            </span>
          </div>

          <div
            className={`rounded-2xl border overflow-x-auto ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
            }`}
          >
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950/80 text-neutral-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor &amp; Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Log Details</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="p-3 font-mono text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="font-bold">{log.actor}</span>
                      <span className="text-[10px] text-neutral-400 block font-mono">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {log.action}
                    </td>
                    <td className="p-3 text-neutral-700 dark:text-neutral-300 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-neutral-400">{log.ipAddress}</td>
                    <td className="p-3">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          log.severity === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CITIZEN USER REGISTRY & PROFILE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black">Registered Citizen Profiles</h3>
              <p className="text-xs text-neutral-500">
                Manage registered citizen accounts, view submitted reports, and toggle account access status.
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800">
              Registered Citizens: {allUsers.filter((u) => u.role === 'USER').length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUsers.map((u) => {
              const citizenComplaints = complaints.filter((c) => c.userId === u.id);
              const isAdmin = u.role === 'ADMIN';

              return (
                <div
                  key={u.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-black text-sm">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black leading-snug">{u.fullName}</h4>
                          <span className="text-xs text-neutral-400 font-mono">@{u.username}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          isAdmin
                            ? 'bg-amber-400 text-neutral-950'
                            : u.accountStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isAdmin ? 'ADMIN' : u.accountStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                      <div>Email: <strong className="text-neutral-800 dark:text-neutral-200">{u.email}</strong></div>
                      <div>Ward: <span className="font-semibold">{u.ward || 'General'}</span></div>
                      <div>Reported Grievances: <strong className="font-mono text-teal-600">{citizenComplaints.length}</strong></div>
                      <div className="text-[11px] text-neutral-400">
                        Joined: {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {!isAdmin && (
                    <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">Account Control</span>
                      <button
                        type="button"
                        onClick={() => store.toggleUserStatus(u.id, adminUser)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                          u.accountStatus === 'active'
                            ? 'border border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            : 'border border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        {u.accountStatus === 'active' ? 'Suspend Citizen' : 'Reactivate Citizen'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
