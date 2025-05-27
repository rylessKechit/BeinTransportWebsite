// frontend/src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { withAuth } from '../../../../lib/middleware';

export const GET = withAuth(async (req) => {
  return NextResponse.json({
    success: true,
    data: req.user,
  });
});