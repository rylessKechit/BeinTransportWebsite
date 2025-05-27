// frontend/src/lib/middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dbConnect from './db';

// Classe d'erreur personnalisée
export class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

// Wrapper pour gérer les erreurs async
export const asyncHandler = (fn) => async (req, res) => {
  try {
    await dbConnect();
    return await fn(req, res);
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof APIError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    
    // Erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message
      });
    }
    
    // Erreur de duplication (email déjà utilisé)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field} déjà utilisé`;
      return res.status(400).json({
        success: false,
        message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur interne'
    });
  }
};

// Middleware de protection des routes
export const protect = async (req, res, next) => {
  let token;

  // Récupérer le token depuis Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier que le token existe
  if (!token) {
    throw new APIError('Non autorisé à accéder à cette route', 401);
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new APIError('Utilisateur introuvable', 404);
    }

    req.user = user;
    
    if (next) {
      return next();
    }
    return user;
  } catch (err) {
    if (err instanceof APIError) {
      throw err;
    }
    throw new APIError('Non autorisé à accéder à cette route', 401);
  }
};

// Middleware d'autorisation par rôle
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new APIError(
        `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`,
        403
      );
    }
    if (next) {
      return next();
    }
  };
};

// Helper pour vérifier l'authentification dans les API routes
export const withAuth = (handler, requiredRoles = []) => {
  return asyncHandler(async (req, res) => {
    // Vérifier l'authentification
    await protect(req, res);
    
    // Vérifier les rôles si spécifiés
    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
      throw new APIError(
        `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`,
        403
      );
    }
    
    return handler(req, res);
  });
};

// Helper pour les routes publiques
export const withoutAuth = (handler) => {
  return asyncHandler(handler);
};