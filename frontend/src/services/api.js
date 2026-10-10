import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('restaura_token')) {
        localStorage.removeItem('restaura_token');
        localStorage.removeItem('restaura_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const categoriesApi = {
  getAll: (includeInactive = false) => api.get(`/categories?includeInactive=${includeInactive}`),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const foodsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return api.get(`/foods?${query.toString()}`);
  },
  getByIdOrSlug: (idOrSlug) => api.get(`/foods/${idOrSlug}`),
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  toggleAvailability: (id) => api.patch(`/foods/${id}/toggle-availability`),
  delete: (id) => api.delete(`/foods/${id}`)
};

export const cartApi = {
  get: () => api.get('/cart'),
  add: (food_id, quantity = 1) => api.post('/cart/add', { food_id, quantity }),
  updateItem: (id, quantity) => api.put(`/cart/item/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/cart/item/${id}`),
  clear: () => api.delete('/cart/clear')
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  getIds: () => api.get('/wishlist/ids'),
  toggle: (food_id) => api.post('/wishlist/toggle', { food_id })
};

export const addressesApi = {
  getAll: () => api.get('/addresses'),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  setDefault: (id) => api.patch(`/addresses/${id}/default`),
  delete: (id) => api.delete(`/addresses/${id}`)
};

export const ordersApi = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason })
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return api.get(`/admin/orders?${query.toString()}`);
  },
  updateOrderStatus: (id, status, cancel_reason) => api.patch(`/admin/orders/${id}/status`, { status, cancel_reason }),
  getCustomers: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return api.get(`/admin/customers?${query.toString()}`);
  },
  toggleCustomerStatus: (id) => api.patch(`/admin/customers/${id}/toggle-status`),
  getAnalytics: () => api.get('/admin/analytics')
};

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
};

export default api;
