// frontend/src/app/api/vehicles/[id]/route.js
import { NextResponse } from 'next/server';
import Vehicle from '../../../../models/Vehicle';
import { withoutAuth, withAuth, APIError } from '../../../../lib/middleware';

// GET /api/vehicles/[id] - Obtenir un véhicule spécifique (public)
export const GET = withoutAuth(async (req, { params }) => {
  const { id } = params;
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new APIError(`Véhicule non trouvé avec l'ID ${id}`, 404);
  }

  return NextResponse.json({
    success: true,
    data: vehicle
  });
});

// PUT /api/vehicles/[id] - Mettre à jour un véhicule (admin uniquement)
export const PUT = withAuth(async (req, { params }) => {
  const { id } = params;
  const body = await req.json();
  
  let vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new APIError(`Véhicule non trouvé avec l'ID ${id}`, 404);
  }

  vehicle = await Vehicle.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  return NextResponse.json({
    success: true,
    data: vehicle
  });
}, ['admin']);

// DELETE /api/vehicles/[id] - Supprimer un véhicule (admin uniquement)
export const DELETE = withAuth(async (req, { params }) => {
  const { id } = params;
  
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new APIError(`Véhicule non trouvé avec l'ID ${id}`, 404);
  }

  await vehicle.deleteOne();

  return NextResponse.json({
    success: true,
    data: {}
  });
}, ['admin']);