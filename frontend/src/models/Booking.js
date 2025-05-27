// frontend/src/models/Booking.js (VERSION MISE À JOUR)
import mongoose from 'mongoose';

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
      formatted_address: String,
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
      formatted_address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    distance: {
      type: Number, // en km
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // en minutes
      required: true,
      min: 20, // minimum 20 minutes
      max: 300, // maximum 5 heures
    },
    handlers: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
    // Détails de tarification
    basePrice: {
      type: Number,
      required: true,
    },
    distancePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    durationPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    handlersPrice: {
      type: Number,
      required: true,
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

// Middleware pour calculer automatiquement les prix avant sauvegarde
BookingSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified(['distance', 'duration', 'handlers', 'vehicleId'])) {
    try {
      // Récupérer le véhicule pour obtenir le prix de base
      const Vehicle = mongoose.model('Vehicle');
      const vehicle = await Vehicle.findById(this.vehicleId);
      
      if (vehicle) {
        this.basePrice = vehicle.basePrice;
        this.distancePrice = this.distance * 0.25; // 25 centimes par km
        this.durationPrice = this.duration <= 20 ? 0 : Math.ceil((this.duration - 20) / 15) * 5; // 5€ par tranche de 15min après les 20 premières minutes
        this.handlersPrice = this.handlers * 25; // 25€ par manutentionnaire
        this.totalPrice = this.basePrice + this.distancePrice + this.durationPrice + this.handlersPrice;
      }
    } catch (error) {
      console.error('Erreur lors du calcul des prix:', error);
    }
  }
  next();
});

// Index pour améliorer les performances des requêtes
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ date: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);