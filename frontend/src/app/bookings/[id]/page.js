// frontend/src/app/bookings/[id]/page.js
import { Suspense } from 'react';
import BookingDetailContent from './BookingDetailContent';

// Composant de loading
function BookingDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-4 text-gray-600">Chargement des détails de la réservation...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <Suspense fallback={<BookingDetailLoading />}>
      <BookingDetailContent />
    </Suspense>
  );
}