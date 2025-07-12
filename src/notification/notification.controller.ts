import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createNotification(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.sendNotification(dto);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('recent')
async getRecentNotifications() {
  return this.notificationService.getRecentNotifications();
}
}