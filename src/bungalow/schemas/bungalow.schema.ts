import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BungalowDocument = Bungalow & Document;

@Schema({ timestamps: true })
export class Bungalow {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  capacity: number;

  @Prop({ enum: ['deluxe', 'family', 'romantic', 'cozy'], required: true })
  type: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true, type: Number })
  bedrooms: number;

  @Prop({ required: true, type: Number })
  bathrooms: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  mainImage: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  viewType: string;

  @Prop({ required: true, type: Number })
  maxOccupancy: number;

  @Prop({ required: true, type: Number })
  basePrice: number;

  @Prop({ required: true, type: Number })
  weekendPrice: number;

  @Prop({ type: Object, default: {} })
  seasonalPricing: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;
}

export const BungalowSchema = SchemaFactory.createForClass(Bungalow);