// service-usage.controller.ts
import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ServiceUsageService } from './service-usage.service';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';

@Controller('service-usage')
export class ServiceUsageController {
  constructor(private readonly usageService: ServiceUsageService) {}
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Post()
  async create(@Body() dto: CreateServiceUsageDto) {
    return this.usageService.create(dto);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Get()
  async findAll() {
    return this.usageService.findAll();
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Get('user')
  async findByUser(@Query('userId') userId: string) {
    return this.usageService.findAllByUser(userId);
  }
}
