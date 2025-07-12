import { ServiceType } from '../enums/service-type.enum';
import { DifficultyLevel } from '../enums/difficulty-level.enum';

export interface AgeRestriction {
  minAge: number;
  maxAge: number;
}

export interface OperatingHours {
  [key: string]: any;
}

export interface SeasonalAvailability {
  [key: string]: any;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  category: string;
  price: number;
  duration: number;
  maxCapacity: number;
  minParticipants: number;
  ageRestriction: AgeRestriction;
  difficulty: DifficultyLevel;
  equipment: string[];
  location: string;
  operatingHours: OperatingHours;
  seasonalAvailability: SeasonalAvailability;
  images: string[];
  isActive: boolean;
  requiresBooking: boolean;
  advanceBookingDays: number;
  cancellationPolicy: string;
  staffRequired: number;
  createdAt: Date;
  updatedAt: Date;
}