const getApiBaseUrl = () => {
  // Use VITE_API_URL if defined (from root .env or environment variables), stripping trailing slashes or duplicate /api
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    return envUrl.endsWith('/api') ? envUrl.slice(0, -4) : envUrl;
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
