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
  { id: 'PKX', name: 'Beijing Daxing', city: 'Beijing', country: 'China', lat: 39.5098, lng: 116.4105 },
  { id: 'PVG', name: 'Pudong Int.', city: 'Shanghai', country: 'China', lat: 31.1443, lng: 121.8083 },

  // Middle East
  { id: 'DXB', name: 'Dubai Int.', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657 },
  { id: 'DOH', name: 'Hamad Int.', city: 'Doha', country: 'Qatar', lat: 25.2731, lng: 51.6080 },
  { id: 'JED', name: 'King Abdulaziz', city: 'Jeddah', country: 'Saudi Arabia', lat: 21.6796, lng: 39.1565 },
  { id: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey', lat: 41.2590, lng: 28.7404 },
  { id: 'AUH', name: 'Abu Dhabi Int.', city: 'Abu Dhabi', country: 'UAE', lat: 24.4330, lng: 54.6511 },

  // Europe
  { id: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543 },
  { id: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { id: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622 },
  { id: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', lat: 52.3105, lng: 4.7683 },
  { id: 'MAD', name: 'Adolfo Suárez', city: 'Madrid', country: 'Spain', lat: 40.4983, lng: -3.5676 },
  { id: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italy', lat: 41.7999, lng: 12.2462 },
  { id: 'SVO', name: 'Sheremetyevo', city: 'Moscow', country: 'Russia', lat: 55.9726, lng: 37.4146 },
  { id: 'MUC', name: 'Munich', city: 'Munich', country: 'Germany', lat: 48.3538, lng: 11.7861 },
  { id: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'Switzerland', lat: 47.4581, lng: 8.5555 },

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
  { id: 'SFO', name: 'San Francisco Int.', city: 'San Francisco', country: 'USA', lat: 37.6213, lng: -122.3790 },
  { id: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle', country: 'USA', lat: 47.4502, lng: -122.3088 },
  { id: 'MIA', name: 'Miami Int.', city: 'Miami', country: 'USA', lat: 25.7959, lng: -80.2870 },

  // Africa
  { id: 'JNB', name: 'O. R. Tambo', city: 'Johannesburg', country: 'South Africa', lat: -26.1367, lng: 28.2460 },
  { id: 'CAI', name: 'Cairo Int.', city: 'Cairo', country: 'Egypt', lat: 30.1219, lng: 31.4056 },
  { id: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', lat: 6.5774, lng: 3.3215 },
  { id: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', lat: -1.3192, lng: 36.9278 },
  { id: 'ADD', name: 'Bole Int.', city: 'Addis Ababa', country: 'Ethiopia', lat: 8.9779, lng: 38.7993 },

  // Oceania
  { id: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9461, lng: 151.1772 },
  { id: 'MEL', name: 'Melbourne', city: 'Melbourne', country: 'Australia', lat: -37.6690, lng: 144.8410 },
  { id: 'AKL', name: 'Auckland', city: 'Auckland', country: 'New Zealand', lat: -37.0082, lng: 174.7850 },
  { id: 'PER', name: 'Perth', city: 'Perth', country: 'Australia', lat: -31.9403, lng: 115.9672 },

  { id: 'MNL', name: 'Ninoy Aquino', city: 'Manila', country: 'Philippines', lat: 14.5086, lng: 121.0198 },
  { id: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8188, lng: 106.6519 },
  { id: 'HAN', name: 'Noi Bai', city: 'Hanoi', country: 'Vietnam', lat: 21.2187, lng: 105.8042 },
  { id: 'TPE', name: 'Taoyuan Int.', city: 'Taipei', country: 'Taiwan', lat: 25.0797, lng: 121.2342 },
  { id: 'KIX', name: 'Kansai Int.', city: 'Osaka', country: 'Japan', lat: 34.4347, lng: 135.2440 },
  { id: 'MAN', name: 'Manchester', city: 'Manchester', country: 'UK', lat: 53.3537, lng: -2.2750 },
  { id: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'Spain', lat: 41.2974, lng: 2.0833 },
  { id: 'LIS', name: 'Humberto Delgado', city: 'Lisbon', country: 'Portugal', lat: 38.7742, lng: -9.1342 },
  { id: 'ARN', name: 'Arlanda', city: 'Stockholm', country: 'Sweden', lat: 59.6519, lng: 17.9186 },
  { id: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', lat: 55.6180, lng: 12.6508 },
  { id: 'OSL', name: 'Gardermoen', city: 'Oslo', country: 'Norway', lat: 60.1939, lng: 11.1004 },
  { id: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', lat: 60.3172, lng: 24.9633 },
  { id: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', lat: 53.4213, lng: -6.2701 },
  { id: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', country: 'USA', lat: 33.4353, lng: -112.0078 },
  { id: 'LAS', name: 'Harry Reid', city: 'Las Vegas', country: 'USA', lat: 36.0840, lng: -115.1537 },
  { id: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', lat: 29.9902, lng: -95.3368 },
  { id: 'BOS', name: 'Logan', city: 'Boston', country: 'USA', lat: 42.3656, lng: -71.0096 },
  { id: 'YVR', name: 'Vancouver Int.', city: 'Vancouver', country: 'Canada', lat: 49.1951, lng: -123.1779 },
  { id: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', lat: -33.3929, lng: -70.7858 },
  { id: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', lat: -12.0219, lng: -77.1143 },
  { id: 'CMN', name: 'Mohammed V', city: 'Casablanca', country: 'Morocco', lat: 33.3675, lng: -7.5899 },
  { id: 'ALG', name: 'Houari Boumediene', city: 'Algiers', country: 'Algeria', lat: 36.6910, lng: 3.2154 },
  { id: 'DSS', name: 'Blaise Diagne', city: 'Dakar', country: 'Senegal', lat: 14.6708, lng: -17.0733 },
  { id: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.8090, lng: -43.2506 },
  { id: 'CHC', name: 'Christchurch', city: 'Christchurch', country: 'New Zealand', lat: -43.4894, lng: 172.5322 },
];
