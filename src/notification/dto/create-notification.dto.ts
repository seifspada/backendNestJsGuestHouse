import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, ValidateIf } from 'class-validator';
import { NotificationType, RecipientGroup } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsEnum(RecipientGroup)
  @IsNotEmpty()
  recipientGroup: RecipientGroup;

  @ValidateIf(o => o.recipientGroup === RecipientGroup.SPECIFIC_GUEST)
  @IsString()
  @IsNotEmpty()
  specificGuestId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;
}