import {
  CivicInventoryItem,
  Complaint,
  ComplaintResponse,
  InAppNotification,
  StatusHistoryItem,
  SystemLog,
  User,
} from '../types/index.ts';
import { generateReferenceNo } from '../utils/pureLogic.ts';

// Vector placeholder photo generators (SVG data URIs so they scale infinitely without external network dependencies)
export function createVectorPhotoUrl(
  title: string,
  category: string,
  colorScheme: 'danger' | 'warning' | 'success' | 'info'
): string {
  const bg = {
    danger: '#FEE2E2',
    warning: '#FEF3C7',
    success: '#D1FAE5',
    info: '#E0F2FE',
  }[colorScheme];

  const stroke = {
    danger: '#DC2626',
    warning: '#D97706',
    success: '#059669',
    info: '#0284C7',
  }[colorScheme];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
    <rect width="600" height="360" fill="${bg}"/>
    <rect x="16" y="16" width="568" height="328" rx="8" fill="white" stroke="${stroke}" stroke-width="3" stroke-dasharray="6,6"/>
    <circle cx="300" cy="150" r="55" fill="${stroke}" fill-opacity="0.15" stroke="${stroke}" stroke-width="4"/>
    <path d="M280 150 L295 165 L325 135" fill="none" stroke="${stroke}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="300" y="240" font-family="sans-serif" font-weight="900" font-size="22" fill="${stroke}" text-anchor="middle">${title}</text>
    <text x="300" y="270" font-family="monospace" font-weight="700" font-size="14" fill="#64748B" text-anchor="middle">CIVIC EVIDENCE • ${category.toUpperCase()}</text>
    <text x="300" y="295" font-family="monospace" font-weight="600" font-size="11" fill="#94A3B8" text-anchor="middle">GEO-TAGGED &amp; VERIFIED</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const STORAGE_KEY = 'civicfix_state_v2';

interface StorageState {
  users: User[];
  complaints: Complaint[];
  notifications: InAppNotification[];
  inventory: CivicInventoryItem[];
  logs: SystemLog[];
  currentUser: User | null;
  unreadResponsePopupDismissed: Record<string, boolean>; // key: complaintId_responseId
}

// Initial Seed Data
const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_01',
    fullName: 'Chief Municipal Engineer (Admin)',
    username: 'admin',
    email: 'admin@civicfix.gov',
    mobileNumber: '+91 94400 11223',
    role: 'ADMIN',
    accountStatus: 'active',
    twoFactorEnabled: true,
    twoFactorSecret: '123456',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    ward: 'Headquarters / All Wards',
    city: 'Hyderabad',
    state: 'Telangana',
    createdAt: '2026-01-01T08:00:00.000Z',
    lastLoginAt: '2026-10-19T06:00:00.000Z',
  },
  {
    id: 'user_citizen_01',
    fullName: 'K. Sai Charan',
    username: 'charan',
    email: 'charansai949090@gmail.com',
    mobileNumber: '+91 94909 00000',
    role: 'USER',
    accountStatus: 'active',
    twoFactorEnabled: true,
    twoFactorSecret: '123456',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    ward: 'Ward 12 - Madhapur / HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    createdAt: '2026-02-10T10:15:00.000Z',
    lastLoginAt: '2026-10-19T06:15:00.000Z',
  },
  {
    id: 'user_citizen_02',
    fullName: 'Priya Deshmukh',
    username: 'priya_d',
    email: 'priya.d@civicfix.org',
    mobileNumber: '+91 98220 33445',
    role: 'USER',
    accountStatus: 'active',
    twoFactorEnabled: false,
    ward: 'Ward 07 - Begumpet',
    city: 'Hyderabad',
    state: 'Telangana',
    createdAt: '2026-03-05T14:30:00.000Z',
  },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp_001',
    referenceNo: 'CFX-2026-004120',
    userId: 'user_citizen_01',
    reporterName: 'K. Sai Charan',
    reporterEmail: 'charansai949090@gmail.com',
    reporterPhone: '+91 94909 00000',
    title: 'Severe crater pothole near Cyber Towers flyover ramp',
    description: 'Deep 3-foot wide pothole causing sudden braking for two-wheelers during peak evening traffic. Risk of severe accidents.',
    category: 'roads_potholes',
    severity: 'critical',
    priority: 'urgent',
    status: 'resolved',
    locationAddress: 'Cyber Towers Junction, Main Road, HITEC City',
    locality: 'Madhapur',
    ward: 'Ward 12',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500081',
    lat: 17.4504,
    lng: 78.3808,
    photoUrl: createVectorPhotoUrl('CRATER POTHOLE EVIDENCE', 'roads_potholes', 'danger'),
    resolutionPhotoUrl: createVectorPhotoUrl('ASPHALT REPAIRED & LEVELED', 'roads_potholes', 'success'),
    resolutionNotes: 'Emergency road maintenance squad deployed. Rapid-setting asphalt cold mix compacted and leveled with pneumatic roller. Road safe for traffic.',
    departmentAssigned: 'Roads & Buildings Engineering Division 4',
    submittedAt: '2026-10-14T08:30:00.000Z',
    updatedAt: '2026-10-16T15:20:00.000Z',
    resolvedAt: '2026-10-16T15:20:00.000Z',
    responses: [
      {
        id: 'resp_001',
        complaintId: 'cmp_001',
        administratorId: 'user_admin_01',
        administratorName: 'Chief Municipal Engineer',
        responseText: 'Inspection team confirmed road damage severity. Assigned Squad-B with emergency asphalt patch vehicle. Work completed on Oct 16.',
        resolutionPhotoUrl: createVectorPhotoUrl('ASPHALT REPAIRED & LEVELED', 'roads_potholes', 'success'),
        createdAt: '2026-10-16T15:20:00.000Z',
      },
    ],
    history: [
      {
        id: 'hist_001',
        complaintId: 'cmp_001',
        previousStatus: 'submitted',
        newStatus: 'under_review',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Report validated by field supervisor.',
        timestamp: '2026-10-14T10:00:00.000Z',
      },
      {
        id: 'hist_002',
        complaintId: 'cmp_001',
        previousStatus: 'under_review',
        newStatus: 'in_progress',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Road repair team mobilized with cold-mix asphalt.',
        timestamp: '2026-10-15T09:15:00.000Z',
      },
      {
        id: 'hist_003',
        complaintId: 'cmp_001',
        previousStatus: 'in_progress',
        newStatus: 'resolved',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Pothole patch completed and road surface leveled.',
        timestamp: '2026-10-16T15:20:00.000Z',
      },
    ],
    citizenNotes: ['Thank you for the prompt resolution! The flyover ramp is now smooth.'],
  },
  {
    id: 'cmp_002',
    referenceNo: 'CFX-2026-004128',
    userId: 'user_citizen_01',
    reporterName: 'K. Sai Charan',
    reporterEmail: 'charansai949090@gmail.com',
    reporterPhone: '+91 94909 00000',
    title: 'Cluster of 5 non-functional streetlights along Gachibowli Stadium Road',
    description: 'Entire 200-meter stretch is completely pitch dark after 7 PM, creating safety concerns for pedestrians and women commuting back from work.',
    category: 'streetlights',
    severity: 'high',
    priority: 'high',
    status: 'in_progress',
    locationAddress: 'Stadium Road, Lane 4 near Indoor Complex',
    locality: 'Gachibowli',
    ward: 'Ward 14',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500032',
    lat: 17.4428,
    lng: 78.3496,
    photoUrl: createVectorPhotoUrl('DARK STREETLIGHT CLUSTER', 'streetlights', 'warning'),
    departmentAssigned: 'Central Electrical & Lighting Wing',
    submittedAt: '2026-10-17T18:45:00.000Z',
    updatedAt: '2026-10-18T11:00:00.000Z',
    responses: [
      {
        id: 'resp_002',
        complaintId: 'cmp_002',
        administratorId: 'user_admin_01',
        administratorName: 'Chief Municipal Engineer',
        responseText: 'Electrical linesman team inspected the transformer feeder box. Underground short circuit identified on pole line #4. Replacement LED fixtures dispatched from Ward 14 inventory depot. Resolution in progress.',
        createdAt: '2026-10-18T11:00:00.000Z',
      },
    ],
    history: [
      {
        id: 'hist_004',
        complaintId: 'cmp_002',
        previousStatus: 'submitted',
        newStatus: 'under_review',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Dispatched notification to zonal electrical inspector.',
        timestamp: '2026-10-17T19:30:00.000Z',
      },
      {
        id: 'hist_005',
        complaintId: 'cmp_002',
        previousStatus: 'under_review',
        newStatus: 'in_progress',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Feeder line maintenance underway.',
        timestamp: '2026-10-18T11:00:00.000Z',
      },
    ],
  },
  {
    id: 'cmp_003',
    referenceNo: 'CFX-2026-004135',
    userId: 'user_citizen_02',
    reporterName: 'Priya Deshmukh',
    reporterEmail: 'priya.d@civicfix.org',
    title: 'Overflowing commercial garbage bin and illegal dumping',
    description: 'Community garbage dumpster has not been cleared for 3 consecutive days. Stray animals scattering plastic across the road.',
    category: 'garbage_sanitation',
    severity: 'medium',
    priority: 'medium',
    status: 'under_review',
    locationAddress: 'Market Yard Road, Near Old Bus Stand',
    locality: 'Begumpet',
    ward: 'Ward 07',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500016',
    lat: 17.4448,
    lng: 78.4682,
    photoUrl: createVectorPhotoUrl('OVERFLOWING GARBAGE DUMP', 'garbage_sanitation', 'danger'),
    departmentAssigned: 'Sanitation & Solid Waste Management',
    submittedAt: '2026-10-18T14:10:00.000Z',
    updatedAt: '2026-10-19T05:30:00.000Z',
    responses: [],
    history: [
      {
        id: 'hist_006',
        complaintId: 'cmp_003',
        previousStatus: 'submitted',
        newStatus: 'under_review',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Assigned to Ward 07 Sanitation Superintendent.',
        timestamp: '2026-10-19T05:30:00.000Z',
      },
    ],
  },
  {
    id: 'cmp_004',
    referenceNo: 'CFX-2026-004088',
    userId: 'user_citizen_01',
    reporterName: 'K. Sai Charan',
    reporterEmail: 'charansai949090@gmail.com',
    title: 'Pressurized water supply pipeline leak flooding street',
    description: 'Major potable water supply line cracked. Fresh water gushing out onto the road at high speed.',
    category: 'water_supply',
    severity: 'critical',
    priority: 'urgent',
    status: 'resolved',
    locationAddress: 'Road No. 12, MLA Colony Entrance',
    locality: 'Banjara Hills',
    ward: 'Ward 10',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500034',
    lat: 17.4156,
    lng: 78.4354,
    photoUrl: createVectorPhotoUrl('PIPELINE RUPTURE FLOODING', 'water_supply', 'info'),
    resolutionPhotoUrl: createVectorPhotoUrl('PIPE SLEEVE WELDED & SEALED', 'water_supply', 'success'),
    resolutionNotes: 'Water Board rapid response valve closed. Heavy-duty ductile iron repair sleeve installed. Water supply restored within 4 hours.',
    departmentAssigned: 'Hyderabad Metropolitan Water Supply & Sewerage Board',
    submittedAt: '2026-10-10T07:00:00.000Z',
    updatedAt: '2026-10-11T12:00:00.000Z',
    resolvedAt: '2026-10-11T12:00:00.000Z',
    responses: [
      {
        id: 'resp_003',
        complaintId: 'cmp_004',
        administratorId: 'user_admin_01',
        administratorName: 'Chief Municipal Engineer',
        responseText: 'HMWSSB emergency line crew deployed. Leak isolated and pipeline clamped. Pressure testing passed.',
        createdAt: '2026-10-11T12:00:00.000Z',
      },
    ],
    history: [
      {
        id: 'hist_007',
        complaintId: 'cmp_004',
        previousStatus: 'submitted',
        newStatus: 'in_progress',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Emergency water isolation teams dispatched.',
        timestamp: '2026-10-10T08:00:00.000Z',
      },
      {
        id: 'hist_008',
        complaintId: 'cmp_004',
        previousStatus: 'in_progress',
        newStatus: 'resolved',
        changedBy: 'Chief Municipal Engineer',
        changedByRole: 'ADMIN',
        changeComment: 'Pipeline repaired and road surface sanitized.',
        timestamp: '2026-10-11T12:00:00.000Z',
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_001',
    recipientUserId: 'user_citizen_01',
    complaintId: 'cmp_002',
    complaintRef: 'CFX-2026-004128',
    responseId: 'resp_002',
    type: 'admin_response',
    title: 'Official Response Received',
    message: 'Chief Municipal Engineer has responded to your complaint regarding Streetlights on Stadium Road: "Linesman crew dispatched with replacement LED fixtures..."',
    isRead: false,
    createdAt: '2026-10-18T11:00:00.000Z',
    locationContext: 'Gachibowli, Ward 14',
  },
  {
    id: 'notif_002',
    recipientUserId: 'user_citizen_01',
    complaintId: 'cmp_001',
    complaintRef: 'CFX-2026-004120',
    type: 'status_change',
    title: 'Complaint Resolved',
    message: 'Your complaint regarding Pothole near Cyber Towers flyover has been verified as RESOLVED.',
    isRead: true,
    createdAt: '2026-10-16T15:20:00.000Z',
    readAt: '2026-10-17T09:00:00.000Z',
  },
  {
    id: 'notif_003',
    recipientUserId: 'user_citizen_01',
    type: 'location_alert',
    title: 'Ward 12 Road Resurfacing Notice',
    message: 'Scheduled nighttime tar road maintenance on Outer Ring Road connecting link between 11 PM and 5 AM.',
    isRead: false,
    createdAt: '2026-10-19T04:00:00.000Z',
    locationContext: 'Madhapur / Ward 12',
  },
];

const INITIAL_INVENTORY: CivicInventoryItem[] = [
  {
    id: 'inv_001',
    name: 'Asphalt Cold Mix Patching Compound (50kg bags)',
    assetTag: 'INV-ROAD-0421',
    category: 'road_repair',
    ward: 'Ward 12 - Madhapur',
    locality: 'Madhapur Depot',
    quantity: 140,
    unit: 'bags',
    status: 'operational',
    assignedTeam: 'Road Maintenance Squad Alpha',
    lastInspected: '2026-10-15',
    notes: 'Stock sufficient for 45 emergency road patches.',
  },
  {
    id: 'inv_002',
    name: '120W High-Lumen Smart LED Streetlight Fixtures',
    assetTag: 'INV-ELEC-0899',
    category: 'lighting',
    ward: 'Ward 14 - Gachibowli',
    locality: 'Gachibowli Electrical Depot',
    quantity: 65,
    unit: 'units',
    status: 'operational',
    assignedTeam: 'Electrical Inspection Unit 2',
    lastInspected: '2026-10-17',
    notes: 'Reserved for Stadium Road and Financial District pole repairs.',
  },
  {
    id: 'inv_003',
    name: 'High-Volume Submersible Dewatering Pump (10 HP)',
    assetTag: 'INV-PUMP-0114',
    category: 'water_pumps',
    ward: 'Ward 10 - Banjara Hills',
    locality: 'Banjara Emergency Yard',
    quantity: 4,
    unit: 'heavy units',
    status: 'operational',
    assignedTeam: 'Monsoon Flood & Pipeline Rescue Squad',
    lastInspected: '2026-10-12',
  },
  {
    id: 'inv_004',
    name: 'Hydraulic Compactor Waste Truck (6-Ton)',
    assetTag: 'INV-WASTE-0302',
    category: 'waste_management',
    ward: 'Ward 07 - Begumpet',
    locality: 'Begumpet Municipal Yard',
    quantity: 2,
    unit: 'vehicles',
    status: 'under_maintenance',
    assignedTeam: 'Sanitation Fleet Bravo',
    lastInspected: '2026-10-18',
    notes: 'Hydraulic cylinder seal repair in progress. Expected back in service Oct 21.',
  },
  {
    id: 'inv_005',
    name: 'Pneumatic Road Surface Tamper / Compactor',
    assetTag: 'INV-MACH-0551',
    category: 'heavy_machinery',
    ward: 'Ward 12 - Madhapur',
    locality: 'Central Engineering Yard',
    quantity: 3,
    unit: 'machines',
    status: 'operational',
    assignedTeam: 'Road Repair Rapid Response',
    lastInspected: '2026-10-16',
  },
];

const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-10-19T06:15:22.000Z',
    actor: 'K. Sai Charan',
    actorRole: 'USER',
    action: 'USER_LOGIN',
    details: 'Citizen authenticated successfully via 2FA verification from trusted IP.',
    ipAddress: '157.48.201.88',
    severity: 'SUCCESS',
  },
  {
    id: 'log_002',
    timestamp: '2026-10-18T11:00:45.000Z',
    actor: 'Chief Municipal Engineer',
    actorRole: 'ADMIN',
    action: 'ADMIN_RESPONSE_PUBLISHED',
    details: 'Official response submitted for complaint CFX-2026-004128 (Streetlights). Dispatched in-app notification.',
    ipAddress: '10.24.1.102',
    severity: 'INFO',
  },
  {
    id: 'log_003',
    timestamp: '2026-10-16T15:20:10.000Z',
    actor: 'Chief Municipal Engineer',
    actorRole: 'ADMIN',
    action: 'COMPLAINT_STATUS_UPDATE',
    details: 'Status of CFX-2026-004120 transitioned from in_progress to resolved with photo proof.',
    ipAddress: '10.24.1.102',
    severity: 'SUCCESS',
  },
  {
    id: 'log_004',
    timestamp: '2026-10-14T08:30:00.000Z',
    actor: 'K. Sai Charan',
    actorRole: 'USER',
    action: 'COMPLAINT_SUBMITTED',
    details: 'Filed new complaint CFX-2026-004120 in Ward 12 (roads_potholes). Severity: critical.',
    ipAddress: '157.48.201.88',
    severity: 'INFO',
  },
];

class CivicFixStore {
  private state: StorageState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StorageState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          users: parsed.users || INITIAL_USERS,
          complaints: parsed.complaints || INITIAL_COMPLAINTS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          inventory: parsed.inventory || INITIAL_INVENTORY,
          logs: parsed.logs || INITIAL_LOGS,
          currentUser: parsed.currentUser || null,
          unreadResponsePopupDismissed: parsed.unreadResponsePopupDismissed || {},
        };
      }
    } catch (e) {
      console.warn('Could not read state from localStorage, initializing fresh default state.', e);
    }

    return {
      users: INITIAL_USERS,
      complaints: INITIAL_COMPLAINTS,
      notifications: INITIAL_NOTIFICATIONS,
      inventory: INITIAL_INVENTORY,
      logs: INITIAL_LOGS,
      currentUser: null,
      unreadResponsePopupDismissed: {},
    };
  }

  private persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Audio tone generation for civic push alerts
  public playAlertSound(type: 'success' | 'alert' | 'notification' = 'notification') {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(784, ctx.currentTime); // G5
        osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.2); // C5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(830.61, ctx.currentTime + 0.1); // G#5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio autoplay restrictions may ignore without throwing
    }
  }

  // Auth Operations
  public getCurrentUser(): User | null {
    return this.state.currentUser;
  }

  public setCurrentUser(user: User | null) {
    this.state.currentUser = user;
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.addSystemLog(
        user.fullName,
        user.role,
        'USER_LOGIN',
        `User ${user.username} (${user.role}) authenticated successfully.`,
        'SUCCESS'
      );
    }
    this.persistState();
  }

  public authenticate(usernameOrEmail: string, passwordPlain: string): { success: boolean; user?: User; requires2FA?: boolean; message?: string } {
    const trimmed = usernameOrEmail.trim().toLowerCase();

    // Check special admin authentication rule:
    // "rather than username admin and with pasword admin123 all others should be treated like customers while admin is the only administrator for system maintenance."
    if (trimmed === 'admin' || trimmed === 'admin@civicfix.gov') {
      if (passwordPlain === 'admin123') {
        const adminUser = this.state.users.find((u) => u.username === 'admin') || INITIAL_USERS[0];
        return { success: true, user: adminUser, requires2FA: adminUser.twoFactorEnabled };
      }
      return { success: false, message: 'Invalid administrative security credentials.' };
    }

    // Citizen authentication
    const user = this.state.users.find(
      (u) => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed
    );

    if (!user) {
      return { success: false, message: 'Account not found. Please verify details or sign up.' };
    }

    if (user.accountStatus === 'suspended') {
      return { success: false, message: 'This account has been restricted by municipal administration.' };
    }

    // For demo purposes, any password other than empty or 'wrong' works for citizen accounts, or 'password123'
    if (passwordPlain.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    return { success: true, user, requires2FA: user.twoFactorEnabled };
  }

  public registerCitizen(userData: {
    fullName: string;
    username: string;
    email: string;
    mobileNumber: string;
    ward: string;
    enable2FA?: boolean;
  }): { success: boolean; user?: User; message?: string } {
    const emailNorm = userData.email.trim().toLowerCase();
    const usernameNorm = userData.username.trim().toLowerCase();

    // Strict role protection: ordinary registration NEVER creates ADMIN
    if (usernameNorm === 'admin') {
      return { success: false, message: 'The username "admin" is reserved for municipal authority system administration.' };
    }

    const existing = this.state.users.find(
      (u) => u.email.toLowerCase() === emailNorm || u.username.toLowerCase() === usernameNorm
    );
    if (existing) {
      return { success: false, message: 'An account with this email or username already exists.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      fullName: userData.fullName.trim(),
      username: usernameNorm,
      email: emailNorm,
      mobileNumber: userData.mobileNumber.trim(),
      role: 'USER', // ALWAYS USER
      accountStatus: 'active',
      twoFactorEnabled: userData.enable2FA ?? true,
      twoFactorSecret: '123456',
      ward: userData.ward,
      city: 'Hyderabad',
      state: 'Telangana',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.state.users.push(newUser);
    this.addSystemLog(
      newUser.fullName,
      'USER',
      'CITIZEN_REGISTERED',
      `New citizen registered in ${userData.ward}. Role: USER.`,
      'SUCCESS'
    );
    this.persistState();

    return { success: true, user: newUser };
  }

  public updateUserProfile(userId: string, updates: Partial<User>): boolean {
    const idx = this.state.users.findIndex((u) => u.id === userId);
    if (idx === -1) return false;

    // Prevent role escalation through profile update
    const current = this.state.users[idx];
    const safeUpdates = { ...updates };
    if (current.role !== 'ADMIN') {
      delete safeUpdates.role;
    }

    this.state.users[idx] = { ...current, ...safeUpdates };
    if (this.state.currentUser?.id === userId) {
      this.state.currentUser = this.state.users[idx];
    }

    this.addSystemLog(
      this.state.currentUser?.fullName || 'System',
      this.state.currentUser?.role || 'USER',
      'USER_PROFILE_UPDATED',
      `Profile updated for ${current.username}.`,
      'INFO'
    );

    this.persistState();
    return true;
  }

  // Complaint Operations
  public getComplaints(): Complaint[] {
    return [...this.state.complaints];
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.state.complaints.find((c) => c.id === id || c.referenceNo === id);
  }

  public submitComplaint(data: Omit<Complaint, 'id' | 'referenceNo' | 'submittedAt' | 'updatedAt' | 'responses' | 'history'>): Complaint {
    const referenceNo = generateReferenceNo();
    const newComplaint: Complaint = {
      ...data,
      id: `cmp_${Date.now()}`,
      referenceNo,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
      history: [
        {
          id: `hist_${Date.now()}`,
          complaintId: `cmp_${Date.now()}`,
          previousStatus: 'submitted',
          newStatus: 'submitted',
          changedBy: data.reporterName,
          changedByRole: 'USER',
          changeComment: 'Initial complaint filed with photo evidence.',
          timestamp: new Date().toISOString(),
        },
      ],
      citizenNotes: [],
    };

    this.state.complaints.unshift(newComplaint);

    // Create system notification for all citizens in the same ward
    this.addNotification({
      recipientUserId: newComplaint.userId,
      complaintId: newComplaint.id,
      complaintRef: newComplaint.referenceNo,
      type: 'system',
      title: 'Complaint Logged Successfully',
      message: `Your report "${newComplaint.title}" is officially recorded under ${newComplaint.referenceNo}.`,
      isRead: false,
    });

    this.addSystemLog(
      newComplaint.reporterName,
      'USER',
      'COMPLAINT_SUBMITTED',
      `Filed complaint ${newComplaint.referenceNo} (${newComplaint.category}) in ${newComplaint.ward}.`,
      'INFO'
    );

    this.playAlertSound('success');
    this.persistState();
    return newComplaint;
  }

  public updateComplaintStatus(
    complaintId: string,
    newStatus: Complaint['status'],
    adminUser: User,
    comment: string,
    resolutionPhotoUrl?: string,
    resolutionNotes?: string
  ): boolean {
    const complaint = this.state.complaints.find((c) => c.id === complaintId);
    if (!complaint) return false;

    const previousStatus = complaint.status;
    complaint.status = newStatus;
    complaint.updatedAt = new Date().toISOString();

    if (newStatus === 'resolved') {
      complaint.resolvedAt = new Date().toISOString();
      if (resolutionPhotoUrl) complaint.resolutionPhotoUrl = resolutionPhotoUrl;
      if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    }

    complaint.history.push({
      id: `hist_${Date.now()}`,
      complaintId,
      previousStatus,
      newStatus,
      changedBy: adminUser.fullName,
      changedByRole: 'ADMIN',
      changeComment: comment,
      timestamp: new Date().toISOString(),
    });

    // Notify the citizen who filed the report
    this.addNotification({
      recipientUserId: complaint.userId,
      complaintId: complaint.id,
      complaintRef: complaint.referenceNo,
      type: 'status_change',
      title: `Status Updated: ${newStatus.replace('_', ' ').toUpperCase()}`,
      message: `Status of ${complaint.referenceNo} changed to ${newStatus}. Note: ${comment}`,
      isRead: false,
    });

    this.addSystemLog(
      adminUser.fullName,
      'ADMIN',
      'COMPLAINT_STATUS_UPDATE',
      `Complaint ${complaint.referenceNo} status changed from ${previousStatus} to ${newStatus}.`,
      'SUCCESS'
    );

    this.playAlertSound('notification');
    this.persistState();
    return true;
  }

  public addAdminResponse(
    complaintId: string,
    adminUser: User,
    responseText: string,
    resolutionPhotoUrl?: string
  ): ComplaintResponse | null {
    const complaint = this.state.complaints.find((c) => c.id === complaintId);
    if (!complaint) return null;

    const newResponse: ComplaintResponse = {
      id: `resp_${Date.now()}`,
      complaintId,
      administratorId: adminUser.id,
      administratorName: adminUser.fullName,
      responseText,
      resolutionPhotoUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    complaint.responses.push(newResponse);
    complaint.updatedAt = new Date().toISOString();

    // Critical feature: In-app notification for the citizen
    this.addNotification({
      recipientUserId: complaint.userId,
      complaintId: complaint.id,
      complaintRef: complaint.referenceNo,
      responseId: newResponse.id,
      type: 'admin_response',
      title: '📩 Official Response Received',
      message: `${adminUser.fullName} responded to ${complaint.referenceNo}: "${responseText.slice(0, 80)}..."`,
      isRead: false,
      locationContext: `${complaint.locality}, ${complaint.ward}`,
    });

    this.addSystemLog(
      adminUser.fullName,
      'ADMIN',
      'ADMIN_RESPONSE_SENT',
      `Official response published for ${complaint.referenceNo}.`,
      'INFO'
    );

    this.playAlertSound('alert');
    this.persistState();
    return newResponse;
  }

  // Feature: Enable editing already sent messages (prompt requested)
  public editAdminResponse(
    complaintId: string,
    responseId: string,
    newText: string,
    adminUser: User
  ): boolean {
    const complaint = this.state.complaints.find((c) => c.id === complaintId);
    if (!complaint) return false;

    const resp = complaint.responses.find((r) => r.id === responseId);
    if (!resp) return false;

    resp.responseText = newText;
    resp.updatedAt = new Date().toISOString();
    resp.isEdited = true;

    this.addSystemLog(
      adminUser.fullName,
      'ADMIN',
      'ADMIN_RESPONSE_EDITED',
      `Edited administrative message on ${complaint.referenceNo}.`,
      'INFO'
    );

    this.persistState();
    return true;
  }

  public addCitizenNote(complaintId: string, citizenUser: User, note: string): boolean {
    const complaint = this.state.complaints.find((c) => c.id === complaintId);
    if (!complaint) return false;

    if (!complaint.citizenNotes) complaint.citizenNotes = [];
    complaint.citizenNotes.push(`${citizenUser.fullName} (${new Date().toLocaleDateString()}): ${note}`);
    complaint.updatedAt = new Date().toISOString();

    this.persistState();
    return true;
  }

  // Notifications & Login Popup
  public getNotificationsForUser(userId: string): InAppNotification[] {
    return this.state.notifications.filter((n) => n.recipientUserId === userId);
  }

  public addNotification(notif: Omit<InAppNotification, 'id' | 'createdAt'>): InAppNotification {
    const item: InAppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.unshift(item);
    this.persistState();
    return item;
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif && !notif.isRead) {
      notif.isRead = true;
      notif.readAt = new Date().toISOString();
      this.persistState();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.state.notifications
      .filter((n) => n.recipientUserId === userId)
      .forEach((n) => {
        n.isRead = true;
        n.readAt = new Date().toISOString();
      });
    this.persistState();
  }

  // Get unread administrative responses specifically for next-login popup
  public getUnreadResponsesForUser(userId: string): { complaint: Complaint; response: ComplaintResponse; notification: InAppNotification }[] {
    const unreadNotifs = this.state.notifications.filter(
      (n) => n.recipientUserId === userId && !n.isRead && n.type === 'admin_response'
    );

    const results: { complaint: Complaint; response: ComplaintResponse; notification: InAppNotification }[] = [];

    for (const notif of unreadNotifs) {
      if (!notif.complaintId) continue;
      const complaint = this.state.complaints.find((c) => c.id === notif.complaintId);
      if (!complaint) continue;

      const response = complaint.responses.find((r) => r.id === notif.responseId) || complaint.responses[complaint.responses.length - 1];
      if (response) {
        results.push({ complaint, response, notification: notif });
      }
    }

    return results;
  }

  // Inventory Operations (Admin can update directly)
  public getInventory(): CivicInventoryItem[] {
    return [...this.state.inventory];
  }

  public updateInventoryItem(itemId: string, updates: Partial<CivicInventoryItem>, adminUser: User): boolean {
    const idx = this.state.inventory.findIndex((i) => i.id === itemId);
    if (idx === -1) return false;

    this.state.inventory[idx] = {
      ...this.state.inventory[idx],
      ...updates,
      lastInspected: new Date().toISOString().split('T')[0],
    };

    this.addSystemLog(
      adminUser.fullName,
      'ADMIN',
      'INVENTORY_UPDATED',
      `Updated asset ${this.state.inventory[idx].assetTag} (${this.state.inventory[idx].name}).`,
      'INFO'
    );

    this.persistState();
    return true;
  }

  public addInventoryItem(item: Omit<CivicInventoryItem, 'id' | 'lastInspected'>, adminUser: User): CivicInventoryItem {
    const newItem: CivicInventoryItem = {
      ...item,
      id: `inv_${Date.now()}`,
      lastInspected: new Date().toISOString().split('T')[0],
    };
    this.state.inventory.unshift(newItem);

    this.addSystemLog(
      adminUser.fullName,
      'ADMIN',
      'INVENTORY_ADDED',
      `Registered new civic inventory asset ${newItem.assetTag} in ${newItem.ward}.`,
      'SUCCESS'
    );

    this.persistState();
    return newItem;
  }

  // System & Audit Logs
  public getLogs(): SystemLog[] {
    return [...this.state.logs];
  }

  public addSystemLog(
    actor: string,
    actorRole: User['role'],
    action: string,
    details: string,
    severity: SystemLog['severity'] = 'INFO'
  ) {
    const log: SystemLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      actorRole,
      action,
      details,
      ipAddress: '157.48.201.88',
      severity,
    };
    this.state.logs.unshift(log);
    // Keep max 200 logs
    if (this.state.logs.length > 200) {
      this.state.logs.pop();
    }
    this.persistState();
  }

  // Registered Citizens Management for Admin
  public getAllUsers(): User[] {
    return [...this.state.users];
  }

  public toggleUserStatus(userId: string, adminUser: User): boolean {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user || user.role === 'ADMIN') return false; // Cannot ban root admin

    user.accountStatus = user.accountStatus === 'active' ? 'suspended' : 'active';

    this.addSystemLog(
      adminUser.fullName,
      'ADMIN',
      'USER_STATUS_TOGGLED',
      `User ${user.username} account status set to ${user.accountStatus}.`,
      user.accountStatus === 'suspended' ? 'WARNING' : 'INFO'
    );

    this.persistState();
    return true;
  }

  // Regional Statistics
  public getRegionalStats() {
    const total = this.state.complaints.length;
    const resolved = this.state.complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
    const inProgress = this.state.complaints.filter((c) => c.status === 'in_progress').length;
    const underReview = this.state.complaints.filter((c) => c.status === 'under_review' || c.status === 'submitted').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    return {
      total,
      resolved,
      inProgress,
      underReview,
      resolutionRate,
      avgResolutionHours: 28,
      citizenSatisfactionScore: 94.6,
      potholesFixed: 124,
      streetlightsRestored: 89,
      cleanlinessDrives: 45,
    };
  }

  // Reset demo state
  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      users: INITIAL_USERS,
      complaints: INITIAL_COMPLAINTS,
      notifications: INITIAL_NOTIFICATIONS,
      inventory: INITIAL_INVENTORY,
      logs: INITIAL_LOGS,
      currentUser: null,
      unreadResponsePopupDismissed: {},
    };
    this.persistState();
  }
}

export const store = new CivicFixStore();
