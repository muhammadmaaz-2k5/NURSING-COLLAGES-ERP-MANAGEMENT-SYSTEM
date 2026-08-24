export const EMAIL_QUEUE = 'email';
export const SMS_QUEUE = 'sms';
export const PDF_QUEUE = 'pdf-generation';
export const NOTIFICATION_QUEUE = 'notifications';
export const BACKUP_QUEUE = 'backup';

export const JOB_TYPES = {
  EMAIL_SEND: 'email:send',
  SMS_SEND: 'sms:send',
  PDF_CERTIFICATE: 'pdf:certificate',
  PDF_TRANSCRIPT: 'pdf:transcript',
  PDF_FEE_CHALLAN: 'pdf:challan',
  NOTIFICATION_BROADCAST: 'notification:broadcast',
  BACKUP_EXECUTE: 'backup:execute',
} as const;
