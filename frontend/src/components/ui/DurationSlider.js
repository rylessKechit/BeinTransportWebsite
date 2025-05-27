// frontend/src/components/ui/DurationSlider.js
'use client';

import { useState, useEffect } from 'react';
import { Clock, Info } from 'lucide-react';

export default function DurationSlider({ 
  value = 20, // Durée en minutes (20 min par défaut)
  onChange,
  className = ''
}) {
  const [duration, setDuration] = useState(value);
  
  // Contraintes
  const MIN_DURATION = 20; // 20 minutes minimum
  const MAX_DURATION = 300; // 5 heures maximum (300 minutes)
  const STEP = 15; // Pas de 15 minutes
  const FREE_DURATION = 20; // 20 premières minutes gratuites
  const PRICE_PER_STEP = 5; // 5€ par tranche de 15 minutes

  useEffect(() => {
    setDuration(value);
  }, [value]);

  const handleSliderChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    
    if (onChange) {
      onChange(newDuration);
    }
  };

  const handlePresetClick = (presetDuration) => {
    setDuration(presetDuration);
    if (onChange) {
      onChange(presetDuration);
    }
  };

  // Calculer le prix en fonction de la durée
  const calculatePrice = (minutes) => {
    if (minutes <= FREE_DURATION) {
      return 0;
    }
    
    const chargeableMinutes = minutes - FREE_DURATION;
    const steps = Math.ceil(chargeableMinutes / STEP);
    return steps * PRICE_PER_STEP;
  };

  // Formatage de la durée pour l'affichage
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  };

  // Générer les options de durée par pas de 15 minutes
  const generateOptions = () => {
    const options = [];
    for (let i = MIN_DURATION; i <= MAX_DURATION; i += STEP) {
      options.push(i);
    }
    return options;
  };

  // Durées prédéfinies communes
  const presetDurations = [20, 60, 120, 180, 240]; // 20min, 1h, 2h, 3h, 4h

  const price = calculatePrice(duration);
  const options = generateOptions();

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Durée de réservation
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">
              {formatDuration(duration)}
            </p>
            <p className="text-sm text-gray-500">
              {price === 0 ? 'Gratuit' : `${price}€`}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <input
            type="range"
            min={MIN_DURATION}
            max={MAX_DURATION}
            step={STEP}
            value={duration}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((FREE_DURATION - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)) * 100}%, #8b5cf6 ${((FREE_DURATION - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)) * 100}%, #8b5cf6 100%)`
            }}
          />
          
          {/* Marqueurs sur le slider */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatDuration(MIN_DURATION)}</span>
            <span className="text-green-600 font-medium">Gratuit</span>
            <span>{formatDuration(MAX_DURATION)}</span>
          </div>
        </div>
      </div>

      {/* Durées prédéfinies */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Durées courantes</h4>
        <div className="grid grid-cols-5 gap-2">
          {presetDurations.map((presetDuration) => (
            <button
              key={presetDuration}
              type="button"
              onClick={() => handlePresetClick(presetDuration)}
              className={`p-2 text-xs border rounded-lg transition-colors ${
                duration === presetDuration 
                  ? 'border-purple-600 bg-purple-50 text-purple-600' 
                  : 'border-gray-200 hover:border-purple-300 text-gray-700'
              }`}
            >
              <div className="font-medium">{formatDuration(presetDuration)}</div>
              <div className="text-xs opacity-75">
                {calculatePrice(presetDuration) === 0 ? 'Gratuit' : `${calculatePrice(presetDuration)}€`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Informations de tarification */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h4 className="font-medium mb-1">Tarification de la durée</h4>
            <ul className="space-y-1">
              <li>• Les 20 premières minutes sont <strong>gratuites</strong></li>
              <li>• Au-delà : <strong>5€ par tranche de 15 minutes</strong> commencée</li>
              <li>• Durée minimum : 20 minutes</li>
              <li>• Durée maximum : 5 heures</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exemple de calcul */}
      {duration > FREE_DURATION && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Détail du calcul</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Durée totale:</span>
              <span>{formatDuration(duration)}</span>
            </div>
            <div className="flex justify-between">
              <span>Durée gratuite:</span>
              <span>{formatDuration(FREE_DURATION)}</span>
            </div>
            <div className="flex justify-between">
              <span>Durée facturée:</span>
              <span>{formatDuration(duration - FREE_DURATION)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nombre de tranches de 15min:</span>
              <span>{Math.ceil((duration - FREE_DURATION) / STEP)}</span>
            </div>
            <div className="flex justify-between font-medium border-t border-gray-300 pt-1 mt-2">
              <span>Prix total:</span>
              <span>{price}€</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}