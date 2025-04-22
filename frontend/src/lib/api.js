import axios from 'axios';
import Cookies from 'js-cookie';
import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs 401 (non authentifié)
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Services d'API

// Service d'authentification
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.get('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service de véhicules
export const vehicleService = {
  getAll: async () => {
    try {
      const response = await api.get('/vehicles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  create: async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id, vehicleData) => {
    try {
      const response = await api.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service de réservations
export const bookingService = {
  getAll: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id, bookingData) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  cancel: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Calculer le prix estimé d'une réservation
  calculatePrice: async (bookingData) => {
    try {
      const response = await api.post('/bookings/calculate', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service de paiement (pour Stripe)
export const paymentService = {
  createPaymentIntent: async (bookingId) => {
    try {
      const response = await api.post(`/payments/create-intent/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  confirmPayment: async (bookingId, paymentIntentId) => {
    try {
      const response = await api.post(`/payments/confirm/${bookingId}`, { paymentIntentId });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Hook personnalisé pour SWR (récupération de données avec mise en cache)
export const useFetch = (url, options = {}) => {
  const fetcher = async (url) => {
    const response = await api.get(url);
    return response.data;
  };
  
  const { data, error, mutate } = useSWR(url, fetcher, options);
  
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

export default api;