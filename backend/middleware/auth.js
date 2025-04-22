const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protéger les routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token du header Authorization
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Si pas dans Authorization, vérifier les cookies
    token = req.cookies.token;
  }

  // Vérifier que le token existe
  if (!token) {
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('Utilisateur introuvable', 404));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Non autorisé à accéder à cette route', 401));
  }
});

// Vérifier les rôles utilisateur
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`,
          403
        )
      );
    }
    next();
  };
};
