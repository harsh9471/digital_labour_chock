import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const num = cleaned.slice(2);
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  }
  return phone;
}

export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    WORKER: 'Worker',
    CONTRACTOR: 'Contractor',
    COMPANY_ADMIN: 'Company Admin',
    SUPER_ADMIN: 'Super Admin',
  };
  return roleMap[role] || role;
}

export function getRoleDashboardPath(role: string): string {
  const pathMap: Record<string, string> = {
    WORKER: '/worker',
    CONTRACTOR: '/contractor',
    COMPANY_ADMIN: '/admin',
    SUPER_ADMIN: '/admin',
  };
  return pathMap[role] || '/';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function isValidIndianPhone(phone: string): boolean {
  return /^\+91[6-9]\d{9}$/.test(phone);
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}
