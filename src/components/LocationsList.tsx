
import React from 'react';
import { MapPin } from 'lucide-react';
import { PREDEFINED_ZONES } from './LocationZones';

export const LocationsList: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h4 className="text-lg font-semibold text-center text-gray-800 mb-4">
        Supported Locations
      </h4>
      
      <div className="grid grid-cols-1 gap-3">
        {PREDEFINED_ZONES.map((zone, index) => (
          <div 
            key={zone.id}
            className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <div className={`w-3 h-3 rounded-full mr-3 ${
              index === 0 ? 'bg-green-500' : 
              index === 1 ? 'bg-orange-500' : 
              'bg-blue-500'
            }`}></div>
            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-700 text-sm font-medium">
              {zone.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
