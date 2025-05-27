// frontend/src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { withoutAuth } from '../../../../lib/middleware';

export const GET = withoutAuth(async () => {
  return NextResponse.json({
    success: true,
    data: {},
  });
});