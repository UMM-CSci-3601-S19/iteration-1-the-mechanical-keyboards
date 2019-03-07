export interface Ride {
  _id: string;
  notes: string;
  driver: string;
  seatsAvailable: number;
  origin: string;
  destination: string;
  departureTime: Date;
}
