import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateReferenceNo,
  isValidStatusTransition,
  canUserPerformAction,
  validateTwoFactorOtp,
  calculateDefaultPriority,
  filterComplaintsList,
} from './pureLogic.ts';

test('generateReferenceNo generates compliant CFX-YYYY-NNNNNN format', () => {
  const currentYear = new Date().getFullYear();
  const ref = generateReferenceNo(123456);
  assert.equal(ref, `CFX-${currentYear}-123456`);
  assert.match(ref, /^CFX-\d{4}-\d{6}$/);

  const randomRef = generateReferenceNo();
  assert.match(randomRef, /^CFX-\d{4}-\d{6}$/);
});

test('status transition state machine enforces correct lifecycle', () => {
  // Legal forward paths
  assert.equal(isValidStatusTransition('submitted', 'under_review'), true);
  assert.equal(isValidStatusTransition('under_review', 'in_progress'), true);
  assert.equal(isValidStatusTransition('in_progress', 'resolved'), true);
  assert.equal(isValidStatusTransition('resolved', 'reopened'), true);
  assert.equal(isValidStatusTransition('reopened', 'in_progress'), true);

  // Same status is valid
  assert.equal(isValidStatusTransition('in_progress', 'in_progress'), true);

  // Illegal transitions
  assert.equal(isValidStatusTransition('submitted', 'reopened'), false);
  assert.equal(isValidStatusTransition('resolved', 'submitted'), false);
});

test('Role-Based Access Control matrix protects administrative actions', () => {
  // Admin permissions
  assert.equal(canUserPerformAction('ADMIN', 'update_complaint_status'), true);
  assert.equal(canUserPerformAction('ADMIN', 'post_admin_response'), true);
  assert.equal(canUserPerformAction('ADMIN', 'update_civic_inventory'), true);
  assert.equal(canUserPerformAction('ADMIN', 'manage_users'), true);
  assert.equal(canUserPerformAction('ADMIN', 'view_audit_logs'), true);

  // Citizen (USER) permissions
  assert.equal(canUserPerformAction('USER', 'submit_complaint'), true);
  assert.equal(canUserPerformAction('USER', 'view_own_complaints'), true);
  assert.equal(canUserPerformAction('USER', 'update_complaint_status'), false);
  assert.equal(canUserPerformAction('USER', 'post_admin_response'), false);
  assert.equal(canUserPerformAction('USER', 'update_civic_inventory'), false);
  assert.equal(canUserPerformAction('USER', 'view_audit_logs'), false);
});

test('Two-factor OTP validator correctly validates 6-digit codes', () => {
  assert.equal(validateTwoFactorOtp('123456'), true);
  assert.equal(validateTwoFactorOtp('987654'), true);
  assert.equal(validateTwoFactorOtp('12345'), false); // too short
  assert.equal(validateTwoFactorOtp('1234567'), false); // too long
  assert.equal(validateTwoFactorOtp('abc123'), false); // non-digits
  assert.equal(validateTwoFactorOtp('000000'), false); // rejected dummy
  assert.equal(validateTwoFactorOtp('654321', '654321'), true);
  assert.equal(validateTwoFactorOtp('111222', '654321'), false);
});

test('Default priority calculation handles critical infrastructure', () => {
  assert.equal(calculateDefaultPriority('roads_potholes', 'critical'), 'urgent');
  assert.equal(calculateDefaultPriority('water_supply', 'medium'), 'high');
  assert.equal(calculateDefaultPriority('other', 'low'), 'low');
});

test('filterComplaintsList filters by category, status, and query correctly', () => {
  const sample = [
    {
      referenceNo: 'CFX-2026-000101',
      title: 'Deep pothole on MG Road',
      description: 'Hazardous for bikes at night',
      category: 'roads_potholes',
      status: 'submitted',
      priority: 'high',
      locality: 'Ward 12',
      ward: 'Central',
    },
    {
      referenceNo: 'CFX-2026-000102',
      title: 'Water pipe leakage near park',
      description: 'Clean drinking water overflowing',
      category: 'water_supply',
      status: 'in_progress',
      priority: 'urgent',
      locality: 'Ward 8',
      ward: 'East',
    },
    {
      referenceNo: 'CFX-2026-000103',
      title: 'Broken streetlight',
      description: 'Pole lamp damaged',
      category: 'streetlights',
      status: 'resolved',
      priority: 'medium',
      locality: 'Ward 12',
      ward: 'Central',
    },
  ];

  // Category filter
  const roadsOnly = filterComplaintsList(sample, { category: 'roads_potholes' });
  assert.equal(roadsOnly.length, 1);
  assert.equal(roadsOnly[0].referenceNo, 'CFX-2026-000101');

  // Search filter
  const searchLeak = filterComplaintsList(sample, { searchQuery: 'leakage' });
  assert.equal(searchLeak.length, 1);
  assert.equal(searchLeak[0].referenceNo, 'CFX-2026-000102');

  // Status filter
  const resolvedOnly = filterComplaintsList(sample, { status: 'resolved' });
  assert.equal(resolvedOnly.length, 1);
  assert.equal(resolvedOnly[0].referenceNo, 'CFX-2026-000103');
});
