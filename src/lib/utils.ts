import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidPhoneNumber(phone: string): boolean {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if the number has at least 10 digits (including country code)
  return cleanPhone.length >= 10;
}

export function isValidSlug(slug: string): boolean {
  // Only allow letters, numbers, and hyphens
  const slugRegex = /^[a-zA-Z0-9-]+$/;
  return slugRegex.test(slug);
}

export function generateWhatsAppLink(phone: string, message: string): string {
  // Remove any non-digit characters from phone number
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Return the WhatsApp API link
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}