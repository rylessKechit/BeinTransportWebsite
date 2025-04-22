const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir un nom de véhicule'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Veuillez fournir la capacité du véhicule en m³'],
    },
    imageUrl: {
      type: String,
      default: '/images/default-vehicle.jpg',
    },
    description: {
      type: String,
      required: [true, 'Veuillez fournir une description du véhicule'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Veuillez fournir un prix de base'],
    },
    pricePerKm: {
      type: Number,
      required: [true, 'Veuillez fournir un prix par km'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    dimensions: {
      length: Number, // en cm
      width: Number,  // en cm
      height: Number, // en cm
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
