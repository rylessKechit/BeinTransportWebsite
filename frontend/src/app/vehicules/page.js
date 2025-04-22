'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Info, ArrowRight, Loader } from 'lucide-react';
import { vehicleService } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';

export default function VehiculesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await vehicleService.getAll();
        
        if (response.success) {
          setVehicles(response.data);
        } else {
          setError('Erreur lors du chargement des véhicules');
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des véhicules');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-red-600 animate-spin" />
        <span className="ml-2">Chargement des véhicules...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notre flotte de véhicules</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le véhicule idéal pour votre déménagement, transport ou livraison.
            Nous disposons d'une large gamme de véhicules pour répondre à tous vos besoins.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Prêt à réserver votre véhicule ?</h2>
          <Link
            href="/reservation"
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg transition-colors inline-flex items-center"
          >
            Réserver maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 bg-gray-200">
        {vehicle.imageUrl && vehicle.imageUrl !== '/images/default-vehicle.jpg' ? (
          <img 
            src={vehicle.imageUrl} 
            alt={vehicle.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <Truck className="h-20 w-20" />
          </div>
        )}
      </div>

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{vehicle.name}</h3>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {vehicle.capacity} m³
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{vehicle.description}</p>
        
        {showDetails && (
          <div className="mt-4 space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">Dimensions:</h4>
            <ul className="list-disc list-inside">
              <li>Longueur: {vehicle.dimensions?.length || '—'} cm</li>
              <li>Largeur: {vehicle.dimensions?.width || '—'} cm</li>
              <li>Hauteur: {vehicle.dimensions?.height || '—'} cm</li>
            </ul>
            
            <p>
              <span className="font-medium">Prix par km:</span> {formatCurrency(vehicle.pricePerKm)}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <Info className="h-4 w-4 mr-1" />
            {showDetails ? 'Masquer les détails' : 'Voir les détails'}
          </button>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">À partir de</p>
            <p className="text-lg font-bold">{formatCurrency(vehicle.basePrice)}</p>
          </div>
        </div>
        
        <Link
          href={`/reservation?vehicleId=${vehicle._id}`}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mt-4 inline-block text-center"
        >
          Réserver
        </Link>
      </div>
    </div>
  );
}