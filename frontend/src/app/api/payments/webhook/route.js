import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Booking from '../../../../models/Booking';
import { withoutAuth } from '../../../../lib/middleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/webhook - Webhook Stripe pour les événements de paiement
export const POST = withoutAuth(async (req) => {
  const body = await req.text(); // Récupérer le body en tant que texte pour Stripe
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    // Vérifier la signature de l'événement
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Traiter l'événement
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Trouver la réservation correspondante
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (bookingId) {
      const booking = await Booking.findById(bookingId);

      if (booking) {
        // Mettre à jour la réservation
        booking.paymentStatus = 'paid';
        booking.paymentId = paymentIntent.id;
        booking.status = 'confirmed';
        await booking.save();
        
        console.log(`✅ Paiement confirmé pour la réservation ${bookingId}`);
      } else {
        console.error(`❌ Réservation non trouvée: ${bookingId}`);
      }
    }
  }

  return NextResponse.json({ received: true });
});