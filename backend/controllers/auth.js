// Contrôleur d'authentification - à implémenter
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, address } = req.body;

  // Création de l'utilisateur
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation des champs email et password
  if (!email || !password) {
    return next(new ErrorResponse('Veuillez fournir un email et un mot de passe', 400));
  }

  // Vérification de l'utilisateur
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Identifiants invalides', 401));
  }

  // Vérification du mot de passe
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Identifiants invalides', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Déconnexion
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Obtenir l'utilisateur actuel
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Fonction utilitaire pour envoyer le token dans la réponse
const sendTokenResponse = (user, statusCode, res) => {
  // Création du token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};