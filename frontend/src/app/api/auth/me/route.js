// frontend/src/app/api/auth/me/route.js (VERSION CORRIGÉE)
import { NextResponse } from 'next/server';
import { withAuth } from '../../../../lib/middleware';

export const GET = withAuth(async (req) => {
  return NextResponse.json({
    success: true,
    data: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address
    },
  });
});