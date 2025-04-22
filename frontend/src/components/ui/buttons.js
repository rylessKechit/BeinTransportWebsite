'use client';

import Link from 'next/link';
import { Loader, ArrowRight, ArrowLeft, XCircle } from 'lucide-react';

// Bouton principal
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'right',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  // Styles de base pour tous les boutons
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors";
  
  // Styles spécifiques aux variantes
  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    outline: "bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50",
    text: "bg-transparent text-purple-600 hover:text-purple-700 hover:underline",
    danger: "bg-purple-600 hover:bg-purple-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };
  
  // Styles spécifiques aux tailles
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
    xl: "text-lg px-8 py-4",
  };
  
  // Styles pour l'état désactivé
  const disabledStyles = disabled || loading ? "opacity-60 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader className="h-4 w-4 animate-spin mr-2" />}
      {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && !loading && <span className="ml-2">{icon}</span>}
    </button>
  );
}

// Lien stylisé comme un bouton
export function ButtonLink({ 
  children, 
  href, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'right',
  className = '',
  ...props 
}) {
  // Styles de base pour tous les boutons
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors";
  
  // Styles spécifiques aux variantes
  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    outline: "bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50",
    text: "bg-transparent text-purple-600 hover:text-purple-700 hover:underline",
    danger: "bg-purple-600 hover:bg-purple-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };
  
  // Styles spécifiques aux tailles
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
    xl: "text-lg px-8 py-4",
  };
  
  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </Link>
  );
}

// Bouton avec icône (sans texte)
export function IconButton({ 
  icon, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  loading = false,
  disabled = false,
  ...props 
}) {
  // Styles de base pour tous les boutons
  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-colors";
  
  // Styles spécifiques aux variantes
  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    outline: "bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50",
    text: "bg-transparent text-purple-600 hover:text-purple-700",
    danger: "bg-purple-600 hover:bg-purple-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };
  
  // Styles spécifiques aux tailles
  const sizeStyles = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
    xl: "p-4",
  };
  
  // Styles pour l'état désactivé
  const disabledStyles = disabled || loading ? "opacity-60 cursor-not-allowed" : "";
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader className="h-5 w-5 animate-spin" /> : icon}
    </button>
  );
}

// Lien icône (sans texte)
export function IconLink({ 
  icon, 
  href, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) {
  // Styles de base pour tous les boutons
  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-colors";
  
  // Styles spécifiques aux variantes
  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    outline: "bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50",
    text: "bg-transparent text-purple-600 hover:text-purple-700",
    danger: "bg-purple-600 hover:bg-purple-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };
  
  // Styles spécifiques aux tailles
  const sizeStyles = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
    xl: "p-4",
  };
  
  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
    </Link>
  );
}

// Bouton de navigation suivant/précédent
export function NavigationButton({ 
  children, 
  direction = 'next',
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  // Styles pour le bouton avec direction
  const directionStyles = direction === 'next' 
    ? "text-white bg-purple-600 hover:bg-purple-700" 
    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50";
  
  return (
    <button
      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${directionStyles} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {direction === 'prev' && <ArrowLeft className="h-5 w-5 mr-2" />}
      {children}
      {direction === 'next' && <ArrowRight className="h-5 w-5 ml-2" />}
    </button>
  );
}

// Bouton d'annulation avec confirmation
export function CancelButton({ 
  children = 'Annuler', 
  onCancel,
  confirmMessage = 'Êtes-vous sûr de vouloir annuler ?',
  className = '',
  ...props 
}) {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onCancel();
    }
  };
  
  return (
    <button
      className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors ${className}`}
      onClick={handleClick}
      {...props}
    >
      <XCircle className="h-5 w-5 mr-2" />
      {children}
    </button>
  );
}

// Groupe de boutons
export function ButtonGroup({ children, className = '', ...props }) {
  return (
    <div className={`flex space-x-2 ${className}`} {...props}>
      {children}
    </div>
  );
}