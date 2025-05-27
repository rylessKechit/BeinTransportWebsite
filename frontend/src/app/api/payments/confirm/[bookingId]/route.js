import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Booking from '../../../../../models/Booking';
import { withAuth, APIError } from '../../../../../lib/middleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/confirm/[bookingId] - Confirmer un paiement
export const POST = withAuth(async (req, { params }) => {
  const { bookingId } = params;
  const body = await req.json();
  const { paymentIntentId } = body;

  if (!paymentIntentId) {
    throw new APIError('ID de paiement manquant', 400);
  }

  // Récupérer la réservation
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new APIError(`Réservation non trouvée avec l'ID ${bookingId}`, 404);
  }

  // Vérifier que l'utilisateur est propriétaire de la réservation
  if (booking.userId.toString() !== req.user.id) {
    throw new APIError(`Utilisateur non autorisé à confirmer ce paiement`, 403);
  }

  // Vérifier le statut du paiement
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new APIError(`Le paiement n'a pas été effectué`, 400);
  }

  // Mettre à jour la réservation
  booking.paymentStatus = 'paid';
  booking.paymentId = paymentIntentId;
  booking.status = 'confirmed';
  await booking.save();

  return NextResponse.json({
    success: true,
    data: booking
  });
});