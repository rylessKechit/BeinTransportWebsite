// frontend/src/app/paiement/page.js
import { Suspense } from 'react';
import PaymentContent from './PaymentContent';

// Composant de loading
function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Paiement</h1>
          <p className="text-gray-600 mb-8">Finalisez votre réservation en complétant le paiement</p>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4">Chargement des informations de paiement...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  );
}