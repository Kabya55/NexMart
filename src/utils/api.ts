const API_BASE_URL = 'http://localhost:5000/api';

// Get current token from local storage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('nexmart_token');
  }
  return null;
};

// Set token in local storage
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexmart_token', token);
  }
};

// Remove token from local storage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexmart_token');
  }
};

export const getBetterAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/better-auth\.session_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  return null;
};

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  // Set JSON content-type if not already set and body is present
  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach token
  const token = options.token !== undefined ? options.token : (getBetterAuthToken() || getToken());
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
};
