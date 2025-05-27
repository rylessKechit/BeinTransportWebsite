// frontend/src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import User from '../../../../models/Users';
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
  const { email, password } = body;

  // Validation des champs email et password
  if (!email || !password) {
    throw new APIError('Veuillez fournir un email et un mot de passe', 400);
  }

  // Vérification de l'utilisateur
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new APIError('Identifiants invalides', 401);
  }

  // Vérification du mot de passe
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new APIError('Identifiants invalides', 401);
  }

  return sendTokenResponse(user, 200);
});