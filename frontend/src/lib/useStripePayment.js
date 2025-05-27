// frontend/src/hooks/useStripePayment.js
'use client';

import { useState, useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { paymentService } from '../lib/api';

export default function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const processPayment = useCallback(async (booking, billingDetails = {}) => {
    if (!stripe || !elements) {
      setError('Stripe n\'est pas encore chargé');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Créer l'intent de paiement
      const intentResponse = await paymentService.createPaymentIntent(booking._id);
      
      if (!intentResponse.success) {
        throw new Error(intentResponse.message || 'Erreur lors de la création de l\'intent de paiement');
      }

      const { clientSecret } = intentResponse;
      const cardElement = elements.getElement(CardElement);

      // 2. Confirmer le paiement avec Stripe
      const { error: stripeError, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name || `${booking.userId?.firstName} ${booking.userId?.lastName}`,
            email: billingDetails.email || booking.userId?.email,
            address: billingDetails.address || {}
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (confirmedPaymentIntent.status !== 'succeeded') {
        throw new Error('Le paiement n\'a pas abouti');
      }

      // 3. Confirmer le paiement côté serveur
      const confirmResponse = await paymentService.confirmPayment(
        booking._id,
        confirmedPaymentIntent.id
      );

      if (!confirmResponse.success) {
        throw new Error('Erreur lors de la confirmation du paiement côté serveur');
      }

      setPaymentIntent(confirmedPaymentIntent);
      return { 
        success: true, 
        paymentIntent: confirmedPaymentIntent,
        booking: confirmResponse.data 
      };

    } catch (err) {
      const errorMessage = err.message || 'Une erreur inattendue est survenue';
      setError(errorMessage);
      console.error('Erreur de paiement:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [stripe, elements]);

  const resetPayment = useCallback(() => {
    setError(null);
    setPaymentIntent(null);
    setLoading(false);
  }, []);

  return {
    processPayment,
    resetPayment,
    loading,
    error,
    paymentIntent,
    isStripeReady: !!(stripe && elements)
  };
}