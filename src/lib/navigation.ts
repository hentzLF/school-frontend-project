/**
 * Sends the browser to the login page after an unrecoverable 401 (the
 * server-side token refresh has already failed). Skipped on the auth pages
 * themselves so it cannot trigger a reload loop, and a no-op on the server.
 */
export function redirectToLogin(): void {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;
  if (path === "/login" || path === "/register") return;

  /* v8 ignore next -- real navigation cannot run under jsdom */
  window.location.assign("/login");
}
