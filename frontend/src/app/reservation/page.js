'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, Users, MapPin, Calendar, Clock, ChevronRight, ChevronLeft, Package, Home, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { vehicleService, bookingService } from '../../lib/api';

// Étapes du formulaire de réservation
const STEPS = {
  SERVICE_TYPE: 0,
  VEHICLE: 1,
  ADDRESSES: 2,
  DATE_TIME: 3,
  HANDLERS: 4,
  SUMMARY: 5,
};

export default function ReservationPage() {
  const [step, setStep] = useState(STEPS.SERVICE_TYPE);
  const [booking, setBooking] = useState({
    serviceType: '',
    vehicleId: '',
    vehicle: null, // Pour stocker les informations complètes du véhicule
    pickupAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    deliveryAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    date: '',
    timeSlot: '',
    handlers: 0,
    totalPrice: 0,
    notes: '',
    status: 'pending',
    paymentStatus: 'pending'
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
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
    
    // Si un paramètre de véhicule est présent dans l'URL, le présélectionner
    const vehicleParam = searchParams.get('vehicle');
    if (vehicleParam) {
      // Attendre que les véhicules soient chargés puis sélectionner celui qui correspond
      const interval = setInterval(() => {
        if (vehicles.length > 0) {
          const selectedVehicle = vehicles.find(v => v.capacity === parseInt(vehicleParam.replace('m3', '')));
          if (selectedVehicle) {
            setBooking(prev => ({ 
              ...prev, 
              vehicleId: selectedVehicle._id,
              vehicle: selectedVehicle
            }));
            setStep(STEPS.ADDRESSES); // Passer directement à l'étape des adresses
          }
          clearInterval(interval);
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [searchParams]);
  
  // Rediriger vers la connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login?redirect=/reservation');
    }
  }, [user, loading, router]);
  
  const updateBooking = (field, value) => {
    setBooking(prev => {
      // Cas spécial pour les champs imbriqués comme pickupAddress.street
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
      
      // Mise à jour standard des champs
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
      if (!booking.pickupAddress.street || !booking.pickupAddress.city || !booking.pickupAddress.postalCode) {
        setError("Veuillez remplir l'adresse de départ.");
        return;
      }
      if (!booking.deliveryAddress.street || !booking.deliveryAddress.city || !booking.deliveryAddress.postalCode) {
        setError("Veuillez remplir l'adresse d'arrivée.");
        return;
      }
    }
    
    if (step === STEPS.DATE_TIME) {
      if (!booking.date) {
        setError("Veuillez sélectionner une date.");
        return;
      }
      if (!booking.timeSlot) {
        setError("Veuillez sélectionner un créneau horaire.");
        return;
      }
    }
    
    // Effacer l'erreur et passer à l'étape suivante
    setError(null);
    setStep(prev => prev + 1);
    
    // Calcul du prix total à l'étape du récapitulatif
    if (step === STEPS.HANDLERS) {
      calculateTotalPrice();
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const calculateTotalPrice = () => {
    if (!booking.vehicle) return;
    
    const basePrice = booking.vehicle.basePrice;
    const handlerPrice = booking.handlers * 25; // 25€ par manutentionnaire
    
    // Estimation simple - dans un cas réel, ça pourrait être calculé via Google Maps API
    const estimatedDistance = 10; // km
    const distancePrice = estimatedDistance * booking.vehicle.pricePerKm;
    
    const totalPrice = basePrice + handlerPrice + distancePrice;
    
    updateBooking('totalPrice', totalPrice);
  };
  
  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/reservation');
      return;
    }
    
    try {
      setLoading(true);
      // Préparer les données pour l'API
      const bookingData = {
        ...booking,
        bookingType: booking.serviceType, // L'API attend bookingType au lieu de serviceType
      };
      
      const response = await bookingService.create(bookingData);
      
      if (response.success) {
        // Rediriger vers la page de paiement avec l'ID de réservation
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
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
                className={`relative flex flex-col items-center ${stepIndex < step ? 'text-red-600' : stepIndex === step ? 'text-red-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${stepIndex < step ? 'bg-red-600 text-white' : stepIndex === step ? 'border-2 border-red-600' : 'border-2 border-gray-300'}`}
                >
                  {stepIndex < step ? '✓' : stepIndex + 1}
                </div>
                <div className="text-xs font-medium text-center">
                  {stepIndex === STEPS.SERVICE_TYPE && 'Service'}
                  {stepIndex === STEPS.VEHICLE && 'Véhicule'}
                  {stepIndex === STEPS.ADDRESSES && 'Adresses'}
                  {stepIndex === STEPS.DATE_TIME && 'Date/Heure'}
                  {stepIndex === STEPS.HANDLERS && 'Manutention'}
                  {stepIndex === STEPS.SUMMARY && 'Récapitulatif'}
                </div>
                
                {/* Ligne de connexion, sauf pour la dernière étape */}
                {stepIndex < Object.values(STEPS).length - 1 && (
                  <div 
                    className={`absolute top-5 left-full w-full h-0.5 
                    ${stepIndex < step ? 'bg-red-600' : 'bg-gray-300'}`}
                    style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-700">
            {error}
          </div>
        )}
        
        {/* Contenu du formulaire basé sur l'étape actuelle */}
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
              onPickupChange={(field, value) => updateBooking(`pickupAddress.${field}`, value)}
              onDeliveryChange={(field, value) => updateBooking(`deliveryAddress.${field}`, value)}
            />
          )}
          
          {step === STEPS.DATE_TIME && (
            <DateTimeStep 
              date={booking.date}
              timeSlot={booking.timeSlot}
              onDateChange={(date) => updateBooking('date', date)}
              onTimeSlotChange={(timeSlot) => updateBooking('timeSlot', timeSlot)}
            />
          )}
          
          {step === STEPS.HANDLERS && (
            <HandlersStep 
              handlers={booking.handlers}
              vehicleCapacity={booking.vehicle?.capacity}
              onChange={(handlers) => updateBooking('handlers', handlers)}
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
              <div /> // Placeholder pour maintenir le flex justify-between
            )}
            
            {step < STEPS.SUMMARY ? (
              <button 
                onClick={nextStep}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg flex items-center"
              >
                Suivant
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg"
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

// Composants pour chaque étape du formulaire
function ServiceTypeStep({ selected, onChange }) {
  const serviceTypes = [
    { id: 'demenagement', name: 'Déménagement', icon: <Home className="w-12 h-12 text-red-600 mb-4" /> },
    { id: 'livraison', name: 'Livraison de colis', icon: <Package className="w-12 h-12 text-red-600 mb-4" /> },
    { id: 'transport', name: 'Transport divers', icon: <Truck className="w-12 h-12 text-red-600 mb-4" /> },
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Quel type de service recherchez-vous ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTypes.map((service) => (
          <div 
            key={service.id}
            className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all hover:shadow-md
              ${selected === service.id ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
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
              ${selected === vehicle._id ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
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

function AddressesStep({ pickupAddress, deliveryAddress, onPickupChange, onDeliveryChange }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Adresses de prise en charge et de livraison</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Adresse de prise en charge</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Rue et numéro
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={pickupAddress.street}
                onChange={(e) => onPickupChange('street', e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Rue et numéro"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Ville
              </label>
              <input
                type="text"
                value={pickupAddress.city}
                onChange={(e) => onPickupChange('city', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Ville"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Code postal
              </label>
              <input
                type="text"
                value={pickupAddress.postalCode}
                onChange={(e) => onPickupChange('postalCode', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Code postal"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Adresse de livraison</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Rue et numéro
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={deliveryAddress.street}
                onChange={(e) => onDeliveryChange('street', e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Rue et numéro"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Ville
              </label>
              <input
                type="text"
                value={deliveryAddress.city}
                onChange={(e) => onDeliveryChange('city', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Ville"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Code postal
              </label>
              <input
                type="text"
                value={deliveryAddress.postalCode}
                onChange={(e) => onDeliveryChange('postalCode', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Code postal"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateTimeStep({ date, timeSlot, onDateChange, onTimeSlotChange }) {
  const timeSlots = [
    '8h00 - 10h00',
    '10h00 - 12h00',
    '13h00 - 15h00',
    '15h00 - 17h00',
    '17h00 - 19h00'
  ];
  
  // Obtenir la date du jour au format YYYY-MM-DD pour le min du input date
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Date et créneau horaire</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Date souhaitée
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            min={today}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Créneau horaire
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {timeSlots.map((slot) => (
            <div 
              key={slot}
              className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all
                ${timeSlot === slot ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
              onClick={() => onTimeSlotChange(slot)}
            >
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{slot}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HandlersStep({ handlers, vehicleCapacity, onChange }) {
  // Détermine le nombre maximum de manutentionnaires en fonction de la capacité du véhicule
  const maxHandlers = vehicleCapacity <= 3 ? 1 : 2;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Manutentionnaires</h2>
      <p className="text-gray-600 mb-6">
        Besoin d'aide pour charger et décharger votre véhicule ? Ajoutez des manutentionnaires à votre réservation.
        {vehicleCapacity <= 3 ? ' Pour ce véhicule, vous pouvez réserver 1 manutentionnaire maximum.' : ' Pour ce véhicule, vous pouvez réserver jusqu\'à 2 manutentionnaires.'}
      </p>
      
      <div className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl">
        <button
          onClick={() => onChange(Math.max(0, handlers - 1))}
          className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
          disabled={handlers === 0}
        >
          -
        </button>
        
        <div className="mx-8 flex flex-col items-center">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-red-600 mr-3" />
            <span className="text-3xl font-bold">{handlers}</span>
          </div>
          <p className="text-gray-500 mt-2">Manutentionnaires</p>
        </div>
        
        <button
          onClick={() => onChange(Math.min(maxHandlers, handlers + 1))}
          className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
          disabled={handlers === maxHandlers}
        >
          +
        </button>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">Prix par manutentionnaire : 25€</p>
      </div>
    </div>
  );
}

function SummaryStep({ booking, vehicles }) {
  // Trouver les détails du véhicule si on n'a que l'ID
  const vehicle = booking.vehicle || vehicles.find(v => v._id === booking.vehicleId);
  
  // Calcul du prix total (simplifié)
  const basePrice = vehicle?.basePrice || 0;
  const handlerPrice = 25 * booking.handlers;
  const totalPrice = booking.totalPrice || (basePrice + handlerPrice);
  
  // Formatage de la date pour affichage
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Trouver le nom du service sélectionné
  const getServiceName = (serviceType) => {
    switch (serviceType) {
      case 'demenagement': return 'Déménagement';
      case 'livraison': return 'Livraison de colis';
      case 'transport': return 'Transport divers';
      default: return serviceType;
    }
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
            <span className="font-medium">
              {getServiceName(booking.serviceType)}
            </span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Véhicule</span>
            <span className="font-medium">{vehicle?.name} ({vehicle?.capacity} m³)</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Adresse de départ</span>
            <span className="font-medium">
              {booking.pickupAddress.street}, {booking.pickupAddress.postalCode} {booking.pickupAddress.city}
            </span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Adresse d'arrivée</span>
            <span className="font-medium">
              {booking.deliveryAddress.street}, {booking.deliveryAddress.postalCode} {booking.deliveryAddress.city}
            </span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Date et créneau</span>
            <span className="font-medium">{formatDate(booking.date)} • {booking.timeSlot}</span>
          </div>
          
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Manutentionnaires</span>
            <span className="font-medium">{booking.handlers}</span>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-medium">Détails du prix</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between pb-3 border-b border-gray-100">
            <span className="text-gray-600">Prix de base ({vehicle?.name})</span>
            <span>{basePrice}€</span>
          </div>
          
          {booking.handlers > 0 && (
            <div className="flex justify-between pb-3 border-b border-gray-100">
              <span className="text-gray-600">Manutentionnaires ({booking.handlers} x 25€)</span>
              <span>{handlerPrice}€</span>
            </div>
          )}
          
          <div className="flex justify-between pt-2 text-lg font-semibold">
            <span>Total</span>
            <span>{totalPrice}€</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <p>En confirmant votre réservation, vous serez redirigé vers notre page de paiement sécurisé.</p>
          </div>
        </div>
      </div>
    </div>
  );
}