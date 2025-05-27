// frontend/src/app/paiement/PaymentContent.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, AlertCircle, ArrowLeft, Loader } from 'lucide-react';
import { bookingService, paymentService } from '../../lib/api';

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

// Styles pour CardElement
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Composant de formulaire de paiement
function PaymentForm({ booking, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Créer l'intent de paiement au chargement
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await paymentService.createPaymentIntent(booking._id);
        if (response.success) {
          setClientSecret(response.clientSecret);
        } else {
          onError('Erreur lors de la création de l\'intent de paiement');
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'intent:', error);
        onError('Erreur lors de la préparation du paiement');
      }
    };

    if (booking && booking._id) {
      createPaymentIntent();
    }
  }, [booking, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    // Confirmer le paiement
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${booking.userId?.firstName} ${booking.userId?.lastName}`,
          email: booking.userId?.email,
        },
      },
    });

    if (error) {
      console.error('Erreur de paiement:', error);
      onError(error.message || 'Une erreur est survenue lors du paiement');
    } else if (paymentIntent.status === 'succeeded') {
      // Confirmer le paiement côté serveur
      try {
        const confirmResponse = await paymentService.confirmPayment(
          booking._id, 
          paymentIntent.id
        );
        
        if (confirmResponse.success) {
          onSuccess();
        } else {
          onError('Erreur lors de la confirmation du paiement');
        }
      } catch (confirmError) {
        console.error('Erreur lors de la confirmation:', confirmError);
        onError('Paiement effectué mais erreur de confirmation');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Informations de carte de crédit
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Vos informations de paiement sont sécurisées et cryptées.
        </p>
      </div>

      {/* Informations de test */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Mode test - Utilisez ces numéros :</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Visa :</strong> 4242 4242 4242 4242</p>
          <p><strong>Mastercard :</strong> 5555 5555 5555 4444</p>
          <p><strong>Date :</strong> N'importe quelle date future</p>
          <p><strong>CVC :</strong> N'importe quel code à 3 chiffres</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Payer {booking.totalPrice} €
          </>
        )}
      </button>
    </form>
  );
}

export default function PaymentContent() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  // Récupérer les détails de la réservation
  useEffect(() => {
    if (!bookingId) {
      router.push('/dashboard');
      return;
    }
    
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getById(bookingId);
        
        if (response.success) {
          setBooking(response.data);
          
          // Vérifier si la réservation a déjà été payée
          if (response.data.paymentStatus === 'paid') {
            setPaymentSuccess(true);
          }
        } else {
          setPaymentError('Réservation non trouvée');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setPaymentError('Une erreur est survenue lors du chargement des informations de paiement.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [bookingId, router]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setPaymentError(null);
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setPaymentSuccess(false);
  };
  
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4">Chargement des informations de paiement...</p>
            </div>
          ) : paymentError ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center text-purple-600 mb-4">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Erreur de paiement</h2>
              <p className="text-center text-gray-600 mb-6">{paymentError}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg"
                >
                  Réessayer
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-6 rounded-lg"
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
              <h2 className="text-xl font-semibold text-center mb-2">Paiement réussi !</h2>
              <p className="text-center text-gray-600 mb-6">
                Votre réservation a été confirmée et payée avec succès. Vous recevrez prochainement un email de confirmation avec tous les détails.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg"
                >
                  Voir mes réservations
                </button>
                <button
                  onClick={() => router.push(`/bookings/${booking?._id}`)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-6 rounded-lg"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ) : booking ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Résumé de la réservation */}
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <h2 className="font-semibold">Résumé de la réservation</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">
                      {booking.bookingType === 'demenagement' ? 'Déménagement' : 
                       booking.bookingType === 'livraison' ? 'Livraison' : 'Transport'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Véhicule</span>
                    <span className="font-medium">
                      {booking.vehicleId?.name || 'Véhicule sélectionné'}
                      {booking.vehicleId?.capacity && ` (${booking.vehicleId.capacity}m³)`}
                    </span>
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

                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Adresses</span>
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        {booking.pickupAddress?.city} → {booking.deliveryAddress?.city}
                      </div>
                    </div>
                  </div>

                  {booking.handlers > 0 && (
                    <div className="flex justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Manutentionnaires</span>
                      <span className="font-medium">{booking.handlers}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2 text-lg font-semibold">
                    <span>Total</span>
                    <span>{booking.totalPrice} €</span>
                  </div>
                </div>

                {/* Formulaire de paiement Stripe */}
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    booking={booking}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Paiement sécurisé par Stripe • Vos données sont protégées
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}