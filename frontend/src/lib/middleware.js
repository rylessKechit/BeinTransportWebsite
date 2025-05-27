// frontend/src/lib/middleware.js (VERSION CORRIGÉE)
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
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

// Wrapper pour gérer les erreurs async dans Next.js App Router
export const asyncHandler = (fn) => async (req, context) => {
  try {
    await dbConnect();
    return await fn(req, context);
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: error.statusCode });
    }
    
    // Erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return NextResponse.json({
        success: false,
        message
      }, { status: 400 });
    }
    
    // Erreur de duplication (email déjà utilisé)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field} déjà utilisé`;
      return NextResponse.json({
        success: false,
        message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur interne'
    }, { status: 500 });
  }
};

// Middleware de protection des routes
export const protect = async (req) => {
  let token;

  // Récupérer le token depuis Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
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
  return (req) => {
    if (!req.user) {
      throw new APIError('Utilisateur non authentifié', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      throw new APIError(
        `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`,
        403
      );
    }
  };
};

// Helper pour vérifier l'authentification dans les API routes
export const withAuth = (handler, requiredRoles = []) => {
  return asyncHandler(async (req, context) => {
    // Vérifier l'authentification
    await protect(req);
    
    // Vérifier les rôles si spécifiés
    if (requiredRoles.length > 0) {
      authorize(...requiredRoles)(req);
    }
    
    return handler(req, context);
  });
};

// Helper pour les routes publiques
export const withoutAuth = (handler) => {
  return asyncHandler(handler);
};