// Contrôleur de véhicules - à implémenter
const Vehicle = require('../models/Vehicle');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Obtenir tous les véhicules
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({
    success: true,
    count: vehicles.length,
    data: vehicles
  });
});

// @desc    Obtenir un véhicule spécifique
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Véhicule non trouvé avec l'ID ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: vehicle
  });
});

// @desc    Créer un nouveau véhicule
// @route   POST /api/vehicles
// @access  Private/Admin
exports.createVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    data: vehicle
  });
});

// @desc    Mettre à jour un véhicule
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
exports.updateVehicle = asyncHandler(async (req, res, next) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Véhicule non trouvé avec l'ID ${req.params.id}`, 404)
    );
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: vehicle
  });
});

// @desc    Supprimer un véhicule
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
exports.deleteVehicle = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(
      new ErrorResponse(`Véhicule non trouvé avec l'ID ${req.params.id}`, 404)
    );
  }

  await vehicle.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});