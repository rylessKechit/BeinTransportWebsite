'use client';

import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Truck, Users, CreditCard,
  FileText, CheckCircle, XCircle, FileCheck
} from 'lucide-react';
import { 
  formatDate, formatCurrency, getServiceTypeName, 
  getBookingStatusLabel, getStatusBadgeClasses 
} from '../../lib/utils';

export default function BookingSummary({ booking, onCancel, showActions = true }) {
  if (!booking) return null;

  const isPastBooking = new Date(booking.date) < new Date();
  const isUpcomingBooking = !isPastBooking && ['pending', 'confirmed'].includes(booking.status);
  const canBeCancelled = isUpcomingBooking && booking.status !== 'cancelled';
  const needsPayment = booking.paymentStatus === 'pending' && booking.status !== 'cancelled';
  const hasCompleted = booking.status === 'completed';
  
  const vehicle = booking.vehicle || {};
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* En-tête avec statut */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Détails de la réservation</h3>
        <span className={`${getStatusBadgeClasses(booking.status)} px-2 py-1 rounded-full text-xs font-medium`}>
          {getBookingStatusLabel(booking.status)}
        </span>
      </div>
      
      <div className="p-6">
        {/* Information principale */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-medium text-lg">{getServiceTypeName(booking.bookingType)}</h4>
              <p className="text-gray-600 text-sm">
                Réservation #{booking._id?.substring(booking._id.length - 6).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(booking.totalPrice)}</p>
              <p className="text-sm text-gray-500">
                {booking.paymentStatus === 'paid' ? 'Payé' : 'En attente de paiement'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Date, heure et véhicule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(booking.date)}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Horaire</p>
              <p className="font-medium">{booking.timeSlot}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Véhicule</p>
              <p className="font-medium">
                {vehicle.name || 'Non spécifié'} 
                {vehicle.capacity ? ` (${vehicle.capacity}m³)` : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Adresses */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Adresse de prise en charge</p>
              <p className="font-medium">
                {booking.pickupAddress?.street}, {booking.pickupAddress?.postalCode} {booking.pickupAddress?.city}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Adresse de livraison</p>
              <p className="font-medium">
                {booking.deliveryAddress?.street}, {booking.deliveryAddress?.postalCode} {booking.deliveryAddress?.city}
              </p>
            </div>
          </div>
        </div>
        
        {/* Options et informations supplémentaires */}
        <div className="space-y-4 mb-6">
          {booking.handlers > 0 && (
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Manutentionnaires</p>
                <p className="font-medium">{booking.handlers} ({booking.handlers * 25}€)</p>
              </div>
            </div>
          )}
          
          {booking.distance && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Distance estimée</p>
                <p className="font-medium">{booking.distance} km</p>
              </div>
            </div>
          )}
          
          {booking.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Notes :</p>
              <p>{booking.notes}</p>
            </div>
          )}
        </div>
        
        {/* Détail du prix */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h4 className="font-medium mb-3">Détail du prix</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Prix de base ({vehicle.name})</span>
              <span>{formatCurrency(vehicle.basePrice)}</span>
            </div>
            
            {booking.handlers > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Manutentionnaires ({booking.handlers} x 25€)</span>
                <span>{formatCurrency(booking.handlers * 25)}</span>
              </div>
            )}
            
            {booking.distance && vehicle.pricePerKm && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance ({booking.distance} km x {vehicle.pricePerKm}€)</span>
                <span>{formatCurrency(booking.distance * vehicle.pricePerKm)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        {showActions && (
          <div className="mt-8 space-y-4">
            {needsPayment && (
              <Link
                href={`/paiement?bookingId=${booking._id}`}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-center rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Procéder au paiement
                </div>
              </Link>
            )}
            
            {canBeCancelled && (
              <button
                onClick={() => onCancel && onCancel(booking._id)}
                className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 text-center rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Annuler cette réservation
                </div>
              </button>
            )}
            
            {hasCompleted && booking.paymentStatus === 'paid' && (
              <Link
                href={`/bookings/${booking._id}/facture`}
                className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 text-center rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Télécharger la facture
                </div>
              </Link>
            )}
            
            {hasCompleted && !booking.hasReview && (
              <Link
                href={`/reviews/add/${booking._id}`}
                className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 text-center rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Laisser un avis
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Version plus compacte pour les listes
export function BookingSummaryCompact({ booking, onClick }) {
  if (!booking) return null;
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(booking)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center">
              <h4 className="font-medium mr-2">{getServiceTypeName(booking.bookingType)}</h4>
              <span className={`${getStatusBadgeClasses(booking.status)} px-1.5 py-0.5 rounded-full text-xs`}>
                {getBookingStatusLabel(booking.status)}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              {formatDate(booking.date)} • {booking.timeSlot}
            </p>
          </div>
          <p className="font-bold">{formatCurrency(booking.totalPrice)}</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <div className="flex items-center mb-1">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span className="truncate">{booking.pickupAddress?.city} → {booking.deliveryAddress?.city}</span>
          </div>
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-1 text-gray-400" />
            <span>{booking.vehicle?.name || 'Véhicule non spécifié'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}