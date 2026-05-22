export const API_BASE = "/api";
export const AUTH_ROUTES = {
  login: `${API_BASE}/auth/login`,
  register: `${API_BASE}/auth/register`,
  logout: `${API_BASE}/auth/logout`,
  refresh: `${API_BASE}/auth/refresh`,
  me: `${API_BASE}/auth/me`,
} as const;
