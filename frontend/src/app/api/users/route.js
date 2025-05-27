// frontend/src/app/api/users/route.js (VERSION CORRIGÉE)
import { NextResponse } from 'next/server';
import User from '../../../models/User';
import { withAuth } from '../../../lib/middleware';

// GET /api/users - Obtenir tous les utilisateurs (admin uniquement)
export const GET = withAuth(async (req) => {
  const users = await User.find();

  return NextResponse.json({
    success: true,
    count: users.length,
    data: users
  });
}, ['admin']);