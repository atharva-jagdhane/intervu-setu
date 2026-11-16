/**
 * API Service Client
 * Handles HTTP requests to the IntervuSetu backend with credentials (cookies) included.
 */

const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    // Crucial: Includes HTTP-only session cookies with every cross-origin request
    credentials: 'include'
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth endpoints
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getMe: () => request('/auth/me', {
    method: 'GET'
  }),

  logout: () => request('/auth/logout', {
    method: 'POST'
  }),

  // Health
  checkHealth: () => request('/health', {
    method: 'GET'
  }),

  // Interview Configuration (Phase 2)
  getTaxonomy: () => request('/interview/taxonomy', {
    method: 'GET'
  }),

  createInterviewConfig: (configData) => request('/interview/config', {
    method: 'POST',
    body: JSON.stringify(configData)
  }),

  getMyInterviewConfigs: () => request('/interview/config', {
    method: 'GET'
  }),

  getInterviewConfigById: (id) => request(`/interview/config/${id}`, {
    method: 'GET'
  }),

  // AI Question Generation (Phase 3)
  generateQuestions: (configId, regenerate = false) => request(`/interview/${configId}/generate${regenerate ? '?regenerate=true' : ''}`, {
    method: 'POST'
  }),

  getQuestions: (configId) => request(`/interview/${configId}/questions`, {
    method: 'GET'
  })
};
