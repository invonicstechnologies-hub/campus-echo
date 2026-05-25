const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const CSRF_HEADER_NAME = import.meta.env.VITE_CSRF_HEADER_NAME ?? 'X-Unsaid-Client';
const CSRF_HEADER_VALUE = import.meta.env.VITE_CSRF_HEADER_VALUE ?? '';

const STATE_CHANGING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

export async function customFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();

  const headers = new Headers(options.headers);

  const token = localStorage.getItem('access_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Attach CSRF header on all state-changing requests
  if (STATE_CHANGING_METHODS.has(method)) {
    headers.set(CSRF_HEADER_NAME, CSRF_HEADER_VALUE);
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'omit', // We use Bearer tokens now, no need to send cross-site cookies
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear any local state and redirect to login
      localStorage.removeItem('access_token');
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
