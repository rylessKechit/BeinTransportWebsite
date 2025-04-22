'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService, vehicleService } from '../lib/api';
import useAuth from './useAuth';

export default function useBooking() {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const router = useRouter();

  // Récupérer toutes les réservations de l'utilisateur
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setBookings([]);
        return;
      }
      
      const response = await bookingService.getAll();
      
      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des réservations');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des réservations:', err);
      setError('Une erreur est survenue lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer une réservation spécifique
  const fetchBookingById = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingService.getById(bookingId);
      
      if (response.success) {
        setCurrentBooking(response.data);
        return response.data;
      } else {
        setError(response.message || 'Erreur lors du chargement de la réservation');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de la réservation:', err);
      setError('Une erreur est survenue lors du chargement de la réservation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer tous les véhicules disponibles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vehicleService.getAll();
      
      if (response.success) {
        setVehicles(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des véhicules');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des véhicules:', err);
      setError('Une erreur est survenue lors du chargement des véhicules');
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle réservation
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setError('Veuillez vous connecter pour créer une réservation');
        return null;
      }
      
      const response = await bookingService.create(bookingData);
      
      if (response.success) {
        // Mettre à jour la liste des réservations
        await fetchBookings();
        return response.data;
      } else {
        setError(response.message || 'Erreur lors de la création de la réservation');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la création de la réservation:', err);
      setError('Une erreur est survenue lors de la création de la réservation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une réservation existante
  const updateBooking = async (bookingId, bookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingService.update(bookingId, bookingData);
      
      if (response.success) {
        // Mettre à jour la liste des réservations
        await fetchBookings();
        
        // Mettre à jour la réservation courante si elle est chargée
        if (currentBooking && currentBooking._id === bookingId) {
          setCurrentBooking(response.data);
        }
        
        return response.data;
      } else {
        setError(response.message || 'Erreur lors de la mise à jour de la réservation');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la réservation:', err);
      setError('Une erreur est survenue lors de la mise à jour de la réservation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Annuler une réservation
  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingService.cancel(bookingId);
      
      if (response.success) {
        // Mettre à jour la liste des réservations
        await fetchBookings();
        
        // Mettre à jour la réservation courante si elle est chargée
        if (currentBooking && currentBooking._id === bookingId) {
          setCurrentBooking(response.data);
        }
        
        return true;
      } else {
        setError(response.message || 'Erreur lors de l\'annulation de la réservation');
        return false;
      }
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la réservation:', err);
      setError('Une erreur est survenue lors de l\'annulation de la réservation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calculer le prix d'une réservation
  const calculatePrice = (vehicleId, distance = 10, handlers = 0) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    
    if (!vehicle) return 0;
    
    const basePrice = vehicle.basePrice;
    const distancePrice = distance * vehicle.pricePerKm;
    const handlerPrice = handlers * 25; // 25€ par manutentionnaire
    
    return basePrice + distancePrice + handlerPrice;
  };

  // Filtrer les réservations par statut
  const filterBookingsByStatus = (status) => {
    if (!status || status === 'all') return bookings;
    
    return bookings.filter(booking => booking.status === status);
  };

  // Filtrer les réservations à venir vs passées
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      ['pending', 'confirmed'].includes(booking.status) && 
      new Date(booking.date) >= now
    );
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.status === 'completed' || 
      (booking.status !== 'cancelled' && new Date(booking.date) < now)
    );
  };

  // Trier les réservations par date
  const sortBookingsByDate = (bookingsToSort, ascending = false) => {
    return [...bookingsToSort].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  // Effet pour charger les véhicules au montage
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Effet pour charger les réservations quand l'utilisateur change
  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  return {
    bookings,
    currentBooking,
    vehicles,
    loading,
    error,
    fetchBookings,
    fetchBookingById,
    fetchVehicles,
    createBooking,
    updateBooking,
    cancelBooking,
    calculatePrice,
    filterBookingsByStatus,
    getUpcomingBookings,
    getPastBookings,
    sortBookingsByDate
  };
}