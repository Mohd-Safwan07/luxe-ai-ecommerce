const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly configured, use it (removing any trailing slash)
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    return envUrl.endsWith('/api') ? envUrl.slice(0, -4) : envUrl;
  }
  // In production / deployed environment (non-localhost), default to relative path "" so requests target /api/... on same domain
  if (
    import.meta.env.MODE === 'production' ||
    (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1')
  ) {
    return '';
  }
  // Local development fallback
  return 'http://localhost:5000';
};

const getAuthHeader = () => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

export const fetchProductsFromAPI = async () => {
  return await apiFetch('/products');
};
