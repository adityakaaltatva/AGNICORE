const BASE_URL = 'http://localhost:8080/api';

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('agnicore_token');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401) {
      localStorage.removeItem('agnicore_token');
      localStorage.removeItem('agnicore_user');
      // Dispatch a custom event to notify the app of logout
      window.dispatchEvent(new CustomEvent('sessionExpired'));
      throw new Error('Session expired. Please log in again.');
    }
    
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || response.statusText);
  }

  return response.json();
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => 
    apiRequest<T>(path, { ...options, method: 'GET' }),
  
  post: <T>(path: string, body: unknown, options?: RequestInit) => 
    apiRequest<T>(path, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
};
