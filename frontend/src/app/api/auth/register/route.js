// frontend/src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import { withoutAuth, APIError } from '../../../../lib/middleware';

const sendTokenResponse = (user, statusCode) => {
  const token = user.getSignedJwtToken();
  
  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  }, { status: statusCode });
};

export const POST = withoutAuth(async (req) => {
  const body = await req.json();
  const { firstName, lastName, email, password, phone, address } = body;

  // Création de l'utilisateur
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
  });

  return sendTokenResponse(user, 201);
});