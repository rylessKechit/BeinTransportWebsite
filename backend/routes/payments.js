const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  webhook
} = require('../controllers/payments');
const { protect } = require('../middleware/auth');

// Route pour le webhook Stripe (pas de protection)
router.post('/webhook', webhook);

// Routes protégées
router.post('/create-intent/:bookingId', protect, createPaymentIntent);
router.post('/confirm/:bookingId', protect, confirmPayment);

module.exports = router;
