export type NotificationType =
  | 'ATTENDANCE_SHORTAGE_WARNING'
  | 'FEE_OVERDUE_ALERT'
  | 'FINANCE_INVOICE_PAID'
  | 'LEAVE_REQUEST_PENDING'
  | 'EXAM_RESULTS_PUBLISHED'
  | 'EXAM_FAIL_ALERT'
  | 'CLINICAL_LOG_SUBMITTED'
  | 'CLINICAL_SIGN_OFF_PENDING'
  | 'MEDICINE_EXPIRY_WARNING'
  | 'HOSTEL_CAPACITY_ALERT'
  | 'ADMISSION_SUBMITTED'
  | 'GENERAL';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  category: 'FINANCE' | 'HR' | 'ACADEMIC' | 'CLINICAL' | 'FACILITIES' | 'GENERAL';
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
