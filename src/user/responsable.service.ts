import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schema/user.schema';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResponsableService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createResponsable(dto: CreateResponsableDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newResponsable = new this.userModel({
      ...dto,
      password: hashedPassword,
      role: UserRole.RESPONSABLE,
    });

    return newResponsable.save();
  }
}


















/*
@Get('profile')
getResponsableProfile()

@Patch('profile')
updateResponsableProfile()

@Get('assigned-bookings')
getAssignedBookings()

@Post('check-in/:bookingId')
confirmGuestCheckIn()

@Post('notes')
addInternalNote()

@Patch('booking/:id/status')
updateBookingStatus() // approved, rejected, etc.


*/