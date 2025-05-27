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

export function BookingSummary({ booking, onCancel, showActions = true }) {
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
          </div>
        )}
      </div>
    </div>
  );
}

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
