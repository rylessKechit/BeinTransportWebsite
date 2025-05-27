import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Booking from '../../../../../models/Booking';
import { withAuth, APIError } from '../../../../../lib/middleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-intent/[bookingId] - Créer un intent de paiement Stripe
export const POST = withAuth(async (req, { params }) => {
  const { bookingId } = params;
  
  // Récupérer la réservation
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new APIError(`Réservation non trouvée avec l'ID ${bookingId}`, 404);
  }

  // Vérifier que l'utilisateur est propriétaire de la réservation
  if (booking.userId.toString() !== req.user.id) {
    throw new APIError(`Utilisateur non autorisé à payer cette réservation`, 403);
  }

  // Vérifier que la réservation n'a pas déjà été payée
  if (booking.paymentStatus === 'paid') {
    throw new APIError(`Cette réservation a déjà été payée`, 400);
  }

  // Créer un intent de paiement
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100), // Conversion en centimes
    currency: 'eur',
    description: `Réservation #${booking._id} - ${booking.bookingType}`,
    metadata: {
      bookingId: booking._id.toString(),
      userId: req.user.id,
      vehicleId: booking.vehicleId.toString()
    }
  });

  return NextResponse.json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});