'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Vérifier si l'utilisateur est connecté
  const checkUserLoggedIn = async () => {
    try {
      const token = Cookies.get('token');
      
      if (token) {
        // Configuration des headers Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
        
        setUser(res.data.data);
      }
    } catch (error) {
      Cookies.remove('token');
      setUser(null);
    }
    
    setLoading(false);
  };

  // Inscription
  const register = async (userData) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, userData);
      
      if (res.data.success) {
        Cookies.set('token', res.data.token, { expires: 30 });
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return true;
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Une erreur est survenue');
      return false;
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      });
      
      if (res.data.success) {
        Cookies.set('token', res.data.token, { expires: 30 });
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return true;
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Identifiants invalides');
      return false;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    } catch (error) {
      console.error('Erreur lors de la déconnexion');
    }
    
    Cookies.remove('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);