/**
 * Frontend Mock Data Generator
 * 
 * Provides fallback mock data when backend requests fail or return no results
 * This ensures the application always has data to display, improving user experience
 */

import { nanoid } from 'nanoid';

// Mock provider types and specialties for randomization
const PROVIDER_TYPES = ['hospital', 'doctor', 'clinic', 'pharmacy', 'specialist'];
const SPECIALTIES = [
  'Primary Care', 'Family Medicine', 'Internal Medicine', 'Pediatrics', 
  'Cardiology', 'Dermatology', 'Orthopedics', 'Gynecology', 'Neurology', 
  'Oncology', 'Ophthalmology', 'Psychiatry', 'Radiology'
];

// Common insurance providers
const INSURANCES = [
  'Blue Cross', 'Aetna', 'UnitedHealthcare', 'Cigna', 'Humana', 
  'Kaiser Permanente', 'Medicare', 'Medicaid', 'Tricare'
];

// Example provider names for realistic mock data
const PROVIDER_NAMES = [
  'City General Hospital', 'Highland Medical Center', 'Riverside Clinic',
  'Bay Area Health', 'Pacific Medical Group', 'Golden State Healthcare',
  'Wellness Partners', 'Community Care Center', 'Family Health Associates',
  'Integrated Medical Services', 'Regional Healthcare Center', 'Premier Health',
  'Advanced Medical Care', 'Modern Health Partners', 'Dynamic Care Clinic'
];

// Example streets for addresses
const STREETS = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Cedar Boulevard',
  'Washington Street', 'Park Avenue', 'Pine Road', 'Willow Lane',
  'Forest Drive', 'Lake Street', 'River Road', 'Mountain View',
  'Sunset Boulevard', 'Ocean Avenue', 'Valley Drive'
];

// Example cities
const CITIES = ['San Francisco', 'Oakland', 'San Jose', 'Palo Alto', 'Mountain View', 'Berkeley'];

// Random number generator in a range
const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get random item from array
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate random phone number
const generatePhoneNumber = () => {
  return `(${randomInRange(100, 999)}) ${randomInRange(100, 999)}-${randomInRange(1000, 9999)}`;
};

// Generate random opening hours
const generateOpeningHours = () => {
  const openHour = randomInRange(7, 10);
  const closeHour = randomInRange(16, 20);
  return [
    `${openHour}:00 AM - ${closeHour - 12}:00 PM`,
    '9:00 AM - 5:00 PM',
    '8:30 AM - 4:30 PM'
  ];
};

// Calculate distance between two coordinates (haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance * 0.621371; // Convert to miles
};

// Format distance as string
const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} miles`;
};

// Interface for mock provider
export interface MockProvider {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  latitude: number;
  longitude: number;
  rating: number;
  priceLevel: string;
  types: string[];
  type: string;
  distance: string;
  price: string;
  reviews: any[];
  specialties: string[];
  insurances: string[];
  website: string;
  phoneNumber: string;
  openingHours: string[];
  isMockData: boolean;
}

/**
 * Generate mock providers around a given location
 * @param lat - Latitude of center point
 * @param lng - Longitude of center point
 * @param count - Number of providers to generate
 * @param type - Provider type filter (optional)
 * @param specialty - Provider specialty filter (optional)
 * @returns Array of mock providers
 */
export const generateMockProviders = (
  lat: number,
  lng: number,
  count: number = 10,
  type?: string,
  specialty?: string
): MockProvider[] => {
  const providers: MockProvider[] = [];
  
  // Use provided type or random types if not specified
  const providerTypes = type && type !== 'any' ? [type] : PROVIDER_TYPES;
  
  // Use provided specialty or random specialties if not specified
  const providerSpecialties = specialty && specialty !== 'any' ? [specialty] : SPECIALTIES;
  
  for (let i = 0; i < count; i++) {
    // Create random offsets for lat/lng (within ~3 miles)
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    const providerLat = lat + latOffset;
    const providerLng = lng + lngOffset;
    
    // Calculate actual distance
    const distance = calculateDistance(lat, lng, providerLat, providerLng);
    
    // Generate random provider type and specialty
    const providerType = randomItem(providerTypes);
    const providerSpecialty = randomItem(providerSpecialties);
    
    // Create the mock provider
    const provider: MockProvider = {
      id: `mock-${nanoid(8)}`,
      name: randomItem(PROVIDER_NAMES),
      address: `${randomInRange(100, 9999)} ${randomItem(STREETS)}, ${randomItem(CITIES)}, CA`,
      lat: providerLat,
      lng: providerLng,
      latitude: providerLat,
      longitude: providerLng,
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      priceLevel: String(randomInRange(1, 3)),
      types: [providerType],
      type: providerType,
      distance: formatDistance(distance),
      price: "$".repeat(randomInRange(1, 3)),
      reviews: [],
      specialties: [providerSpecialty],
      insurances: [randomItem(INSURANCES)],
      website: "",
      phoneNumber: generatePhoneNumber(),
      openingHours: generateOpeningHours(),
      isMockData: true
    };
    
    providers.push(provider);
  }
  
  // Sort by distance
  return providers.sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    return distA - distB;
  });
};

/**
 * Generate a fallback set of mock providers if all other methods fail
 */
export const getFallbackProviders = (
  centerLat: number = 37.7749,
  centerLng: number = -122.4194
): MockProvider[] => {
  return generateMockProviders(centerLat, centerLng, 10);
};
