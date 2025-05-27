// frontend/src/app/reservation/page.js
import { Suspense } from 'react';
import ReservationContent from './ReservationContent';

// Composant de loading
function ReservationLoading() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Réservez votre transport</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-4 text-gray-600">Chargement du formulaire...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<ReservationLoading />}>
      <ReservationContent />
    </Suspense>
  );
}