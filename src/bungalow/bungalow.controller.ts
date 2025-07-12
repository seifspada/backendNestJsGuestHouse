import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { BungalowService } from './bungalow.service';
import { CreateBungalowDto } from './dto/create-bungalow.dto';
import { UpdateBungalowDto } from './dto/update-bungalow.dto';
import { Bungalow } from './schemas/bungalow.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';

@Controller('bungalow')
export class BungalowController {
  constructor(private readonly bungalowService: BungalowService) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
  @Post()
  create(@Body() createBungalowDto: CreateBungalowDto): Promise<Bungalow> {
    return this.bungalowService.create(createBungalowDto);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get()
  findAll(): Promise<Bungalow[]> {
    return this.bungalowService.findAll();
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get('available')
  async getAvailableBungalows(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Bungalow[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('Both startDate and endDate are required.');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Use ISO 8601 (YYYY-MM-DD).');
    }

    if (start >= end) {
      throw new BadRequestException('startDate must be before endDate.');
    }

    return this.bungalowService.findAvailableBungalows(start, end);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Bungalow> {
    return this.bungalowService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBungalowDto: UpdateBungalowDto): Promise<Bungalow> {
    return this.bungalowService.update(id, updateBungalowDto);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.bungalowService.remove(id);
  }
}