import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType, RecipientGroup } from './schemas/notification.schema';

interface SendNotificationDto {
  type: NotificationType;
  recipientGroup: RecipientGroup;
  specificGuestId?: string;
  title: string;
  message: string;
  isUrgent?: boolean;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) 
    private notificationModel: Model<NotificationDocument>
  ) {}

  async sendNotification(dto: SendNotificationDto): Promise<NotificationDocument> {
    try {
      // Validate specificGuestId requirement
      if (dto.recipientGroup === RecipientGroup.SPECIFIC_GUEST && !dto.specificGuestId) {
        throw new Error('specificGuestId is required when recipientGroup is SPECIFIC_GUEST');
      }

      // Create notification document
      const notification = new this.notificationModel({
        type: dto.type,
        recipientGroup: dto.recipientGroup,
        specificGuestId: dto.specificGuestId,
        title: dto.title,
        message: dto.message,
        isUrgent: dto.isUrgent ?? false,
      });

      // Save notification to database
      const savedNotification = await notification.save();
      
      return savedNotification;
    } catch (error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}