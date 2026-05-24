const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const CSRF_HEADER_NAME = import.meta.env.VITE_CSRF_HEADER_NAME ?? 'X-Campus-Echo-Client';
const CSRF_HEADER_VALUE = import.meta.env.VITE_CSRF_HEADER_VALUE ?? '';

const STATE_CHANGING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

export async function customFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // Attach CSRF header on all state-changing requests
  if (STATE_CHANGING_METHODS.has(method)) {
    headers.set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE);
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include', // Always send httpOnly cookie
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear any local state and redirect to login
      window.location.href = '/login';
      throw new Error('Unauthenticated');
    }

    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
