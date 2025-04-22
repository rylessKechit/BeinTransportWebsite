// Contrôleur de réservations - à implémenter
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Créer une nouvelle réservation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Ajouter l'ID de l'utilisateur à la requête
  req.body.userId = req.user.id;

  // Vérifier que le véhicule existe
  const vehicle = await Vehicle.findById(req.body.vehicleId);

  if (!vehicle) {
    return next(new ErrorResponse(`Véhicule non trouvé avec l'ID ${req.body.vehicleId}`, 404));
  }

  // Créer la réservation
  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc    Obtenir toutes les réservations
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  // Pour les admins : toutes les réservations
  // Pour les clients : seulement leurs réservations
  let query;

  if (req.user.role === 'admin') {
    query = Booking.find().populate('userId vehicleId');
  } else {
    query = Booking.find({ userId: req.user.id }).populate('vehicleId');
  }

  const bookings = await query;

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Obtenir une réservation spécifique
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate('userId vehicleId');

  if (!booking) {
    return next(new ErrorResponse(`Réservation non trouvée avec l'ID ${req.params.id}`, 404));
  }

  // Vérifier si l'utilisateur est autorisé à voir cette réservation
  if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Utilisateur non autorisé à accéder à cette réservation`, 403));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Mettre à jour une réservation
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Réservation non trouvée avec l'ID ${req.params.id}`, 404));
  }

  // Vérifier si l'utilisateur est autorisé à modifier cette réservation
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Utilisateur non autorisé à modifier cette réservation`, 403));
  }

  // Ne pas permettre de modifier certains champs une fois la réservation confirmée
  if (booking.status !== 'pending' && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Impossible de modifier une réservation ${booking.status}`, 400));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Annuler une réservation
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Réservation non trouvée avec l'ID ${req.params.id}`, 404));
  }

  // Vérifier si l'utilisateur est autorisé à annuler cette réservation
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Utilisateur non autorisé à annuler cette réservation`, 403));
  }

  // Vérifier si la réservation peut être annulée
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return next(new ErrorResponse(`Impossible d'annuler une réservation ${booking.status}`, 400));
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    success: true,
    data: booking,
  });
});