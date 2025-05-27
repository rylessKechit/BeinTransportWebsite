// frontend/src/app/reservation/ReservationContent.js (VERSION MISE À JOUR)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, Users, MapPin, Calendar, ChevronRight, ChevronLeft, Package, Home, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { vehicleService, bookingService } from '../../lib/api';
import useGoogleMaps from '../../hooks/useGoogleMaps';
import AddressAutocomplete from '../../components/ui/AddressAutocomplete';
import DurationSlider from '../../components/ui/DurationSlider';

// Étapes du formulaire de réservation
const STEPS = {
  SERVICE_TYPE: 0,
  VEHICLE: 1,
  ADDRESSES: 2,
  DATE_DURATION: 3,
  HANDLERS: 4,
  SUMMARY: 5,
};

export default function ReservationContent() {
  const [step, setStep] = useState(STEPS.SERVICE_TYPE);
  const [booking, setBooking] = useState({
    serviceType: '',
    vehicleId: '',
    vehicle: null,
    pickupAddress: {},
    deliveryAddress: {},
    date: '',
    duration: 20, // Durée en minutes
    handlers: 0,
    distance: 0, // Distance en km
    distancePrice: 0, // Prix de la distance
    durationPrice: 0, // Prix de la durée
    totalPrice: 0,
    notes: '',
    status: 'pending',
    paymentStatus: 'pending'
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isLoaded: mapsLoaded, calculateDistance } = useGoogleMaps();
  
  // Chargement des véhicules
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await vehicleService.getAll();
        if (response.success) {
          setVehicles(response.data);
        }
      } catch (error) {
        setError("Erreur lors du chargement des véhicules.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  // Présélection de véhicule depuis l'URL
  useEffect(() => {
    const vehicleParam = searchParams.get('vehicle');
    if (vehicleParam && vehicles.length > 0) {
      const selectedVehicle = vehicles.find(v => v.capacity === parseInt(vehicleParam.replace('m3', '')));
      if (selectedVehicle) {
        setBooking(prev => ({ 
          ...prev, 
          vehicleId: selectedVehicle._id,
          vehicle: selectedVehicle
        }));
        setStep(STEPS.ADDRESSES);
      }
    }
  }, [searchParams, vehicles]);
  
  // Redirection si non connecté
  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login?redirect=/reservation');
    }
  }, [user, loading, router]);
  
  // Calculer la distance quand les deux adresses sont définies
  useEffect(() => {
    if (booking.pickupAddress.coordinates && booking.deliveryAddress.coordinates && mapsLoaded) {
      calculateDistanceAndPrice();
    }
  }, [booking.pickupAddress.coordinates, booking.deliveryAddress.coordinates, mapsLoaded]);

  // Recalculer le prix total quand les paramètres changent
  useEffect(() => {
    calculateTotalPrice();
  }, [booking.vehicle, booking.distance, booking.duration, booking.handlers]);

  const calculateDistanceAndPrice = async () => {
    if (!booking.pickupAddress.coordinates || !booking.deliveryAddress.coordinates) return;
    
    try {
      setCalculatingDistance(true);
      const result = await calculateDistance(
        booking.pickupAddress.coordinates,
        booking.deliveryAddress.coordinates
      );
      
      const distanceInKm = result.distance;
      const distancePrice = distanceInKm * 0.25; // 25 centimes par km
      
      setBooking(prev => ({
        ...prev,
        distance: distanceInKm,
        distancePrice: distancePrice
      }));
      
    } catch (error) {
      console.error('Erreur de calcul de distance:', error);
      setError('Impossible de calculer la distance entre les adresses');
    } finally {
      setCalculatingDistance(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!booking.vehicle) return;
    
    const basePrice = booking.vehicle.basePrice;
    const handlerPrice = booking.handlers * 25; // 25€ par manutentionnaire
    const distancePrice = booking.distancePrice || 0;
    
    // Calcul du prix de la durée
    const durationPrice = booking.duration <= 20 ? 0 : Math.ceil((booking.duration - 20) / 15) * 5;
    
    const totalPrice = basePrice + handlerPrice + distancePrice + durationPrice;
    
    setBooking(prev => ({
      ...prev,
      durationPrice,
      totalPrice
    }));
  };
  
  const updateBooking = (field, value) => {
    setBooking(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      
      return { ...prev, [field]: value };
    });
  };
  
  const nextStep = () => {
    // Validation selon l'étape actuelle
    if (step === STEPS.SERVICE_TYPE && !booking.serviceType) {
      setError("Veuillez sélectionner un type de service.");
      return;
    }
    
    if (step === STEPS.VEHICLE && !booking.vehicleId) {
      setError("Veuillez sélectionner un véhicule.");
      return;
    }
    
    if (step === STEPS.ADDRESSES) {
      if (!booking.pickupAddress.street || !booking.pickupAddress.city) {
        setError("Veuillez sélectionner une adresse de départ valide.");
        return;
      }
      if (!booking.deliveryAddress.street || !booking.deliveryAddress.city) {
        setError("Veuillez sélectionner une adresse d'arrivée valide.");
        return;
      }
    }
    
    if (step === STEPS.DATE_DURATION && !booking.date) {
      setError("Veuillez sélectionner une date.");
      return;
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/reservation');
      return;
    }
    
    try {
      setLoading(true);
      
      const bookingData = {
        bookingType: booking.serviceType,
        vehicleId: booking.vehicleId,
        pickupAddress: booking.pickupAddress,
        deliveryAddress: booking.deliveryAddress,
        date: booking.date,
        duration: booking.duration,
        distance: booking.distance,
        handlers: booking.handlers,
        totalPrice: booking.totalPrice,
        notes: booking.notes
      };
      
      const response = await bookingService.create(bookingData);
      
      if (response.success) {
        router.push(`/paiement?bookingId=${response.data._id}`);
      } else {
        setError("Erreur lors de la création de la réservation.");
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Réservez votre transport</h1>
        
        {/* Indicateur de progression */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between">
            {Object.values(STEPS).map((stepIndex) => (
              <div 
                key={stepIndex}
                className={`relative flex flex-col items-center ${stepIndex < step ? 'text-purple-600' : stepIndex === step ? 'text-purple-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${stepIndex < step ? 'bg-purple-600 text-white' : stepIndex === step ? 'border-2 border-purple-600' : 'border-2 border-gray-300'}`}
                >
                  {stepIndex < step ? '✓' : stepIndex + 1}
                </div>
                <div className="text-xs font-medium text-center">
                  {stepIndex === STEPS.SERVICE_TYPE && 'Service'}
                  {stepIndex === STEPS.VEHICLE && 'Véhicule'}
                  {stepIndex === STEPS.ADDRESSES && 'Adresses'}
                  {stepIndex === STEPS.DATE_DURATION && 'Date/Durée'}
                  {stepIndex === STEPS.HANDLERS && 'Manutention'}
                  {stepIndex === STEPS.SUMMARY && 'Récapitulatif'}
                </div>
                
                {stepIndex < Object.values(STEPS).length - 1 && (
                  <div 
                    className={`absolute top-5 left-full w-full h-0.5 
                    ${stepIndex < step ? 'bg-purple-600' : 'bg-gray-300'}`}
                    style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-700 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Contenu du formulaire */}
        <motion.div 
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8"
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {step === STEPS.SERVICE_TYPE && (
            <ServiceTypeStep 
              selected={booking.serviceType}
              onChange={(type) => updateBooking('serviceType', type)}
            />
          )}
          
          {step === STEPS.VEHICLE && (
            <VehicleStep 
              vehicles={vehicles}
              selected={booking.vehicleId}
              onChange={(vehicleId, vehicle) => {
                updateBooking('vehicleId', vehicleId);
                updateBooking('vehicle', vehicle);
              }}
            />
          )}
          
          {step === STEPS.ADDRESSES && (
            <AddressesStep 
              pickupAddress={booking.pickupAddress}
              deliveryAddress={booking.deliveryAddress}
              onPickupChange={(address) => updateBooking('pickupAddress', address)}
              onDeliveryChange={(address) => updateBooking('deliveryAddress', address)}
              calculatingDistance={calculatingDistance}
              distance={booking.distance}
              distancePrice={booking.distancePrice}
            />
          )}
          
          {step === STEPS.DATE_DURATION && (
            <DateDurationStep 
              date={booking.date}
              duration={booking.duration}
              onDateChange={(date) => updateBooking('date', date)}
              onDurationChange={(duration) => updateBooking('duration', duration)}
            />
          )}
          
          {step === STEPS.HANDLERS && (
            <HandlersStep 
              handlers={booking.handlers}
              vehicleCapacity={booking.vehicle?.capacity}
              onChange={(handlers) => updateBooking('handlers', handlers)}
              notes={booking.notes}
              onNotesChange={(notes) => updateBooking('notes', notes)}
            />
          )}
          
          {step === STEPS.SUMMARY && (
            <SummaryStep 
              booking={booking}
              vehicles={vehicles}
            />
          )}
          
          {/* Boutons de navigation */}
          <div className="flex justify-between mt-12">
            {step > STEPS.SERVICE_TYPE ? (
              <button 
                onClick={prevStep}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
            ) : (
              <div />
            )}
            
            {step < STEPS.SUMMARY ? (
              <button 
                onClick={nextStep}
                disabled={calculatingDistance}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg flex items-center"
              >
                {calculatingDistance ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Calcul en cours...
                  </>
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg"
              >
                {loading ? 'Traitement en cours...' : 'Confirmer et payer'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Composants pour chaque étape
function ServiceTypeStep({ selected, onChange }) {
  const serviceTypes = [
    { id: 'demenagement', name: 'Déménagement', icon: <Home className="w-12 h-12 text-purple-600 mb-4" /> },
    { id: 'livraison', name: 'Livraison de colis', icon: <Package className="w-12 h-12 text-purple-600 mb-4" /> },
    { id: 'transport', name: 'Transport divers', icon: <Truck className="w-12 h-12 text-purple-600 mb-4" /> },
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Quel type de service recherchez-vous ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTypes.map((service) => (
          <div 
            key={service.id}
            className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all hover:shadow-md
              ${selected === service.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
            onClick={() => onChange(service.id)}
          >
            {service.icon}
            <h3 className="text-lg font-medium">{service.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleStep({ vehicles, selected, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Choisissez votre véhicule</h2>
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle._id}
            className={`border-2 rounded-xl p-4 flex items-center cursor-pointer transition-all hover:shadow-md
              ${selected === vehicle._id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
            onClick={() => onChange(vehicle._id, vehicle)}
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
              <Truck className="h-12 w-12 text-gray-400" />
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{vehicle.name}</h3>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {vehicle.capacity} m³
                </span>
              </div>
              <p className="text-gray-600 text-sm">{vehicle.description}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-lg font-semibold">{vehicle.basePrice}€</p>
              <p className="text-sm text-gray-500">prix de base</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressesStep({ pickupAddress, deliveryAddress, onPickupChange, onDeliveryChange, calculatingDistance, distance, distancePrice }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Adresses de prise en charge et de livraison</h2>
      
      <div className="space-y-6">
        <AddressAutocomplete
          label="Adresse de prise en charge"
          placeholder="Tapez votre adresse de départ..."
          value={pickupAddress}
          onChange={onPickupChange}
          required
        />
        
        <AddressAutocomplete
          label="Adresse de livraison"
          placeholder="Tapez votre adresse d'arrivée..."
          value={deliveryAddress}
          onChange={onDeliveryChange}
          required
        />
        
        {/* Affichage de la distance calculée */}
        {calculatingDistance && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <Loader className="animate-spin h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-800">Calcul de la distance en cours...</span>
          </div>
        )}
        
        {distance > 0 && !calculatingDistance && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Distance: {distance.toFixed(1)} km
                </span>
              </div>
              <span className="text-green-800 font-semibold">
                +{distancePrice.toFixed(2)}€
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Tarif: 0,25€ par kilomètre
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DateDurationStep({ date, duration, onDateChange, onDurationChange }) {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Date et durée de réservation</h2>
      
      <div className="space-y-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Date souhaitée
          </label>
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              min={today}
              required
            />
          </div>
        </div>
        
        <DurationSlider
          value={duration}
          onChange={onDurationChange}
        />
      </div>
    </div>
  );
}

function HandlersStep({ handlers, vehicleCapacity, onChange, notes, onNotesChange }) {
  const maxHandlers = vehicleCapacity <= 3 ? 1 : 2;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Options supplémentaires</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Manutentionnaires</h3>
          <p className="text-gray-600 mb-6">
            Besoin d'aide pour charger et décharger votre véhicule ? Ajoutez des manutentionnaires à votre réservation.
            {vehicleCapacity <= 3 ? ' Pour ce véhicule, vous pouvez réserver 1 manutentionnaire maximum.' : ' Pour ce véhicule, vous pouvez réserver jusqu\'à 2 manutentionnaires.'}
          </p>
          
          <div className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl">
            <button
              type="button"
              onClick={() => onChange(Math.max(0, handlers - 1))}
              className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
              disabled={handlers === 0}
            >
              -
            </button>
            
            <div className="mx-8 flex flex-col items-center">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <span className="text-3xl font-bold">{handlers}</span>
              </div>
              <p className="text-gray-500 mt-2">Manutentionnaires</p>
            </div>
            
            <button
              type="button"
              onClick={() => onChange(Math.min(maxHandlers, handlers + 1))}
              className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
              disabled={handlers === maxHandlers}
            >
              +
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 text-center">Prix par manutentionnaire : 25€</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Notes supplémentaires</h3>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            rows="4"
            placeholder="Informations complémentaires pour votre réservation (accès, stationnement, objets fragiles, etc.)"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryStep({ booking }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const getServiceName = (serviceType) => {
    switch (serviceType) {
      case 'demenagement': return 'Déménagement';
      case 'livraison': return 'Livraison de colis';
      case 'transport': return 'Transport divers';
      default: return serviceType;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Récapitulatif de votre réservation</h2>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-medium">Détails de la réservation</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Type de service</span>
            <span className="font-medium">{getServiceName(booking.serviceType)}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Véhicule</span>
            <span className="font-medium">{booking.vehicle?.name} ({booking.vehicle?.capacity} m³)</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">{formatDate(booking.date)}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Durée</span>
            <span className="font-medium">{formatDuration(booking.duration)}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Distance</span>
            <span className="font-medium">{booking.distance.toFixed(1)} km</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Manutentionnaires</span>
            <span className="font-medium">{booking.handlers}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Adresse de départ</span>
            <span className="font-medium text-right">{booking.pickupAddress.formatted_address}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Adresse d'arrivée</span>
            <span className="font-medium text-right">{booking.deliveryAddress.formatted_address}</span>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-medium">Détails du prix</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Prix de base ({booking.vehicle?.name})</span>
            <span>{booking.vehicle?.basePrice.toFixed(2)}€</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Distance ({booking.distance.toFixed(1)} km × 0,25€)</span>
            <span>{booking.distancePrice.toFixed(2)}€</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Durée ({formatDuration(booking.duration)})</span>
            <span>{booking.durationPrice > 0 ? `${booking.durationPrice.toFixed(2)}€` : 'Gratuit'}</span>
          </div>
          
          {booking.handlers > 0 && (
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-gray-600">Manutentionnaires ({booking.handlers} × 25€)</span>
              <span>{(booking.handlers * 25).toFixed(2)}€</span>
            </div>
          )}
          
          <div className="flex justify-between pt-2 text-lg font-semibold">
            <span>Total</span>
            <span>{booking.totalPrice.toFixed(2)}€</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <p>En confirmant votre réservation, vous serez redirigé vers notre page de paiement sécurisé.</p>
          </div>
        </div>
      </div>
    </div>
  );
}