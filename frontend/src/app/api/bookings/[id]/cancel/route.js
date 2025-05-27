// frontend/src/app/api/bookings/[id]/cancel/route.js (VERSION CORRIGÉE)
import { NextResponse } from 'next/server';
import Booking from '../../../../../models/Booking';
import { withAuth, APIError } from '../../../../../lib/middleware';

// PUT /api/bookings/[id]/cancel - Annuler une réservation
export const PUT = withAuth(async (req, { params }) => {
  const { id } = params;
  
  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      throw new APIError(`Réservation non trouvée avec l'ID ${id}`, 404);
    }

    // Vérifier si l'utilisateur est autorisé à annuler cette réservation
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new APIError(`Utilisateur non autorisé à annuler cette réservation`, 403);
    }

    // Vérifier si la réservation peut être annulée
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new APIError(`Impossible d'annuler une réservation ${booking.status}`, 400);
    }

    booking.status = 'cancelled';
    await booking.save();

    // Repopuler les données pour la réponse
    await booking.populate('userId', 'firstName lastName email phone');
    await booking.populate('vehicleId', 'name capacity basePrice pricePerKm description');

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Erreur lors de l\'annulation de la réservation', 500);
  }
});