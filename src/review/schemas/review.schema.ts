import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ServiceType {
  RESTAURANT = 'RESTAURANT',
  GENERAL_EXPERIENCE = 'general_experience',
  ACTIVITY_SERVICE = 'activity_service',
  DINING_EXPERIENCE = 'dining_experience',
  ACCOMMODATION = 'accommodation',
}

@Schema()
export class Review extends Document {
  @Prop({ required: true, enum: ServiceType })
  serviceType: ServiceType;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true, min: 1, max: 5 })
  overallRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  qualityRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  serviceRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  valueRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  ambianceRating: number;

  @Prop({ required: true })
  reviewText: string;

  @Prop({ required: true })
  user: string;

  @Prop({ default: false })
  approved: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export type ReviewDocument = Review & Document;