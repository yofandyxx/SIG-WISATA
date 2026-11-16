export type Category = string;
export type FacilityType = string;
export type TouristSpot = {
  id: number; name: string; category: Category; address: string; description: string;
  ticketPrice: number; openingHours: string; latitude: number; longitude: number;
  facilities: FacilityType[]; photo?: string;
};
export type Role = 'Admin' | 'Pengguna';
