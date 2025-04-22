// Contrôleur de paiements - à implémenter
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Créer un intent de paiement Stripe
// @route   POST /api/payments/create-intent/:bookingId
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  // Récupérer la réservation
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(
      new ErrorResponse(`Réservation non trouvée avec l'ID ${req.params.bookingId}`, 404)
    );
  }

  // Vérifier que l'utilisateur est propriétaire de la réservation
  if (booking.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Utilisateur non autorisé à payer cette réservation`, 403)
    );
  }

  // Vérifier que la réservation n'a pas déjà été payée
  if (booking.paymentStatus === 'paid') {
    return next(
      new ErrorResponse(`Cette réservation a déjà été payée`, 400)
    );
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

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Confirmer un paiement
// @route   POST /api/payments/confirm/:bookingId
// @access  Private
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return next(
      new ErrorResponse('ID de paiement manquant', 400)
    );
  }

  // Récupérer la réservation
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(
      new ErrorResponse(`Réservation non trouvée avec l'ID ${req.params.bookingId}`, 404)
    );
  }

  // Vérifier que l'utilisateur est propriétaire de la réservation
  if (booking.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Utilisateur non autorisé à confirmer ce paiement`, 403)
    );
  }

  // Vérifier le statut du paiement
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return next(
      new ErrorResponse(`Le paiement n'a pas été effectué`, 400)
    );
  }

  // Mettre à jour la réservation
  booking.paymentStatus = 'paid';
  booking.paymentId = paymentIntentId;
  booking.status = 'confirmed';
  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Webhook Stripe pour les événements de paiement
// @route   POST /api/payments/webhook
// @access  Public
exports.webhook = asyncHandler(async (req, res, next) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Vérifier la signature de l'événement
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Traiter l'événement
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Trouver la réservation correspondante
    const bookingId = paymentIntent.metadata.bookingId;
    const booking = await Booking.findById(bookingId);

    if (booking) {
      // Mettre à jour la réservation
      booking.paymentStatus = 'paid';
      booking.paymentId = paymentIntent.id;
      booking.status = 'confirmed';
      await booking.save();
    }
  }

  res.status(200).json({ received: true });
});