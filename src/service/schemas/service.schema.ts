import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
  spring?: boolean;
  summer?: boolean;
  autumn?: boolean;
  winter?: boolean;
}


@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, enum: ServiceType, default: ServiceType.ACTIVITY })
  type: ServiceType;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  duration: number;

  @Prop({ required: true, min: 1 })
  maxCapacity: number;

  @Prop({ required: true, min: 1 })
  minParticipants: number;

  @Prop({ type: Object, required: true })
  ageRestriction: AgeRestriction;

  @Prop({ type: String, enum: DifficultyLevel, default: DifficultyLevel.EASY })
  difficulty: DifficultyLevel;

  @Prop({ type: [String], default: [] })
  equipment: string[];

  @Prop({ required: true, trim: true })
  location: string;

    @Prop({ required: true, trim: true })
  position: string;

  @Prop({ type: Object, required: true })
  operatingHours: OperatingHours;

  @Prop({ type: Object, required: true })
  seasonalAvailability: SeasonalAvailability;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
