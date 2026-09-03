export type UserRole = 'USER' | 'HOST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type ListingCategory = 'TOURISM' | 'HOUSING' | 'SERVICE';
export type ListingType = 'HOTEL' | 'APARTMENT' | 'GUIDE' | 'TRANSPORT' | 'EVENT';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  type: ListingType;
  images: string[];
  location: string;
  hostId: string;
  createdAt: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export type PaymentProvider = 'MTN_MOMO' | 'ORANGE_MONEY' | 'STRIPE' | 'CASH';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface AIProfile {
  id: string;
  userId: string;
  preferences: string[];
  searchHistory: string[];
  recommendationScore: number;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LoginForm {
  email: string;
  password?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  role: UserRole;
}
