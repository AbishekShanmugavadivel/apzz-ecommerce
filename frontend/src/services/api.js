import axios from "axios";

// Backend API URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://apzz-ecommerce.onrender.com/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add authentication token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),

  login: (credentials) => api.post("/auth/login", credentials),

  getProfile: () => api.get("/auth/profile"),

  logout: () => api.post("/auth/logout"),
};

// ================= PRODUCT APIs =================

export const productAPI = {
  getProducts: (params) => api.get("/products", { params }),

  getProduct: (id) => api.get(`/product/${id}`),

  createProduct: (productData) => api.post("/admin/product", productData),

  updateProduct: (id, productData) =>
    api.put(`/admin/product/${id}`, productData),

  deleteProduct: (id) => api.delete(`/admin/product/${id}`),
};

// ================= CART APIs =================

export const cartAPI = {
  getCart: () => api.get("/cart"),

  addToCart: (productId, quantity = 1) =>
    api.post("/cart/add", { productId, quantity }),

  updateCartItem: (productId, quantity) =>
    api.put("/cart/update", { productId, quantity }),

  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),

  clearCart: () => api.delete("/cart/clear"),
};

// ================= ORDER APIs =================

export const orderAPI = {
  createOrder: (orderData) => api.post("/order", orderData),

  getOrders: () => api.get("/orders"),

  getOrder: (id) => api.get(`/order/${id}`),
};

export default api;