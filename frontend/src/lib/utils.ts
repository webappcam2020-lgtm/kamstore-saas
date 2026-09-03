import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'XAF') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatPhone(phone: string) {
  // basic formatting for cameroon numbers if it starts with +237
  if (phone.startsWith('+237')) {
    return phone.replace(/(\+237)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  }
  return phone;
}
