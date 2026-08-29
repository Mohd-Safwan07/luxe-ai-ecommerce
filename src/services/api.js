const getApiBaseUrl = () => {
  let rawUrl = import.meta.env.VITE_API_URL;

  // If VITE_API_URL is not set (e.g. during Vercel build where .env is gitignored), default to live deployed backend in production
  if (!rawUrl) {
    if (
      import.meta.env.MODE === 'production' ||
      (typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1')
    ) {
      rawUrl = 'https://backend-three-pi-83.vercel.app';
    } else {
      rawUrl = 'http://localhost:5000';
    }
  }

  // Normalize URL: strip trailing slashes and any duplicate /api suffix
  let cleanUrl = rawUrl.replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api')) {
    cleanUrl = cleanUrl.slice(0, -4);
  }
  return cleanUrl;
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
