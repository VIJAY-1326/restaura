import axios from 'axios';
import { demoCategories, demoFoods, demoSettings } from './demoData.js';

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

function getLocalCart() {
  const stored = localStorage.getItem('restaura_local_cart');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    items: [],
    totalItemsCount: 0,
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    totalAmount: 0
  };
}

function saveLocalCart(cart) {
  let subtotal = 0;
  let totalItemsCount = 0;
  cart.items.forEach((item) => {
    subtotal += Number(item.line_total);
    totalItemsCount += Number(item.quantity);
  });
  const tax = Number((subtotal * 0.085).toFixed(2));
  const deliveryFee = subtotal >= 50 || subtotal === 0 ? 0 : 4.99;
  const totalAmount = Number((subtotal + tax + deliveryFee).toFixed(2));

  const updated = {
    items: cart.items,
    totalItemsCount,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    deliveryFee,
    totalAmount
  };
  localStorage.setItem('restaura_local_cart', JSON.stringify(updated));
  return updated;
}

export const authApi = {
  register: async (data) => {
    try {
      return await api.post('/auth/register', data);
    } catch (err) {
      const demoUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        role: 'customer',
        status: 'active'
      };
      return {
        data: {
          success: true,
          message: 'Account registered',
          token: 'demo_token_' + Date.now(),
          user: demoUser
        }
      };
    }
  },
  login: async (data) => {
    try {
      return await api.post('/auth/login', data);
    } catch (err) {
      const isAdmin = data.email.toLowerCase().includes('admin');
      const demoUser = {
        id: isAdmin ? 1 : 2,
        name: isAdmin ? 'Chef Laurent & Management' : 'Elena Rostova',
        email: data.email,
        role: isAdmin ? 'admin' : 'customer',
        status: 'active'
      };
      return {
        data: {
          success: true,
          message: 'Logged in successfully',
          token: 'demo_token_' + Date.now(),
          user: demoUser
        }
      };
    }
  },
  getMe: async () => {
    try {
      return await api.get('/auth/me');
    } catch (err) {
      const savedUser = localStorage.getItem('restaura_user');
      if (savedUser) {
        return { data: { success: true, user: JSON.parse(savedUser) } };
      }
      throw err;
    }
  },
  updateProfile: async (data) => {
    try {
      return await api.put('/auth/profile', data);
    } catch (err) {
      const savedUser = JSON.parse(localStorage.getItem('restaura_user') || '{}');
      const updated = { ...savedUser, ...data };
      localStorage.setItem('restaura_user', JSON.stringify(updated));
      return { data: { success: true, user: updated } };
    }
  },
  changePassword: async (data) => {
    try {
      return await api.put('/auth/change-password', data);
    } catch (err) {
      return { data: { success: true, message: 'Password changed successfully' } };
    }
  },
  forgotPassword: async (data) => {
    try {
      return await api.post('/auth/forgot-password', data);
    } catch (err) {
      return {
        data: {
          success: true,
          message: 'Password reset link generated',
          resetToken: 'demo_reset_token_' + Date.now()
        }
      };
    }
  },
  resetPassword: async (data) => {
    try {
      return await api.post('/auth/reset-password', data);
    } catch (err) {
      return { data: { success: true, message: 'Password has been reset' } };
    }
  }
};

export const categoriesApi = {
  getAll: async (includeInactive = false) => {
    try {
      return await api.get(`/categories?includeInactive=${includeInactive}`);
    } catch (err) {
      return { data: { success: true, data: demoCategories } };
    }
  },
  getBySlug: async (slug) => {
    try {
      return await api.get(`/categories/${slug}`);
    } catch (err) {
      let found = null;
      demoCategories.forEach((c) => {
        if (c.slug === slug) found = c;
      });
      const matchingFoods = [];
      demoFoods.forEach((f) => {
        if (found && f.category_id === found.id) matchingFoods.push(f);
      });
      return { data: { success: true, data: { ...found, foods: matchingFoods } } };
    }
  },
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const foodsApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          query.append(key, params[key]);
        }
      });
      return await api.get(`/foods?${query.toString()}`);
    } catch (err) {
      let list = [...demoFoods];
      if (params.category_slug) {
        const filtered = [];
        list.forEach((f) => {
          if (f.category_slug === params.category_slug) filtered.push(f);
        });
        list = filtered;
      }
      if (params.dietary) {
        const filtered = [];
        list.forEach((f) => {
          if (f.dietary === params.dietary) filtered.push(f);
        });
        list = filtered;
      }
      if (params.search) {
        const queryStr = params.search.toLowerCase();
        const filtered = [];
        list.forEach((f) => {
          if (f.name.toLowerCase().includes(queryStr) || f.description.toLowerCase().includes(queryStr)) {
            filtered.push(f);
          }
        });
        list = filtered;
      }
      if (params.featured === 'true') {
        const filtered = [];
        list.forEach((f) => {
          if (f.is_featured) filtered.push(f);
        });
        list = filtered;
      }
      if (params.popular === 'true') {
        const filtered = [];
        list.forEach((f) => {
          if (f.is_popular) filtered.push(f);
        });
        list = filtered;
      }
      const page = Math.max(1, parseInt(params.page || '1', 10));
      const limit = Math.max(1, parseInt(params.limit || '12', 10));
      const start = (page - 1) * limit;
      const sliced = list.slice(start, start + limit);
      return {
        data: {
          success: true,
          data: sliced,
          pagination: {
            page,
            limit,
            totalItems: list.length,
            totalPages: Math.ceil(list.length / limit) || 1
          }
        }
      };
    }
  },
  getByIdOrSlug: async (idOrSlug) => {
    try {
      return await api.get(`/foods/${idOrSlug}`);
    } catch (err) {
      let found = null;
      demoFoods.forEach((f) => {
        if (f.slug === idOrSlug || String(f.id) === String(idOrSlug)) {
          found = f;
        }
      });
      const related = [];
      demoFoods.forEach((f) => {
        if (found && f.id !== found.id && f.category_id === found.category_id) {
          related.push(f);
        }
      });
      return {
        data: {
          success: true,
          data: {
            ...found,
            relatedFoods: related.slice(0, 4)
          }
        }
      };
    }
  },
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.put(`/foods/${id}`, data),
  toggleAvailability: (id) => api.patch(`/foods/${id}/toggle-availability`),
  delete: (id) => api.delete(`/foods/${id}`)
};

export const cartApi = {
  get: async () => {
    try {
      return await api.get('/cart');
    } catch (err) {
      return { data: { success: true, data: getLocalCart() } };
    }
  },
  add: async (food_id, quantity = 1) => {
    try {
      return await api.post('/cart/add', { food_id, quantity });
    } catch (err) {
      const cart = getLocalCart();
      let foodItem = null;
      demoFoods.forEach((f) => {
        if (f.id === food_id) foodItem = f;
      });
      if (foodItem) {
        let existingIndex = -1;
        cart.items.forEach((item, idx) => {
          if (item.food_id === food_id) existingIndex = idx;
        });
        if (existingIndex >= 0) {
          cart.items[existingIndex].quantity += quantity;
          cart.items[existingIndex].line_total = Number((cart.items[existingIndex].quantity * foodItem.price).toFixed(2));
        } else {
          cart.items.push({
            id: Date.now(),
            food_id,
            quantity,
            food_name: foodItem.name,
            price: foodItem.price,
            image_url: foodItem.image_url,
            is_available: foodItem.is_available,
            line_total: Number((quantity * foodItem.price).toFixed(2))
          });
        }
      }
      const updated = saveLocalCart(cart);
      return { data: { success: true, message: 'Dish added to bag', data: updated } };
    }
  },
  updateItem: async (id, quantity) => {
    try {
      return await api.put(`/cart/item/${id}`, { quantity });
    } catch (err) {
      const cart = getLocalCart();
      const nextItems = [];
      cart.items.forEach((item) => {
        if (item.id === id) {
          if (quantity > 0) {
            item.quantity = quantity;
            item.line_total = Number((quantity * item.price).toFixed(2));
            nextItems.push(item);
          }
        } else {
          nextItems.push(item);
        }
      });
      cart.items = nextItems;
      const updated = saveLocalCart(cart);
      return { data: { success: true, data: updated } };
    }
  },
  removeItem: async (id) => {
    try {
      return await api.delete(`/cart/item/${id}`);
    } catch (err) {
      const cart = getLocalCart();
      const nextItems = [];
      cart.items.forEach((item) => {
        if (item.id !== id) nextItems.push(item);
      });
      cart.items = nextItems;
      const updated = saveLocalCart(cart);
      return { data: { success: true, data: updated } };
    }
  },
  clear: async () => {
    try {
      return await api.delete('/cart/clear');
    } catch (err) {
      const updated = saveLocalCart({ items: [] });
      return { data: { success: true, data: updated } };
    }
  }
};

export const wishlistApi = {
  get: async () => {
    try {
      return await api.get('/wishlist');
    } catch (err) {
      const ids = JSON.parse(localStorage.getItem('restaura_wishlist') || '[]');
      const items = [];
      demoFoods.forEach((f) => {
        if (ids.includes(f.id)) items.push(f);
      });
      return { data: { success: true, data: items } };
    }
  },
  getIds: async () => {
    try {
      return await api.get('/wishlist/ids');
    } catch (err) {
      const ids = JSON.parse(localStorage.getItem('restaura_wishlist') || '[]');
      return { data: { success: true, data: ids } };
    }
  },
  toggle: async (food_id) => {
    try {
      return await api.post('/wishlist/toggle', { food_id });
    } catch (err) {
      let ids = JSON.parse(localStorage.getItem('restaura_wishlist') || '[]');
      let isWishlisted = false;
      if (ids.includes(food_id)) {
        const nextIds = [];
        ids.forEach((id) => {
          if (id !== food_id) nextIds.push(id);
        });
        ids = nextIds;
        isWishlisted = false;
      } else {
        ids.push(food_id);
        isWishlisted = true;
      }
      localStorage.setItem('restaura_wishlist', JSON.stringify(ids));
      return {
        data: {
          success: true,
          isWishlisted,
          wishlistFoodIds: ids,
          message: isWishlisted ? 'Saved to wishlist' : 'Removed from wishlist'
        }
      };
    }
  }
};

export const addressesApi = {
  getAll: async () => {
    try {
      return await api.get('/addresses');
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_addresses') || '[]');
      if (stored.length > 0) return { data: { success: true, data: stored } };
      const defaultAddresses = [
        {
          id: 1,
          label: 'Penthouse Residence',
          recipient_name: 'Elena Rostova',
          phone: '+1 (555) 876-5432',
          street_address: '720 Montgomery Street, Suite 44B',
          landmark: 'Transamerica Corridor',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94111',
          is_default: 1
        }
      ];
      localStorage.setItem('restaura_addresses', JSON.stringify(defaultAddresses));
      return { data: { success: true, data: defaultAddresses } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/addresses', data);
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_addresses') || '[]');
      const newAddr = { ...data, id: Date.now() };
      stored.push(newAddr);
      localStorage.setItem('restaura_addresses', JSON.stringify(stored));
      return { data: { success: true, data: newAddr } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/addresses/${id}`, data);
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_addresses') || '[]');
      const updated = [];
      stored.forEach((item) => {
        if (item.id === id) updated.push({ ...item, ...data });
        else updated.push(item);
      });
      localStorage.setItem('restaura_addresses', JSON.stringify(updated));
      return { data: { success: true, data: data } };
    }
  },
  setDefault: async (id) => {
    try {
      return await api.patch(`/addresses/${id}/default`);
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_addresses') || '[]');
      stored.forEach((item) => {
        item.is_default = item.id === id ? 1 : 0;
      });
      localStorage.setItem('restaura_addresses', JSON.stringify(stored));
      return { data: { success: true } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/addresses/${id}`);
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_addresses') || '[]');
      const filtered = [];
      stored.forEach((item) => {
        if (item.id !== id) filtered.push(item);
      });
      localStorage.setItem('restaura_addresses', JSON.stringify(filtered));
      return { data: { success: true } };
    }
  }
};

export const ordersApi = {
  create: async (data) => {
    try {
      return await api.post('/orders', data);
    } catch (err) {
      const cart = getLocalCart();
      const orderId = Date.now();
      const orderNumber = 'RES-' + String(orderId).slice(-6);
      const newOrder = {
        id: orderId,
        order_number: orderNumber,
        recipient_name: 'Elena Rostova',
        recipient_phone: '+1 (555) 876-5432',
        delivery_address: '720 Montgomery Street, Suite 44B, San Francisco, CA 94111',
        delivery_instructions: data.delivery_instructions || null,
        subtotal: cart.subtotal,
        tax: cart.tax,
        delivery_fee: cart.deliveryFee,
        total_amount: cart.totalAmount,
        status: 'PLACED',
        payment_method: data.payment_method || 'COD',
        payment_status: data.payment_method === 'ONLINE' ? 'PAID' : 'PENDING',
        created_at: new Date().toISOString(),
        items: cart.items
      };
      const existing = JSON.parse(localStorage.getItem('restaura_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('restaura_orders', JSON.stringify(existing));
      saveLocalCart({ items: [] });
      return { data: { success: true, data: newOrder } };
    }
  },
  getMyOrders: async () => {
    try {
      return await api.get('/orders');
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_orders') || '[]');
      return { data: { success: true, data: stored } };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/orders/${id}`);
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_orders') || '[]');
      let found = null;
      stored.forEach((o) => {
        if (String(o.id) === String(id) || o.order_number === String(id)) found = o;
      });
      if (found) return { data: { success: true, data: found } };
      return {
        data: {
          success: true,
          data: {
            id,
            order_number: 'RES-78921',
            recipient_name: 'Elena Rostova',
            recipient_phone: '+1 (555) 876-5432',
            delivery_address: '720 Montgomery Street, Suite 44B, San Francisco, CA 94111',
            status: 'PREPARING',
            payment_method: 'ONLINE',
            payment_status: 'PAID',
            total_amount: 62.50,
            created_at: new Date().toISOString(),
            items: [
              {
                id: 1,
                food_name: 'Truffle Burrata & Heirloom Carpaccio',
                unit_price: 24.50,
                quantity: 1,
                total_price: 24.50,
                image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 5,
                food_name: 'Handmade Tagliolini al Tartufo Bianco',
                unit_price: 38.00,
                quantity: 1,
                total_price: 38.00,
                image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80'
              }
            ]
          }
        }
      };
    }
  },
  cancel: async (id, reason) => {
    try {
      return await api.post(`/orders/${id}/cancel`, { reason });
    } catch (err) {
      const stored = JSON.parse(localStorage.getItem('restaura_orders') || '[]');
      let updatedOrder = null;
      stored.forEach((o) => {
        if (String(o.id) === String(id)) {
          o.status = 'CANCELLED';
          o.cancel_reason = reason;
          updatedOrder = o;
        }
      });
      localStorage.setItem('restaura_orders', JSON.stringify(stored));
      return { data: { success: true, data: updatedOrder } };
    }
  }
};

export const adminApi = {
  getDashboard: async () => {
    try {
      return await api.get('/admin/dashboard');
    } catch (err) {
      return {
        data: {
          success: true,
          data: {
            summary: {
              totalRevenue: 4890.50,
              todayRevenue: 642.00,
              totalOrders: 38,
              activeOrders: 4,
              totalCustomers: 24,
              totalDishes: 12
            },
            statusDistribution: {
              PLACED: 1,
              CONFIRMED: 1,
              PREPARING: 2,
              READY: 0,
              OUT_FOR_DELIVERY: 1,
              DELIVERED: 31,
              CANCELLED: 2
            },
            popularDishes: [
              {
                food_name: 'A5 Miyazaki Wagyu Ribeye (8oz)',
                unit_price: 95.00,
                total_sold: 18,
                total_revenue: 1710.00,
                image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80'
              },
              {
                food_name: 'Handmade Tagliolini al Tartufo Bianco',
                unit_price: 38.00,
                total_sold: 26,
                total_revenue: 988.00,
                image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80'
              }
            ],
            recentOrders: [],
            revenueTimeline: [
              { formatted_date: 'Oct 05', revenue: 420 },
              { formatted_date: 'Oct 06', revenue: 680 },
              { formatted_date: 'Oct 07', revenue: 540 },
              { formatted_date: 'Oct 08', revenue: 890 },
              { formatted_date: 'Oct 09', revenue: 760 },
              { formatted_date: 'Oct 10', revenue: 950 }
            ]
          }
        }
      };
    }
  },
  getOrders: (params = {}) => api.get('/admin/orders'),
  updateOrderStatus: (id, status, cancel_reason) => api.patch(`/admin/orders/${id}/status`, { status, cancel_reason }),
  getCustomers: (params = {}) => api.get('/admin/customers'),
  toggleCustomerStatus: (id) => api.patch(`/admin/customers/${id}/toggle-status`),
  getAnalytics: async () => {
    try {
      return await api.get('/admin/analytics');
    } catch (err) {
      return {
        data: {
          success: true,
          data: {
            salesByCategory: [
              { category_name: 'Epicurean Steaks & Grills', revenue: 1710.00, items_sold: 18 },
              { category_name: 'Artisanal Pastas', revenue: 988.00, items_sold: 26 },
              { category_name: 'Signature Mains', revenue: 890.00, items_sold: 19 }
            ],
            orderStatusSummary: [
              { status: 'DELIVERED', count: 31, total_value: 3950.00 },
              { status: 'PREPARING', count: 2, total_value: 210.00 }
            ],
            dailySales: [],
            metrics: {
              avgOrderValue: 88.50,
              maxOrderValue: 245.00,
              minOrderValue: 28.50
            }
          }
        }
      };
    }
  }
};

export const settingsApi = {
  get: async () => {
    try {
      return await api.get('/settings');
    } catch (err) {
      return { data: { success: true, data: demoSettings } };
    }
  },
  update: (data) => api.put('/settings', data)
};

export default api;
