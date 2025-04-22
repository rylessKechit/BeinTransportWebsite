'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { paymentService, bookingService } from '../../lib/api';

// Assurez-vous que cette clé publique correspond à votre clé de test Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_votreclépublique');

export default function PaymentPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  // Récupérer les détails de la réservation et initialiser le paiement
  useEffect(() => {
    if (!bookingId) {
      router.push('/dashboard');
      return;
    }
    
    const fetchBookingAndInitPayment = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails de la réservation
        const bookingResponse = await bookingService.getById(bookingId);
        if (!bookingResponse.success) {
          throw new Error('Réservation non trouvée');
        }
        
        setBooking(bookingResponse.data);
        
        // Créer un intent de paiement
        const paymentResponse = await paymentService.createPaymentIntent(bookingId);
        if (!paymentResponse.success) {
          throw new Error('Erreur lors de la création de l\'intent de paiement');
        }
        
        setClientSecret(paymentResponse.clientSecret);
      } catch (error) {
        console.error('Erreur:', error);
        setPaymentError('Une erreur est survenue lors du chargement des informations de paiement.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingAndInitPayment();
  }, [bookingId, router]);
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Paiement</h1>
          <p className="text-gray-600 mb-8">Finalisez votre réservation en complétant le paiement</p>
          
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4">Chargement des informations de paiement...</p>
            </div>
          ) : paymentError ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center text-red-600 mb-4">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Erreur de paiement</h2>
              <p className="text-center text-gray-600 mb-6">{paymentError}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg"
                >
                  Retour au tableau de bord
                </button>
              </div>
            </div>
          ) : paymentSuccess ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Paiement réussi</h2>
              <p className="text-center text-gray-600 mb-6">
                Votre réservation a été confirmée. Vous recevrez prochainement un email de confirmation.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg"
                >
                  Voir mes réservations
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h2 className="font-semibold">Résumé de la réservation</h2>
              </div>
              
              {booking && (
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">{booking.bookingType === 'demenagement' ? 'Déménagement' : booking.bookingType === 'livraison' ? 'Livraison' : 'Transport'}</span>
                    </div>
                    
                    <div className="flex justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Véhicule</span>
                      <span className="font-medium">{booking.vehicle ? booking.vehicle.name : 'Véhicule sélectionné'}</span>
                    </div>
                    
                    <div className="flex justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Date et heure</span>
                      <span className="font-medium">
                        {new Date(booking.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })} • {booking.timeSlot}
                      </span>
                    </div>
                    
                    <div className="flex justify-between pt-2 text-lg font-semibold">
                      <span>Total</span>
                      <span>{booking.totalPrice} €</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600">
                      Ce paiement est sécurisé par Stripe. Vos informations de paiement sont cryptées et ne sont jamais stockées sur nos serveurs.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      Informations de paiement
                    </h3>
                    
                    <div className="border border-gray-300 rounded-lg p-4">
                      <p className="text-center text-gray-500 mb-4">
                        Pour simuler un paiement en environnement de test, utilisez le numéro de carte 4242 4242 4242 4242
                      </p>
                      
                      <div className="mb-4">
                        {/* Emplacement pour Stripe Elements */}
                        <div className="border border-gray-300 rounded p-3 bg-white">
                          <p className="text-gray-500 text-center">Formulaire de carte de crédit (sera remplacé par Stripe Elements)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
                    onClick={() => {
                      // Simuler un paiement réussi pour le test
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        setPaymentSuccess(true);
                      }, 2000);
                    }}
                  >
                    Payer {booking.totalPrice} €
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}