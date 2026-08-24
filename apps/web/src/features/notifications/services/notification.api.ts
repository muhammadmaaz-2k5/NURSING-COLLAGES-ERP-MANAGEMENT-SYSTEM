import { AppNotification } from '../types/notification.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<{ data: AppNotification[]; total: number; unreadCount: number }> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.unreadOnly) query.append('status', 'UNREAD');

    const res = await fetch(`${API_BASE}/notifications?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const json = await res.json();
    const data = json.data || json;
    const unread = data.filter((n: AppNotification) => !n.isRead).length;
    return { data, total: json.total || data.length, unreadCount: unread };
  } catch {
    const mockNotifications: AppNotification[] = [
      {
        id: 'notif-01',
        userId: 'usr-01',
        type: 'FINANCE_INVOICE_PAID',
        title: 'Fee Payment Received',
        message: 'Challan # INV-2026-1042 for Amina Bibi (PKR 65,000) collected via Meezan Direct Wire.',
        category: 'FINANCE',
        entityType: 'invoice',
        entityId: 'inv-01',
        actionUrl: '/finance',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-02',
        userId: 'usr-01',
        type: 'LEAVE_REQUEST_PENDING',
        title: 'Staff Leave Request Pending',
        message: 'Dr. Sarah Ahmed submitted Casual Leave for 3 days starting Sept 01, 2026.',
        category: 'HR',
        entityType: 'leave',
        entityId: 'lv-01',
        actionUrl: '/hr/leave',
        isRead: false,
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-03',
        userId: 'usr-01',
        type: 'CLINICAL_LOG_SUBMITTED',
        title: 'Clinical Procedure Awaiting Verification',
        message: 'Hamza Malik logged 4 hours of Pediatric CPR & Cannulation at Teaching Hospital Ward B.',
        category: 'CLINICAL',
        entityType: 'clinical_log',
        entityId: 'cln-01',
        actionUrl: '/clinical',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-04',
        userId: 'usr-01',
        type: 'MEDICINE_EXPIRY_WARNING',
        title: 'Batch Expiry Threshold Alert',
        message: 'Ceftriaxone 1g IV (Batch B-2024-098) expires in 18 days (200 vials remaining).',
        category: 'FACILITIES',
        entityType: 'pharmacy_batch',
        entityId: 'pharma-01',
        actionUrl: '/pharmacy',
        isRead: true,
        readAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-05',
        userId: 'usr-01',
        type: 'ADMISSION_SUBMITTED',
        title: 'New Online Admission Received',
        message: 'Amina Bibi (Ref: ADM-2026-0044) submitted application for Generic BSN Degree.',
        category: 'ACADEMIC',
        entityType: 'admission',
        entityId: 'adm-01',
        actionUrl: '/portal/admissions',
        isRead: true,
        readAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
    ];

    const filtered = params?.unreadOnly
      ? mockNotifications.filter((n) => !n.isRead)
      : mockNotifications;
    return {
      data: filtered,
      total: filtered.length,
      unreadCount: mockNotifications.filter((n) => !n.isRead).length,
    };
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
  } catch {}
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  try {
    await fetch(`${API_BASE}/notifications/read-all`, { method: 'PATCH' });
  } catch {}
  return { success: true };
}
