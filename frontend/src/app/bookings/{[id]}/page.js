'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Truck, Phone, User, FileText,
  CheckCircle, XCircle, CreditCard, ArrowLeft, Loader
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { bookingService } from '../../../lib/api';
import { BookingSummary } from '../../../components/booking/booking-summary';
import { formatDate, formatCurrency } from '../../../lib/utils';

export default function BookingDetailPage() {
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
          router.push('/bookings');
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
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <XCircle className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Réservation non trouvée</h2>
              <p className="text-gray-600 mb-6">
                La réservation que vous recherchez n'existe pas ou a été supprimée.
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
              {error}
            </div>
          )}
          
          {cancelSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-700 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Votre réservation a été annulée avec succès. Vous allez être redirigé...
            </div>
          )}
          
          {/* Résumé de la réservation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <BookingSummary 
                booking={booking} 
                onCancel={handleCancelBooking}
                showActions={true}
              />
            </div>
            
            <div className="space-y-6">
              {/* Statut de la réservation */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Actions</h3>
                  
                  {needsPayment() && (
                    <Link
                      href={`/paiement?bookingId=${booking._id}`}
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg transition-colors mb-3"
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
                      className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 rounded-lg transition-colors mb-3"
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
                    <Link
                      href={`/bookings/${booking._id}/facture`}
                      className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 rounded-lg transition-colors mb-3"
                    >
                      <div className="flex items-center justify-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Télécharger la facture
                      </div>
                    </Link>
                  )}
                  
                  {booking.status === 'completed' && !booking.hasReview && (
                    <Link
                      href={`/reviews/add/${booking._id}`}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Laisser un avis
                      </div>
                    </Link>
                  )}
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