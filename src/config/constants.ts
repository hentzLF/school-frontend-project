export const API_BASE = "/api";

export const AUTH_ROUTES = {
  login: `${API_BASE}/auth/login`,
  register: `${API_BASE}/auth/register`,
  logout: `${API_BASE}/auth/logout`,
  refresh: `${API_BASE}/auth/refresh`,
  me: `${API_BASE}/auth/me`,
} as const;

export const LISTING_ROUTES = {
  list: `${API_BASE}/listings`,
  detail: (id: string) => `${API_BASE}/listings/${id}`,
} as const;

export const BOOKING_ROUTES = {
  list: `${API_BASE}/bookings`,
  detail: (id: string) => `${API_BASE}/bookings/${id}`,
  updateStatus: (id: string) => `${API_BASE}/bookings/${id}/status`,
} as const;

export const PAYMENT_ROUTES = {
  list: `${API_BASE}/payments`,
  create: `${API_BASE}/payments`,
} as const;

export const CONVERSATION_ROUTES = {
  list: `${API_BASE}/conversations`,
  detail: (id: string) => `${API_BASE}/conversations/${id}`,
  messages: (id: string) => `${API_BASE}/conversations/${id}/messages`,
} as const;

export const REVIEW_ROUTES = {
  list: `${API_BASE}/reviews`,
  detail: (id: string) => `${API_BASE}/reviews/${id}`,
} as const;

export const COUNTY_ROUTES = {
  list: `${API_BASE}/counties`,
} as const;

export const EQUIPMENT_ROUTES = {
  list: `${API_BASE}/equipment`,
  detail: (id: string) => `${API_BASE}/equipment/${id}`,
} as const;

export const CATEGORY_ROUTES = {
  list: `${API_BASE}/categories`,
} as const;
