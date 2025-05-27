// frontend/src/app/api/vehicles/route.js
import { NextResponse } from 'next/server';
import Vehicle from '../../../models/Vehicle';
import { withoutAuth, withAuth, APIError } from '../../../lib/middleware';

// GET /api/vehicles - Obtenir tous les véhicules (public)
export const GET = withoutAuth(async () => {
  const vehicles = await Vehicle.find();

  return NextResponse.json({
    success: true,
    count: vehicles.length,
    data: vehicles
  });
});

// POST /api/vehicles - Créer un nouveau véhicule (admin uniquement)
export const POST = withAuth(async (req) => {
  // Vérifier que l'utilisateur est admin
  if (req.user.role !== 'admin') {
    throw new APIError('Accès non autorisé', 403);
  }

  const body = await req.json();
  const vehicle = await Vehicle.create(body);

  return NextResponse.json({
    success: true,
    data: vehicle
  }, { status: 201 });
}, ['admin']);