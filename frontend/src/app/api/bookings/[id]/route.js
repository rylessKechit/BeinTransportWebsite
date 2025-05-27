// frontend/src/app/api/bookings/[id]/route.js
import { NextResponse } from 'next/server';
import Booking from '../../../../models/Booking';
import { withAuth, APIError } from '../../../../lib/middleware';

// GET /api/bookings/[id] - Obtenir une réservation spécifique
export const GET = withAuth(async (req, { params }) => {
  const { id } = params;
  const booking = await Booking.findById(id).populate('userId vehicleId');

  if (!booking) {
    throw new APIError(`Réservation non trouvée avec l'ID ${id}`, 404);
  }

  // Vérifier si l'utilisateur est autorisé à voir cette réservation
  if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new APIError(`Utilisateur non autorisé à accéder à cette réservation`, 403);
  }

  return NextResponse.json({
    success: true,
    data: booking,
  });
});

// PUT /api/bookings/[id] - Mettre à jour une réservation
export const PUT = withAuth(async (req, { params }) => {
  const { id } = params;
  const body = await req.json();
  
  let booking = await Booking.findById(id);

  if (!booking) {
    throw new APIError(`Réservation non trouvée avec l'ID ${id}`, 404);
  }

  // Vérifier si l'utilisateur est autorisé à modifier cette réservation
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new APIError(`Utilisateur non autorisé à modifier cette réservation`, 403);
  }

  // Ne pas permettre de modifier certains champs une fois la réservation confirmée
  if (booking.status !== 'pending' && req.user.role !== 'admin') {
    throw new APIError(`Impossible de modifier une réservation ${booking.status}`, 400);
  }

  booking = await Booking.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  return NextResponse.json({
    success: true,
    data: booking,
  });
});