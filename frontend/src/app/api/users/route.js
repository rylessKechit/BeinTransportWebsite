
// frontend/src/app/api/users/route.js
import { NextResponse } from 'next/server';
import User from '../../../models/Users';
import { withAuth, APIError } from '../../../lib/middleware';

// GET /api/users - Obtenir tous les utilisateurs (admin uniquement)
export const GET = withAuth(async (req) => {
  const users = await User.find();

  return NextResponse.json({
    success: true,
    count: users.length,
    data: users
  });
}, ['admin']);