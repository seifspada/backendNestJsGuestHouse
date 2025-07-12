import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './schemas/booking.schema';
import { User } from '../user/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }
 @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.bookingService.remove(id);
  }

 
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/accept')
  async accept(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.acceptBooking(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/confirm')
  async confirm(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.confirmBooking(id);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/reject')
  @HttpCode(204)
  async reject(@Param('id') id: string): Promise<void> {
    await this.bookingService.rejectBooking(id);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/no-show')
  async markNoShow(@Param('id') id: string): Promise<{ message: string }> {
    return this.bookingService.markNoShow(id);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users/pending')
async getUsersWithPendingBookings(): Promise<User[]> {
  return this.bookingService.findUsersWithPendingBookings();
}

@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users/confirmed')
  async getUsersWithConfirmedBookings(): Promise<User[]> {
    return this.bookingService.findUsersWithConfirmedBookings();
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users/accepted')
async getUsersWithAcceptedBookings(): Promise<User[]> {
  return this.bookingService.findUsersWithAcceptedBookings();
}

@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get('bungalow/:id/booked-dates')
  async getBookedDates(
    @Param('id') bungalowId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<string[]> {
    return this.bookingService.getBookedDates(bungalowId, startDate, endDate);
  }
}
