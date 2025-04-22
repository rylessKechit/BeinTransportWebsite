'use client';

import { Truck, Package, CreditCard, Clock } from 'lucide-react';

export default function StatsCard({ title, value, type, change }) {
  // Déterminer l'icône en fonction du type
  const getIcon = () => {
    switch (type) {
      case 'reservations':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'vehicles':
        return <Truck className="h-6 w-6 text-green-500" />;
      case 'payments':
        return <CreditCard className="h-6 w-6 text-purple-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-orange-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  // Déterminer la couleur du changement
  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  // Formater le changement avec + ou -
  const formatChange = () => {
    if (!change) return null;
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className="p-2 rounded-full bg-gray-50">{getIcon()}</div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <p className={`text-sm ${getChangeColor()} flex items-center mt-1`}>
              {formatChange()}
              <span className="ml-1">par rapport au mois dernier</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Carte pour afficher les réservations à venir
export function UpcomingBookingsCard({ bookings = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">Prochaines réservations</h3>
        <div className="p-2 rounded-full bg-gray-50">
          <Calendar className="h-6 w-6 text-red-500" />
        </div>
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Aucune réservation à venir</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.slice(0, 3).map(booking => (
            <div key={booking._id} className="flex items-center p-3 border border-gray-100 rounded-lg">
              <div className="p-2 bg-gray-50 rounded-full mr-3">
                <Truck className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-grow">
                <p className="font-medium">{booking.bookingType === 'demenagement' ? 'Déménagement' : booking.bookingType === 'livraison' ? 'Livraison' : 'Transport'}</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.date).toLocaleDateString('fr-FR')} • {booking.timeSlot}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{booking.totalPrice}€</p>
                <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </span>
              </div>
            </div>
          ))}
          
          {bookings.length > 3 && (
            <div className="text-center pt-2">
              <Link href="/bookings" className="text-red-600 hover:text-red-700 text-sm font-medium">
                Voir toutes les réservations
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Carte pour afficher les statistiques de paiement
export function PaymentStatsCard({ totalAmount, pendingAmount, paidAmount }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">Paiements</h3>
        <div className="p-2 rounded-full bg-gray-50">
          <CreditCard className="h-6 w-6 text-purple-500" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Total</p>
          <p className="font-bold">{totalAmount}€</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Payés</p>
          <p className="font-bold text-green-600">{paidAmount}€</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-gray-600">En attente</p>
          <p className="font-bold text-yellow-600">{pendingAmount}€</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}