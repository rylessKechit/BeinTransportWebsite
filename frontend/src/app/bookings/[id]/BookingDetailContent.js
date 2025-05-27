// frontend/src/app/bookings/[id]/BookingDetailContent.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Truck, Phone, User, FileText,
  CheckCircle, XCircle, CreditCard, ArrowLeft, Loader, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { bookingService } from '../../../lib/api';
import { 
  formatDate, formatCurrency, getServiceTypeName, 
  getBookingStatusLabel, getStatusBadgeClasses 
} from '../../../lib/utils';

export default function BookingDetailContent() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const bookingId = params.id;
  
  // Récupérer les détails de la réservation
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        router.push('/bookings');
        return;
      }
      
      try {
        setLoading(true);
        const response = await bookingService.getById(bookingId);
        
        if (response.success) {
          setBooking(response.data);
        } else {
          setError('Erreur lors du chargement de la réservation');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la réservation:', err);
        setError('Une erreur est survenue lors du chargement de la réservation');
      } finally {
        setLoading(false);
      }
    };
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      router.push('/auth/login?redirect=/bookings/' + bookingId);
      return;
    }
    
    fetchBooking();
  }, [bookingId, router, user]);
  
  // Annuler la réservation
  const handleCancelBooking = async () => {
    if (!booking || !bookingId) return;
    
    // Confirmation avant annulation
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }
    
    try {
      setCancelLoading(true);
      const response = await bookingService.cancel(bookingId);
      
      if (response.success) {
        setCancelSuccess(true);
        // Mettre à jour l'état local de la réservation
        setBooking({
          ...booking,
          status: 'cancelled'
        });
        
        // Rediriger après un délai
        setTimeout(() => {
          router.push('/bookings');
        }, 3000);
      } else {
        setError("Erreur lors de l'annulation de la réservation");
      }
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      setError("Une erreur est survenue lors de l'annulation");
    } finally {
      setCancelLoading(false);
    }
  };
  
  // Vérifier si la réservation peut être annulée
  const canBeCancelled = () => {
    if (!booking) return false;
    return ['pending', 'confirmed'].includes(booking.status) && 
           booking.status !== 'cancelled' &&
           new Date(booking.date) > new Date();
  };
  
  // Vérifier si la réservation a besoin d'être payée
  const needsPayment = () => {
    if (!booking) return false;
    return booking.paymentStatus === 'pending' && booking.status !== 'cancelled';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <Loader className="h-8 w-8 text-purple-600 animate-spin" />
        <span className="ml-2">Chargement de la réservation...</span>
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <XCircle className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Réservation non trouvée</h2>
              <p className="text-gray-600 mb-6">
                {error || "La réservation que vous recherchez n'existe pas ou a été supprimée."}
              </p>
              <Link
                href="/bookings"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour à mes réservations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Bouton de retour */}
          <div className="mb-6">
            <Link
              href="/bookings"
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à mes réservations
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Détails de la réservation</h1>
          
          {error && (
            <div className="mb-6 bg-purple-50 border-l-4 border-purple-600 p-4 text-purple-700">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {cancelSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-700 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Votre réservation a été annulée avec succès. Vous allez être redirigé...
            </div>
          )}
          
          {/* Détails de la réservation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* En-tête avec statut */}
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {getServiceTypeName(booking.bookingType)}
                      </h2>
                      <p className="text-gray-600">
                        Réservation #{booking._id?.substring(booking._id.length - 8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`${getStatusBadgeClasses(booking.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {getBookingStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Créneau horaire</p>
                        <p className="font-medium">{booking.timeSlot}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Véhicule</p>
                        <p className="font-medium">
                          {booking.vehicleId?.name || 'Véhicule'} 
                          {booking.vehicleId?.capacity && ` (${booking.vehicleId.capacity}m³)`}
                        </p>
                      </div>
                    </div>
                    
                    {booking.handlers > 0 && (
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Manutentionnaires</p>
                          <p className="font-medium">{booking.handlers}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Adresses */}
                  <div className="space-y-6 mb-8">
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <MapPin className="h-5 w-5 text-green-600 mr-2" />
                        Adresse de départ
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{booking.pickupAddress.street}</p>
                        <p className="text-gray-600">
                          {booking.pickupAddress.postalCode} {booking.pickupAddress.city}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3 flex items-center">
                        <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                        Adresse d'arrivée
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{booking.deliveryAddress.street}</p>
                        <p className="text-gray-600">
                          {booking.deliveryAddress.postalCode} {booking.deliveryAddress.city}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes supplémentaires */}
                  {booking.notes && (
                    <div className="mb-8">
                      <h3 className="font-medium mb-3">
                        Notes supplémentaires
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{booking.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Récapitulatif des prix */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium mb-4">Récapitulatif des prix</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix de base</span>
                        <span>{formatCurrency(booking.vehicleId?.basePrice || 0)}</span>
                      </div>
                      {booking.handlers > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Manutentionnaires ({booking.handlers} × 25€)
                          </span>
                          <span>{formatCurrency(booking.handlers * 25)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance estimée</span>
                        <span>Incluse</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(booking.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar avec actions */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Actions</h3>
                  
                  {needsPayment() && (
                    <Link
                      href={`/paiement?bookingId=${booking._id}`}
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg transition-colors mb-3"
                    >
                      <div className="flex items-center justify-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Procéder au paiement
                      </div>
                    </Link>
                  )}
                  
                  {canBeCancelled() && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelLoading}
                      className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 rounded-lg transition-colors mb-3"
                    >
                      <div className="flex items-center justify-center">
                        {cancelLoading ? (
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5 mr-2" />
                        )}
                        Annuler cette réservation
                      </div>
                    </button>
                  )}
                  
                  {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
                    <button
                      className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 rounded-lg transition-colors mb-3"
                    >
                      <div className="flex items-center justify-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Télécharger la facture
                      </div>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Statut du paiement */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Paiement</h3>
                  <div className="flex items-center">
                    {booking.paymentStatus === 'paid' ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-600 font-medium">Payé</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-600 font-medium">En attente de paiement</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Coordonnées de contact */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Contact</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <a 
                          href="tel:0123456789" 
                          className="text-gray-800 hover:text-purple-600"
                        >
                          01 23 45 67 89
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Service client</p>
                        <p className="text-gray-800">
                          Lun-Ven: 9h-18h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}