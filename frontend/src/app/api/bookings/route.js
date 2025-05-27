// frontend/src/app/api/bookings/route.js (VERSION CORRIGÉE)
import { NextResponse } from 'next/server';
import Booking from '../../../models/Booking';
import Vehicle from '../../../models/Vehicle';
import { withAuth, withoutAuth, APIError } from '../../../lib/middleware';

// GET /api/bookings - Obtenir toutes les réservations
export const GET = withAuth(async (req) => {
  let query;

  if (req.user.role === 'admin') {
    // Pour les admins : toutes les réservations
    query = Booking.find().populate('userId vehicleId');
  } else {
    // Pour les clients : seulement leurs réservations
    query = Booking.find({ userId: req.user.id }).populate('vehicleId');
  }

  const bookings = await query;

  return NextResponse.json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// POST /api/bookings - Créer une nouvelle réservation
export const POST = withAuth(async (req) => {
  const body = await req.json();
  
  // Ajouter l'ID de l'utilisateur à la requête
  body.userId = req.user.id;

  // Vérifier que le véhicule existe
  const vehicle = await Vehicle.findById(body.vehicleId);

  if (!vehicle) {
    throw new APIError(`Véhicule non trouvé avec l'ID ${body.vehicleId}`, 404);
  }

  // Créer la réservation
  const booking = await Booking.create(body);

  return NextResponse.json({
    success: true,
    data: booking,
  }, { status: 201 });
});