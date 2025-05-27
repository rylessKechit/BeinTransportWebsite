// frontend/src/hooks/useGoogleMaps.js
'use client';

import { useState, useEffect, useCallback } from 'react';

export default function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si Google Maps est déjà chargé
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Charger Google Maps API
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Callback global pour initialiser Google Maps
      window.initGoogleMaps = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setError('Erreur lors du chargement de Google Maps');
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      // Nettoyer le callback global
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, []);

  // Fonction pour calculer la distance entre deux points
  const calculateDistance = useCallback((origin, destination) => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google) {
        reject(new Error('Google Maps non chargé'));
        return;
      }

      const service = new window.google.maps.DistanceMatrixService();
      
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
          const element = response.rows[0].elements[0];
          resolve({
            distance: element.distance.value / 1000, // Convertir en km
            duration: element.duration.value / 60, // Convertir en minutes
            distanceText: element.distance.text,
            durationText: element.duration.text
          });
        } else {
          reject(new Error('Impossible de calculer la distance'));
        }
      });
    });
  }, [isLoaded]);

  // Fonction pour géocoder une adresse
  const geocodeAddress = useCallback((address) => {
    return new Promise((resolve, reject) => {
      if (!isLoaded || !window.google) {
        reject(new Error('Google Maps non chargé'));
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address
          });
        } else {
          reject(new Error('Adresse non trouvée'));
        }
      });
    });
  }, [isLoaded]);

  return {
    isLoaded,
    error,
    calculateDistance,
    geocodeAddress
  };
}