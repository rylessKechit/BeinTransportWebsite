// frontend/src/components/ui/AddressAutocomplete.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import useGoogleMaps from '../../hooks/useGoogleMaps';

export default function AddressAutocomplete({ 
  label, 
  placeholder = "Tapez votre adresse...", 
  value = {},
  onChange,
  required = false,
  error,
  className = ''
}) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  
  const { isLoaded } = useGoogleMaps();

  // Initialiser les services Google Maps
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      // Créer un div temporaire pour le service Places
      const div = document.createElement('div');
      const map = new window.google.maps.Map(div);
      placesService.current = new window.google.maps.places.PlacesService(map);
    }
  }, [isLoaded]);

  // Mettre à jour l'input si la valeur externe change
  useEffect(() => {
    if (value.street && value.city && value.postalCode) {
      setInputValue(`${value.street}, ${value.postalCode} ${value.city}`);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);

    if (inputValue.length > 2 && autocompleteService.current) {
      // Rechercher des prédictions d'adresses
      autocompleteService.current.getPlacePredictions({
        input: inputValue,
        componentRestrictions: { country: 'FR' }, // Limiter à la France
        types: ['address']
      }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      });
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handlePredictionClick = (prediction) => {
    if (!placesService.current) return;

    // Obtenir les détails de l'adresse sélectionnée
    placesService.current.getDetails({
      placeId: prediction.place_id,
      fields: ['address_components', 'formatted_address', 'geometry']
    }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        // Parser les composants de l'adresse
        const addressComponents = place.address_components;
        const address = {
          street: '',
          city: '',
          postalCode: '',
          country: 'France',
          formatted_address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        };

        // Extraire les informations nécessaires
        addressComponents.forEach(component => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            address.street = component.long_name + ' ';
          } else if (types.includes('route')) {
            address.street += component.long_name;
          } else if (types.includes('locality')) {
            address.city = component.long_name;
          } else if (types.includes('postal_code')) {
            address.postalCode = component.long_name;
          }
        });

        // Nettoyer l'adresse de rue
        address.street = address.street.trim();

        setInputValue(place.formatted_address);
        setShowPredictions(false);
        
        if (onChange) {
          onChange(address);
        }
      }
    });
  };

  const handleBlur = () => {
    // Délai pour permettre le clic sur une prédiction
    setTimeout(() => {
      setShowPredictions(false);
    }, 200);
  };

  if (!isLoaded) {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            disabled
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="Chargement de Google Maps..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
          className={`block w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-purple-500 focus:border-purple-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          required={required}
        />
        
        {/* Liste des prédictions */}
        {showPredictions && predictions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => handlePredictionClick(prediction)}
              >
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{prediction.structured_formatting.main_text}</p>
                    <p className="text-sm text-gray-500">{prediction.structured_formatting.secondary_text}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}