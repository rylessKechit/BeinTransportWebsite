'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/api';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  // Vérifier si l'utilisateur est connecté
  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Configurer le header axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await authService.getProfile();
      
      if (response.success) {
        setUser(response.data);
      } else {
        logout(); // Si le token est invalide, déconnecter l'utilisateur
      }
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'authentification:', err);
      logout(); // En cas d'erreur, on déconnecte l'utilisateur par sécurité
    } finally {
      setLoading(false);
    }
  };

  // Connexion utilisateur
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Stocker le token dans un cookie (30 jours)
        Cookies.set('token', response.token, { expires: 30 });
        
        // Configurer le header axios pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        // Mettre à jour l'état utilisateur
        setUser(response.user);
        
        return true;
      } else {
        setError(response.message || 'Identifiants invalides');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Inscription utilisateur
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        // Stocker le token dans un cookie
        Cookies.set('token', response.token, { expires: 30 });
        
        // Configurer le header axios pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        // Mettre à jour l'état utilisateur
        setUser(response.user);
        
        return true;
      } else {
        setError(response.message || 'Erreur lors de l\'inscription');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion utilisateur
  const logout = async () => {
    try {
      // Appel à l'API pour invalider le token côté serveur
      try {
        await authService.logout();
      } catch (err) {
        // Si l'API échoue, on continue quand même la déconnexion côté client
        console.error('Erreur lors de la déconnexion:', err);
      }
      
      // Supprimer le token côté client
      Cookies.remove('token');
      
      // Supprimer le header d'autorisation
      delete axios.defaults.headers.common['Authorization'];
      
      // Réinitialiser l'état utilisateur
      setUser(null);
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  // Mise à jour du profil utilisateur
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implémenter l'appel à l'API pour mettre à jour le profil
      // L'API n'est pas encore disponible dans le code fourni
      
      // Simuler une mise à jour pour l'instant
      setUser(prevUser => ({ ...prevUser, ...profileData }));
      
      return true;
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Récupération de mot de passe (à implémenter)
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implémenter l'appel à l'API pour la récupération de mot de passe
      // L'API n'est pas encore disponible dans le code fourni
      
      return true;
    } catch (err) {
      setError('Erreur lors de la demande de récupération de mot de passe');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation de mot de passe (à implémenter)
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implémenter l'appel à l'API pour la réinitialisation de mot de passe
      // L'API n'est pas encore disponible dans le code fourni
      
      return true;
    } catch (err) {
      setError('Erreur lors de la réinitialisation du mot de passe');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAdmin,
    checkAuth
  };
}