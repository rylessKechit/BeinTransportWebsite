// frontend/src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { withAuth, APIError } from '../../../../lib/middleware';

// GET /api/users/[id] - Obtenir un utilisateur spécifique (admin uniquement)
export const GET = withAuth(async (req, { params }) => {
  const { id } = params;
  const user = await User.findById(id);

  if (!user) {
    throw new APIError(`Utilisateur non trouvé avec l'ID ${id}`, 404);
  }

  return NextResponse.json({
    success: true,
    data: user
  });
}, ['admin']);

// PUT /api/users/[id] - Mettre à jour un utilisateur (admin uniquement)
export const PUT = withAuth(async (req, { params }) => {
  const { id } = params;
  const body = await req.json();
  
  let user = await User.findById(id);

  if (!user) {
    throw new APIError(`Utilisateur non trouvé avec l'ID ${id}`, 404);
  }

  // Ne pas permettre la mise à jour du mot de passe via cette route
  if (body.password) {
    delete body.password;
  }

  user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  return NextResponse.json({
    success: true,
    data: user
  });
}, ['admin']);

// DELETE /api/users/[id] - Supprimer un utilisateur (admin uniquement)
export const DELETE = withAuth(async (req, { params }) => {
  const { id } = params;
  
  const user = await User.findById(id);

  if (!user) {
    throw new APIError(`Utilisateur non trouvé avec l'ID ${id}`, 404);
  }

  await user.deleteOne();

  return NextResponse.json({
    success: true,
    data: {}
  });
}, ['admin']);