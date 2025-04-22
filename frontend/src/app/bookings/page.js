'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Truck, FileText, Eye, 
  XCircle, CheckCircle, Filter, Search, Loader 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../lib/api';
import { 
  formatDate, formatCurrency, getServiceTypeName, 
  getBookingStatusLabel, getStatusBadgeClasses 
} from '../../lib/utils';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Rediriger vers la connexion si non authentifié
    if (!user) {
      router.push('/auth/login?redirect=/bookings');
      return;
    }
    
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getAll();
        
        if (response.success) {
          setBookings(response.data);
          setFilteredBookings(response.data);
        } else {
          setError('Erreur lors du chargement des réservations');
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des réservations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
    
    // Récupérer les filtres depuis l'URL
    const status = searchParams.get('status');
    if (status) {
      setFilterStatus(status);
    }
  }, [user, router, searchParams]);
  
  // Filtrer les réservations lorsque les critères changent
  useEffect(() => {
    let result = [...bookings];
    
    // Filtrer par statut
    if (filterStatus !== 'all') {
      result = result.filter(booking => booking.status === filterStatus);
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.pickupAddress.city.toLowerCase().includes(query) ||
        booking.deliveryAddress.city.toLowerCase().includes(query) ||
        getServiceTypeName(booking.bookingType).toLowerCase().includes(query)
      );
    }
    
    setFilteredBookings(result);
  }, [bookings, filterStatus, searchQuery]);
  
  const handleCancelBooking = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        const response = await bookingService.cancel(id);
        
        if (response.success) {
          // Mettre à jour localement la réservation annulée
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking._id === id ? { ...booking, status: 'cancelled' } : booking
            )
          );
        } else {
          setError("Erreur lors de l'annulation de la réservation");
        }
      } catch (err) {
        setError("Une erreur est survenue lors de l'annulation");
        console.error(err);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-red-600 animate-spin" />
        <span className="ml-2">Chargement des réservations...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
            <p className="text-gray-600">Retrouvez et gérez l'ensemble de vos réservations</p>
          </div>
          <Link
            href="/reservation"
            className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors inline-flex items-center"
          >
            Nouvelle réservation
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-700">
            {error}
          </div>
        )}
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par ville ou type de service..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <label className="inline-flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="mr-2">Filtrer:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="in-progress">En cours</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        
        {/* Liste des réservations */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h2>
            <p className="text-gray-600 mb-6">
              {filterStatus !== 'all' || searchQuery 
                ? "Aucune réservation ne correspond à vos critères de recherche." 
                : "Vous n'avez pas encore de réservation."}
            </p>
            <Link
              href="/reservation"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              Effectuer une réservation
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold mr-3">
                          {booking.vehicle ? booking.vehicle.name : 'Véhicule'} - {getServiceTypeName(booking.bookingType)}
                        </h3>
                        <span className={`${getStatusBadgeClasses(booking.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                          {getBookingStatusLabel(booking.status)}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Réservation #{booking._id.substr(-6).toUpperCase()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <span className="text-lg font-bold">{formatCurrency(booking.totalPrice)}</span>
                      <p className="text-sm text-gray-500">
                        {booking.paymentStatus === 'paid' ? 'Payé' : 'En attente de paiement'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Véhicule</p>
                        <p>{booking.vehicle ? `${booking.vehicle.name} (${booking.vehicle.capacity}m³)` : 'Information non disponible'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  
                  <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex space-x-2 mb-2 md:mb-0">
                      <Link
                        href={`/bookings/${booking._id}`}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-lg"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Link>
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="inline-flex items-center text-gray-600 hover:text-red-600 px-3 py-1 border border-gray-300 rounded-lg"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Annuler
                        </button>
                      )}
                      {booking.status === 'completed' && !booking.hasReview && (
                        <Link
                          href={`/reviews/add/${booking._id}`}
                          className="inline-flex items-center text-green-600 hover:text-green-700 px-3 py-1 border border-green-300 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Laisser un avis
                        </Link>
                      )}
                    </div>
                    
                    {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                      <Link
                        href={`/paiement?bookingId=${booking._id}`}
                        className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Payer maintenant
                      </Link>
                    )}
                    {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                      <Link
                        href={`/bookings/${booking._id}/facture`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-300 rounded-lg"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Facture
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}