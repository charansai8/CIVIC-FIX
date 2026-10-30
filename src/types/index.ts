export type UserRole = 'USER' | 'ADMIN';

export type AccountStatus = 'active' | 'suspended';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobileNumber?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  avatarUrl?: string;
  ward?: string;
  city?: string;
  state?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type ComplaintCategory =
  | 'roads_potholes'
  | 'streetlights'
  | 'water_supply'
  | 'drainage_sewage'
  | 'garbage_sanitation'
  | 'public_infra'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'reopened';

export interface StatusHistoryItem {
  id: string;
  complaintId: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  changedBy: string;
  changedByRole: UserRole;
  changeComment: string;
  timestamp: string;
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  administratorId: string;
  administratorName: string;
  responseText: string;
  resolutionPhotoUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
}

export interface Complaint {
  id: string;
  referenceNo: string; // e.g. CFX-2026-001234
  userId: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: SeverityLevel;
  priority: PriorityLevel;
  status: ComplaintStatus;
  locationAddress: string;
  locality: string;
  ward: string;
  city: string;
  state: string;
  postalCode?: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  resolutionPhotoUrl?: string;
  resolutionNotes?: string;
  departmentAssigned?: string;
  submittedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  responses: ComplaintResponse[];
  history: StatusHistoryItem[];
  citizenNotes?: string[];
}

export interface InAppNotification {
  id: string;
  recipientUserId: string;
  complaintId?: string;
  complaintRef?: string;
  responseId?: string;
  type: 'admin_response' | 'status_change' | 'location_alert' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  locationContext?: string;
}

export interface CivicInventoryItem {
  id: string;
  name: string;
  assetTag: string; // e.g. INV-HYD-0412
  category: 'lighting' | 'road_repair' | 'waste_management' | 'water_pumps' | 'electrical' | 'heavy_machinery';
  ward: string;
  locality: string;
  quantity: number;
  unit: string;
  status: 'operational' | 'under_maintenance' | 'faulty' | 'scheduled_replacement';
  assignedTeam: string;
  lastInspected: string;
  notes?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
}

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'mr' | 'ta' | 'bn';
