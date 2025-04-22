'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  Truck, Home, Package, Calendar, Clock, MapPin, 
  Users, ChevronRight, ChevronLeft, AlertCircle 
} from 'lucide-react';
import { vehicleService, bookingService } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';

// Étapes du processus de réservation
const STEPS = {
  SERVICE_TYPE: 0,
  VEHICLE: 1,
  ADDRESSES: 2,
  DATE_TIME: 3,
  HANDLERS: 4,
  RECAP: 5
};

export default function BookingForm({ onComplete }) {
  const [step, setStep] = useState(STEPS.SERVICE_TYPE);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const { user } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      bookingType: '',
      vehicleId: '',
      pickupAddress: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || '',
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
      notes: ''
    }
  });
  
  // Récupérer les valeurs du formulaire
  const watchBookingType = watch('bookingType');
  const watchVehicleId = watch('vehicleId');
  const watchHandlers = watch('handlers');
  const watchDate = watch('date');
  const watchTimeSlot = watch('timeSlot');
  
  // Charger les véhicules
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
  
  // Mettre à jour le véhicule sélectionné et le prix quand l'ID change
  useEffect(() => {
    if (watchVehicleId) {
      const vehicle = vehicles.find(v => v._id === watchVehicleId);
      setSelectedVehicle(vehicle);
      calculatePrice(vehicle, watchHandlers);
    }
  }, [watchVehicleId, watchHandlers, vehicles]);
  
  // Calculer le prix total
  const calculatePrice = (vehicle, handlers) => {
    if (!vehicle) return;
    
    const basePrice = vehicle.basePrice;
    const handlerPrice = handlers * 25; // 25€ par manutentionnaire
    
    // Estimation simple pour la démonstration
    const estimatedDistance = 10; // km
    const distancePrice = estimatedDistance * vehicle.pricePerKm;
    
    const total = basePrice + handlerPrice + distancePrice;
    setTotalPrice(total);
  };
  
  // Navigation entre les étapes
  const nextStep = () => {
    // Validation spécifique à l'étape actuelle
    if (step === STEPS.SERVICE_TYPE && !watchBookingType) {
      setError('Veuillez sélectionner un type de service');
      return;
    }
    
    if (step === STEPS.VEHICLE && !watchVehicleId) {
      setError('Veuillez sélectionner un véhicule');
      return;
    }
    
    if (step === STEPS.DATE_TIME && (!watchDate || !watchTimeSlot)) {
      setError('Veuillez sélectionner une date et un créneau horaire');
      return;
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Soumettre le formulaire
  const onSubmit = async (data) => {
    if (!user) {
      router.push('/auth/login?redirect=/reservation');
      return;
    }
    
    try {
      setLoading(true);
      
      // Ajouter le prix total aux données
      const bookingData = {
        ...data,
        totalPrice
      };
      
      const response = await bookingService.create(bookingData);
      
      if (response.success) {
        if (onComplete) {
          onComplete(response.data);
        } else {
          router.push(`/paiement?bookingId=${response.data._id}`);
        }
      } else {
        setError('Erreur lors de la création de la réservation');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtenir la date du jour au format YYYY-MM-DD
  const getFormattedToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Les créneaux horaires disponibles
  const timeSlots = [
    '8h00 - 10h00',
    '10h00 - 12h00',
    '13h00 - 15h00',
    '15h00 - 17h00',
    '17h00 - 19h00'
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      {/* Indicateur d'étapes */}
      <div className="mb-8">
        <div className="flex justify-between">
          {Object.values(STEPS).map((stepIndex) => (
            <div 
              key={stepIndex}
              className={`relative flex flex-col items-center ${
                stepIndex < step ? 'text-red-600' : stepIndex === step ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${stepIndex < step ? 'bg-red-600 text-white' : stepIndex === step ? 'border-2 border-red-600' : 'border-2 border-gray-300'}`}
              >
                {stepIndex < step ? '✓' : stepIndex + 1}
              </div>
              <div className="text-xs font-medium text-center hidden md:block">
                {stepIndex === STEPS.SERVICE_TYPE && 'Service'}
                {stepIndex === STEPS.VEHICLE && 'Véhicule'}
                {stepIndex === STEPS.ADDRESSES && 'Adresses'}
                {stepIndex === STEPS.DATE_TIME && 'Date'}
                {stepIndex === STEPS.HANDLERS && 'Options'}
                {stepIndex === STEPS.RECAP && 'Résumé'}
              </div>
              
              {/* Ligne de connexion entre les étapes */}
              {stepIndex < Object.values(STEPS).length - 1 && (
                <div 
                  className={`absolute top-4 left-full w-full h-0.5 
                  ${stepIndex < step ? 'bg-red-600' : 'bg-gray-300'}`}
                  style={{ width: 'calc(100% - 2rem)', left: '2rem' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-700 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Étape 1: Type de service */}
        {step === STEPS.SERVICE_TYPE && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Quel type de service recherchez-vous ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label 
                className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-all
                  ${watchBookingType === 'demenagement' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
              >
                <input 
                  type="radio" 
                  value="demenagement" 
                  className="sr-only" 
                  {...register('bookingType')}
                />
                <Home className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-medium">Déménagement</h3>
              </label>
              
              <label 
                className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-all
                  ${watchBookingType === 'livraison' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
              >
                <input 
                  type="radio" 
                  value="livraison" 
                  className="sr-only" 
                  {...register('bookingType')}
                />
                <Package className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-medium">Livraison de colis</h3>
              </label>
              
              <label 
                className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-all
                  ${watchBookingType === 'transport' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
              >
                <input 
                  type="radio" 
                  value="transport" 
                  className="sr-only" 
                  {...register('bookingType')}
                />
                <Truck className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-medium">Transport divers</h3>
              </label>
            </div>
          </div>
        )}
        
        {/* Étape 2: Sélection du véhicule */}
        {step === STEPS.VEHICLE && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Choisissez votre véhicule</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des véhicules...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <label 
                    key={vehicle._id}
                    className={`border-2 rounded-lg p-4 flex items-center cursor-pointer transition-all
                      ${watchVehicleId === vehicle._id ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
                  >
                    <input 
                      type="radio" 
                      value={vehicle._id} 
                      className="sr-only" 
                      {...register('vehicleId')}
                    />
                    
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                      {vehicle.imageUrl && vehicle.imageUrl !== '/images/default-vehicle.jpg' ? (
                        <img 
                          src={vehicle.imageUrl} 
                          alt={vehicle.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Truck className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{vehicle.name}</h3>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                          {vehicle.capacity} m³
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{vehicle.description}</p>
                    </div>
                    
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="font-bold">{formatCurrency(vehicle.basePrice)}</p>
                      <p className="text-xs text-gray-500">Prix de base</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Étape 3: Adresses */}
        {step === STEPS.ADDRESSES && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Adresses de prise en charge et de livraison</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Adresse de prise en charge</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rue et numéro</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-4 py-2.5 border ${errors.pickupAddress?.street ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                      placeholder="Rue et numéro"
                      {...register('pickupAddress.street', { required: true })}
                    />
                  </div>
                  {errors.pickupAddress?.street && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      className={`block w-full px-4 py-2.5 border ${errors.pickupAddress?.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                      placeholder="Ville"
                      {...register('pickupAddress.city', { required: true })}
                    />
                    {errors.pickupAddress?.city && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      className={`block w-full px-4 py-2.5 border ${errors.pickupAddress?.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                      placeholder="Code postal"
                      {...register('pickupAddress.postalCode', { required: true })}
                    />
                    {errors.pickupAddress?.postalCode && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Adresse de livraison</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rue et numéro</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-4 py-2.5 border ${errors.deliveryAddress?.street ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                      placeholder="Rue et numéro"
                      {...register('deliveryAddress.street', { required: true })}
                    />
                  </div>
                  {errors.deliveryAddress?.street && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      className={`block w-full px-4 py-2.5 border ${errors.deliveryAddress?.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                      placeholder="Ville"
                      {...register('deliveryAddress.city', { required: true })}
                    />
                    {errors.deliveryAddress?.city && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      className={`block w-full px-4 py-2.5 border ${errors.deliveryAddress?.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                      placeholder="Code postal"
                      {...register('deliveryAddress.postalCode', { required: true })}
                    />
                    {errors.deliveryAddress?.postalCode && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Étape 4: Date et créneau horaire */}
        {step === STEPS.DATE_TIME && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Date et créneau horaire</h2>
            
            <div className="mb-6">
              <label className="block font-medium mb-2">Date souhaitée</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className={`block w-full pl-10 pr-4 py-2.5 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-red-500 focus:border-red-500`}
                  min={getFormattedToday()}
                  {...register('date', { required: true })}
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
            </div>
            
            <div>
              <label className="block font-medium mb-2">Créneau horaire</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <label 
                    key={slot}
                    className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all
                      ${watchTimeSlot === slot ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
                  >
                    <input 
                      type="radio" 
                      value={slot} 
                      className="sr-only" 
                      {...register('timeSlot', { required: true })}
                    />
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{slot}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.timeSlot && <p className="mt-1 text-sm text-red-600">Ce champ est requis</p>}
            </div>
          </div>
        )}
        
        {/* Étape 5: Manutentionnaires et options */}
        {step === STEPS.HANDLERS && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Options supplémentaires</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Manutentionnaires</h3>
              <p className="text-gray-600 mb-4">
                Besoin d'aide pour charger et décharger votre véhicule ? Ajoutez des manutentionnaires à votre réservation.
                {selectedVehicle && selectedVehicle.capacity <= 3 
                  ? ' Pour ce véhicule, vous pouvez réserver 1 manutentionnaire maximum.' 
                  : ' Pour ce véhicule, vous pouvez réserver jusqu\'à 2 manutentionnaires.'}
              </p>
              
              <div className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setValue('handlers', Math.max(0, watchHandlers - 1))}
                  className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
                  disabled={watchHandlers === 0}
                >
                  -
                </button>
                
                <div className="mx-8 flex flex-col items-center">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-red-600 mr-3" />
                    <span className="text-3xl font-bold">{watchHandlers}</span>
                  </div>
                  <p className="text-gray-500 mt-2">Manutentionnaires</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setValue('handlers', Math.min(selectedVehicle?.capacity <= 3 ? 1 : 2, watchHandlers + 1))}
                  className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-2xl hover:bg-gray-300 disabled:opacity-50"
                  disabled={watchHandlers === (selectedVehicle?.capacity <= 3 ? 1 : 2)}
                >
                  +
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">Prix par manutentionnaire : 25€</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Notes supplémentaires</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                rows="4"
                placeholder="Informations complémentaires pour votre réservation (accès, stationnement, etc.)"
                {...register('notes')}
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Étape 6: Récapitulatif */}
        {step === STEPS.RECAP && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-6">Récapitulatif de votre réservation</h2>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <h3 className="font-medium">Détails de la réservation</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Type de service</span>
                  <span className="font-medium">
                    {watchBookingType === 'demenagement' ? 'Déménagement' : 
                     watchBookingType === 'livraison' ? 'Livraison de colis' : 'Transport divers'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Véhicule</span>
                  <span className="font-medium">
                    {selectedVehicle ? `${selectedVehicle.name} (${selectedVehicle.capacity} m³)` : '-'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Date et horaire</span>
                  <span className="font-medium">
                    {watchDate ? new Date(watchDate).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    }) : '-'}{' '}
                    • {watchTimeSlot || '-'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Manutentionnaires</span>
                  <span className="font-medium">{watchHandlers}</span>
                </div>
                
                <div className="flex justify-between pt-2 text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>En confirmant votre réservation, vous acceptez nos conditions générales de service et notre politique de confidentialité.</p>
            </div>
          </div>
        )}
        
        {/* Boutons de navigation */}
        <div className="flex justify-between mt-8">
          {step > STEPS.SERVICE_TYPE ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Retour
            </button>
          ) : (
            <div></div> // Placeholder pour maintenir le flex-justify
          )}
          
          {step < STEPS.RECAP ? (
            <button
                type="button"
                onClick={nextStep}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg flex items-center"
            >
                Suivant
                <ChevronRight className="h-5 w-5 ml-1" />
            </button>
            ) : (
            <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg"
            >
                {loading ? 'Traitement en cours...' : 'Confirmer et payer'}
            </button>
            )}
        </div>
        </form>
    </div>
    );
}