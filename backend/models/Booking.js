const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    bookingType: {
      type: String,
      enum: ['demenagement', 'livraison', 'transport'],
      required: true,
    },
    pickupAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'France' },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'France' },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    distance: {
      type: Number, // en km
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // en heures, estimé
    },
    handlers: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentId: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
