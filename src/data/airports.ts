export interface Airport {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export const AIRPORTS: Airport[] = [
  // Asia
  { id: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta', country: 'Indonesia', lat: -6.1256, lng: 106.6558 },
  { id: 'DPS', name: 'Ngurah Rai', city: 'Bali', country: 'Indonesia', lat: -8.7482, lng: 115.1670 },
  { id: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { id: 'KUL', name: 'Kuala Lumpur Int.', city: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7456, lng: 101.7099 },
  { id: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', lat: 13.6900, lng: 100.7501 },
  { id: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', lat: 35.5494, lng: 139.7798 },
  { id: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan', lat: 35.7647, lng: 140.3863 },
  { id: 'ICN', name: 'Incheon', city: 'Seoul', country: 'South Korea', lat: 37.4602, lng: 126.4407 },
  { id: 'PEK', name: 'Capital Int.', city: 'Beijing', country: 'China', lat: 40.0799, lng: 116.6031 },
  { id: 'HKG', name: 'Hong Kong Int.', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3080, lng: 113.9185 },
  { id: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', country: 'India', lat: 28.5562, lng: 77.1000 },
  { id: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', lat: 19.0896, lng: 72.8656 },

  // Middle East
  { id: 'DXB', name: 'Dubai Int.', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657 },
  { id: 'DOH', name: 'Hamad Int.', city: 'Doha', country: 'Qatar', lat: 25.2731, lng: 51.6080 },
  { id: 'JED', name: 'King Abdulaziz', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6796, lng: 39.1565 },
  { id: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey', lat: 41.2590, lng: 28.7404 },

  // Europe
  { id: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543 },
  { id: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { id: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622 },
  { id: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lng: 4.7683 },
  { id: 'MAD', name: 'Adolfo Suárez', city: 'Madrid', country: 'Spain', lat: 40.4983, lng: -3.5676 },
  { id: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italy', lat: 41.7999, lng: 12.2462 },
  { id: 'SVO', name: 'Sheremetyevo', city: 'Moscow', country: 'Russia', lat: 55.9726, lng: 37.4146 },

  // Americas
  { id: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781 },
  { id: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', lat: 33.9416, lng: -118.4085 },
  { id: 'ORD', name: 'O\'Hare', city: 'Chicago', country: 'USA', lat: 41.9742, lng: -87.9073 },
  { id: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA', lat: 33.6407, lng: -84.4277 },
  { id: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canada', lat: 43.6777, lng: -79.6248 },
  { id: 'MEX', name: 'Benito Juárez', city: 'Mexico City', country: 'Mexico', lat: 19.4361, lng: -99.0719 },
  { id: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brazil', lat: -23.4356, lng: -46.4731 },
  { id: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', lat: -34.8222, lng: -58.5358 },
  { id: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombia', lat: 4.7016, lng: -74.1469 },

  // Africa
  { id: 'JNB', name: 'O. R. Tambo', city: 'Johannesburg', country: 'South Africa', lat: -26.1367, lng: 28.2460 },
  { id: 'CAI', name: 'Cairo Int.', city: 'Cairo', country: 'Egypt', lat: 30.1219, lng: 31.4056 },
  { id: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', lat: 6.5774, lng: 3.3215 },
  { id: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lng: 36.9278 },

  // Oceania
  { id: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9461, lng: 151.1772 },
  { id: 'MEL', name: 'Melbourne', city: 'Melbourne', country: 'Australia', lat: -37.6690, lng: 144.8410 },
  { id: 'AKL', name: 'Auckland', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lng: 174.7850 },
];
