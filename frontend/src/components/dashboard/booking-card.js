'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, MapPin, Truck, ChevronDown, ChevronUp,
  FileText, XCircle, CheckCircle
} from 'lucide-react';
import { 
  formatDate, formatCurrency, getServiceTypeName, 
  getBookingStatusLabel, getStatusBadgeClasses 
} from '../../lib/utils';

export default function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  if (!booking) return null;

  const toggleExpand = () => setExpanded(!expanded);

  const isPastBooking = new Date(booking.date) < new Date();
  const isUpcomingBooking = !isPastBooking && ['pending', 'confirmed'].includes(booking.status);
  const canBeCancelled = isUpcomingBooking && booking.status !== 'cancelled';
  const needsPayment = booking.paymentStatus === 'pending' && booking.status !== 'cancelled';
  
  const bookingVehicleName = booking.vehicle 
    ? `${booking.vehicle.name} (${booking.vehicle.capacity}m³)` 
    : 'Véhicule';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-lg font-semibold mr-3">
                {bookingVehicleName}
              </span>
              <span className={`${getStatusBadgeClasses(booking.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                {getBookingStatusLabel(booking.status)}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {getServiceTypeName(booking.bookingType)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{formatCurrency(booking.totalPrice)}</p>
            {booking.handlers > 0 && (
              <p className="text-sm text-gray-500">
                {booking.handlers} manutentionnaire{booking.handlers > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{formatDate(booking.date)}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Horaire</p>
              <p>{booking.timeSlot}</p>
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Adresse de départ</p>
                <p>
                  {booking.pickupAddress.street}, {booking.pickupAddress.postalCode} {booking.pickupAddress.city}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Adresse d'arrivée</p>
                <p>
                  {booking.deliveryAddress.street}, {booking.deliveryAddress.postalCode} {booking.deliveryAddress.city}
                </p>
              </div>
            </div>
            
            {booking.paymentStatus && (
              <div className="flex items-start">
                <div className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut du paiement</p>
                  <p>{booking.paymentStatus === 'paid' ? 'Payé' : 'En attente de paiement'}</p>
                </div>
              </div>
            )}
            
            {booking.notes && (
              <div className="bg-gray-50 p-3 rounded-lg mt-3">
                <p className="text-sm text-gray-500 mb-1">Notes:</p>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button
            onClick={toggleExpand}
            className="text-gray-600 hover:text-gray-800 flex items-center">
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Masquer les détails
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Voir les détails
              </>
            )}
          </button>
          
          <div className="flex space-x-2">
            <Link
              href={`/bookings/${booking._id}`}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              Détails
            </Link>
            
            {canBeCancelled && (
              <button
                onClick={() => onCancel(booking._id)}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Annuler
              </button>
            )}
            
            {booking.status === 'completed' && !booking.hasReview && (
              <Link
                href={`/reviews/add/${booking._id}`}
                className="text-green-600 hover:text-green-700 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Avis
              </Link>
            )}
          </div>
        </div>
        
        {needsPayment && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href={`/paiement?bookingId=${booking._id}`}
              className="block w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-center"
            >
              Payer maintenant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}