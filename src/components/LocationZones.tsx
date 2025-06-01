
export interface LocationZone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  radius: number; // in meters
  filterImage: string;
  description: string;
}

export const PREDEFINED_ZONES: LocationZone[] = [
  {
    id: 'central-park',
    name: 'Central Park, NYC',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    radius: 2000,
    filterImage: '/api/placeholder/400/400', // We'll use a semi-transparent overlay
    description: 'Beautiful Central Park memories'
  },
  {
    id: 'golden-gate',
    name: 'Golden Gate Bridge, SF',
    coordinates: { lat: 37.8199, lng: -122.4783 },
    radius: 1500,
    filterImage: '/api/placeholder/400/400',
    description: 'Golden Gate Bridge adventure'
  },
  {
    id: 'times-square',
    name: 'Times Square, NYC',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    radius: 500,
    filterImage: '/api/placeholder/400/400',
    description: 'Times Square excitement'
  },
  {
    id: 'paris',
    name: 'Paris, France',
    coordinates: { lat: 48.8861381, lng: 2.3353884 },
    radius: 500,
    filterImage: '/api/placeholder/400/400',
    description: 'Times Square excitement'
  }
];

export const isLocationInZone = (
  userLocation: { lat: number; lng: number },
  zone: LocationZone
): boolean => {
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    zone.coordinates.lat,
    zone.coordinates.lng
  );
  
  return distance <= zone.radius;
};

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

export const findMatchingZone = (
  userLocation: { lat: number; lng: number }
): LocationZone | null => {
  for (const zone of PREDEFINED_ZONES) {
    if (isLocationInZone(userLocation, zone)) {
      return zone;
    }
  }
  return null;
};
