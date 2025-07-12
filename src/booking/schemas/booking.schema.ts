import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'cancelled',
  CONFIRMED = 'confirmed',
  NO_SHOW = 'no-show',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bungalow', required: true })
  bungalowId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  bookingReference: string;

  @Prop({ required: true, type: Date })
  checkInDate: Date;

  @Prop({ required: true, type: Date })
  checkOutDate: Date;

  @Prop({ required: true })
  numberOfNights: number;

  @Prop({ required: true })
  numberOfAdults: number;

  @Prop({ required: true })
  numberOfChildren: number;

  @Prop({ required: true })
  totalGuests: number;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  finalAmount: number;

  @Prop({ 
    required: true, 
    enum: Object.values(BookingStatus), 
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Prop({ default: '' })
  guestNotes: string;

  @Prop({ default: '' })
  adminNotes: string;

  @Prop({ type: Date, default: () => new Date() })
  bookedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
