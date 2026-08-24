import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number | string | null | undefined, currency = 'PKR'): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return `${currency} 0`;
  const num = Number(amount);
  return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string | Date | null | undefined, includeTime = false): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };
  return d.toLocaleDateString('en-US', options);
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncate(str: string | null | undefined, length = 30): string {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}
