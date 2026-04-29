export interface Airport {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export const AIRPORTS: Airport[] = [
  { id: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta', country: 'Indonesia', lat: -6.1256, lng: 106.6558 },
  { id: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { id: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', lat: 35.5494, lng: 139.7798 },
  { id: 'DXB', name: 'Dubai', city: 'Dubai', country: 'UAE', lat: 25.2532, lng: 55.3657 },
  { id: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', lat: 51.4700, lng: -0.4543 },
  { id: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', lat: 40.6413, lng: -73.7781 },
  { id: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', lat: -33.9461, lng: 151.1772 },
  { id: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { id: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', lat: 50.0379, lng: 8.5622 },
  { id: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA', lat: 33.9416, lng: -118.4085 },
];
