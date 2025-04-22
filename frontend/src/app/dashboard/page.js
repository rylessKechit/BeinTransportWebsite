'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/lib/api';
import { 
  Calendar, Clock, MapPin, Truck, Package, AlertTriangle, 
  CheckCircle, XCircle, FileText, ChevronRight, Loader 
} from 'lucide-react';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getAll();
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des réservations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchBookings();
    }
  }, [user]);
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);
  
  // Filtrer les réservations par statut
  const filterBookings = (status) => {
    if (status === 'upcoming') {
      return bookings.filter(booking => 
        ['pending', 'confirmed'].includes(booking.status) && 
        new Date(booking.date) >= new Date()
      );
    } else if (status === 'past') {
      return bookings.filter(booking => 
        booking.status === 'completed' || 
        new Date(booking.date) < new Date()
      );
    } else if (status === 'cancelled') {
      return bookings.filter(booking => booking.status === 'cancelled');
    }
    return [];
  };
  
  const handleCancelBooking = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await bookingService.cancel(id);
        // Mettre à jour l'état local
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === id ? { ...booking, status: 'cancelled' } : booking
          )
        );
      } catch (err) {
        setError("Erreur lors de l'annulation de la réservation");
        console.error(err);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-red-600 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }
  
  if (!user) {
    return null; // La redirection sera prise en charge par useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-gray-600 mb-8">Bienvenue, {user?.firstName}! Gérez vos réservations ici.</p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 text-red-700">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'upcoming'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                À venir
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'past'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('past')}
              >
                Passées
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'cancelled'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('cancelled')}
              >
                Annulées
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {filterBookings(activeTab).length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'upcoming'
                    ? "Vous n'avez pas de réservations à venir."
                    : activeTab === 'past'
                    ? "Vous n'avez pas encore effectué de réservation."
                    : "Vous n'avez pas de réservations annulées."}
                </p>
                <Link
                  href="/reservation"
                  className="inline-flex items-center text-red-600 hover:text-red-700"
                >
                  Faire une réservation
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filterBookings(activeTab).map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={() => handleCancelBooking(booking._id)}
                    isPast={activeTab === 'past'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/reservation"
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg transition-colors"
          >
            Nouvelle réservation
          </Link>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, isPast }) {
  // Fonction pour formater la date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Déterminer le statut à afficher
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            En attente
          </span>
        );
      case 'confirmed':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Confirmée
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            Terminée
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            Annulée
          </span>
        );
      default:
        return null;
    }
  };
  
  // Déterminer le type de service à afficher
  const getServiceType = (type) => {
    switch (type) {
      case 'demenagement':
        return 'Déménagement';
      case 'livraison':
        return 'Livraison';
      case 'transport':
        return 'Transport';
      default:
        return type;
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-lg font-semibold mr-3">
                {booking.vehicle ? `${booking.vehicle.name} (${booking.vehicle.capacity}m³)` : 'Véhicule'}
              </span>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-gray-600 mb-4">
              {getServiceType(booking.bookingType)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{booking.totalPrice} €</p>
            {booking.handlers > 0 && (
              <p className="text-sm text-gray-500">
                {booking.handlers} manutentionnaire{booking.handlers > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{formatDate(booking.date)}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Horaire</p>
              <p>{booking.timeSlot}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Adresse de départ</p>
              <p>
                {booking.pickupAddress.street}, {booking.pickupAddress.postalCode} {booking.pickupAddress.city}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Adresse d'arrivée</p>
              <p>
                {booking.deliveryAddress.street}, {booking.deliveryAddress.postalCode} {booking.deliveryAddress.city}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link
            href={`/bookings/${booking._id}`}
            className="text-red-600 hover:text-red-700 flex items-center"
          >
            <FileText className="h-4 w-4 mr-1" />
            Détails
          </Link>
          
          {!isPast && booking.status !== 'cancelled' && (
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Annuler
            </button>
          )}
          
          {isPast && booking.status === 'completed' && !booking.hasReview && (
            <Link
              href={`/reviews/add/${booking._id}`}
              className="text-green-600 hover:text-green-700 flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Laisser un avis
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}