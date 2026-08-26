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
        id: 'notif-00',
        userId: 'usr-01',
        type: 'ATTENDANCE_SHORTAGE_WARNING',
        title: '⚠️ Attendance Shortage Warning (<75%)',
        message: 'Student Bilal Tariq (NUR-2023-019) attendance in Pharmacology dropped to 68.2%. Exam clearance at risk.',
        category: 'ACADEMIC',
        entityType: 'attendance',
        entityId: 'att-01',
        actionUrl: '/attendance',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-01',
        userId: 'usr-01',
        type: 'FEE_OVERDUE_ALERT',
        title: '💳 Semester 6 Tuition Fee Challan Due',
        message: 'Challan #CHL-2026-604 (PKR 85,000) due date is in 3 days. Surcharge applied after August 30.',
        category: 'FINANCE',
        entityType: 'invoice',
        entityId: 'inv-01',
        actionUrl: '/finance',
        isRead: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-02',
        userId: 'usr-01',
        type: 'EXAM_RESULTS_PUBLISHED',
        title: '🎓 Exam Results Published: Adult Health Nursing II',
        message: 'Midterm assessment results and GPA calculations are published and available on student transcripts.',
        category: 'ACADEMIC',
        entityType: 'exam',
        entityId: 'ex-01',
        actionUrl: '/exams',
        isRead: false,
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      },
      {
        id: 'notif-03',
        userId: 'usr-01',
        type: 'CLINICAL_LOG_SUBMITTED',
        title: '🩺 Bedside Procedure Awaiting Verification',
        message: 'Amina Bibi logged IV Cannulation & Infusion (14 procedures) at Teaching Hospital Emergency Ward.',
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
        message: 'Ceftriaxone 1g IV (Batch B-2024-098) expires in 18 days (200 vials remaining in Dispensary).',
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
