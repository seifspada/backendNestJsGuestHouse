import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  EVENT = 'event',
  PROMOTION = 'promotion',
  SERVICE_UPDATE = 'service_update',
  RESERVATION = 'reservation',
  WELCOME = 'welcome',
  GENERAL = 'general',
}

export enum RecipientGroup {
  ALL_GUESTS = 'all_guests',
  CURRENT_GUESTS = 'current_guests',
  SPECIFIC_GUEST = 'specific_guest',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true, enum: RecipientGroup })
  recipientGroup: RecipientGroup;

  @Prop({ required: function () { return this.recipientGroup === RecipientGroup.SPECIFIC_GUEST; } })
  specificGuestId?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isUrgent: boolean;

    // ✅ Add this to fix the createdAt typing issue
  @Prop()
  createdAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);