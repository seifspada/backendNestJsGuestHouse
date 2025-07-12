import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { Bungalow, BungalowDocument } from '../bungalow/schemas/bungalow.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Bungalow.name) private bungalowModel: Model<BungalowDocument>,
  ) {}

async create(createBookingDto: CreateBookingDto): Promise<Booking> {
  const user = await this.userModel.findById(createBookingDto.userId).exec();
  if (!user) throw new NotFoundException(`User with ID ${createBookingDto.userId} not found`);

  const bungalow = await this.bungalowModel.findById(createBookingDto.bungalowId).exec();
  if (!bungalow) throw new NotFoundException(`Bungalow with ID ${createBookingDto.bungalowId} not found`);
  if (!bungalow.isAvailable) throw new BadRequestException(`Bungalow is not available`);

  const checkInDate = new Date(createBookingDto.checkInDate);
  const checkOutDate = new Date(createBookingDto.checkOutDate);
  if (checkInDate >= checkOutDate)
    throw new BadRequestException('Check-in date must be before check-out date');

  const numberOfNights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalGuests = createBookingDto.numberOfAdults + createBookingDto.numberOfChildren;
  if (createBookingDto.totalGuests !== totalGuests) {
    throw new BadRequestException(`Total guests do not match adults + children`);
  }

  if (totalGuests > bungalow.maxOccupancy) {
    throw new BadRequestException(`Total guests exceed bungalow max occupancy`);
  }

  const bookingReference = `BOOK-${uuidv4().slice(0, 8).toUpperCase()}`;
  const existingBooking = await this.bookingModel.findOne({ bookingReference }).exec();
  if (existingBooking) {
    throw new BadRequestException(`Booking reference ${bookingReference} already exists`);
  }

  const bookedAt = new Date();

  const booking = new this.bookingModel({
    userId: createBookingDto.userId,
    bungalowId: createBookingDto.bungalowId,
    checkInDate,
    checkOutDate,
    numberOfNights,
    numberOfAdults: createBookingDto.numberOfAdults,
    numberOfChildren: createBookingDto.numberOfChildren,
    totalGuests,
    basePrice: createBookingDto.basePrice,
    totalPrice: createBookingDto.totalPrice,
    finalAmount: createBookingDto.finalAmount,
    bookingReference,
    guestNotes: createBookingDto.guestNotes ?? '',
    adminNotes: '',
    status: BookingStatus.PENDING,
    bookedAt,
  });

  return booking.save();
}

  async updateBookingStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const validStatuses = [
      BookingStatus.ACCEPTED,
      BookingStatus.REJECTED,
      BookingStatus.CONFIRMED,
    ];

    if (!validStatuses.includes(dto.status as BookingStatus)) {
      throw new BadRequestException(`Invalid status: ${dto.status}`);
    }

    if (dto.status === BookingStatus.REJECTED) {
      const deleted = await this.bookingModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException(`Booking with ID ${id} not found`);
      throw new BadRequestException(`Booking rejected and deleted`);
    }

    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    ).exec();

    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }

  async acceptBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, { status: BookingStatus.ACCEPTED });
  }

  async confirmBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, { status: BookingStatus.CONFIRMED });
  }

  async rejectBooking(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Booking with ID ${id} not found`);
  }

  async markNoShow(id: string): Promise<{ message: string }> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Booking with ID ${id} not found`);
    return { message: `Booking marked as no-show and deleted.` };
  }

  async findUsersWithPendingBookings(): Promise<User[]> {
    const userIds = await this.bookingModel
      .find({ status: BookingStatus.PENDING })
      .distinct('userId')
      .exec();
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async findUsersWithConfirmedBookings(): Promise<User[]> {
    const userIds = await this.bookingModel
      .find({ status: BookingStatus.CONFIRMED })
      .distinct('userId')
      .exec();
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async findUsersWithAcceptedBookings(): Promise<User[]> {
  // Récupérer les userId des bookings dont le statut est 'accepted'
  const userIds = await this.bookingModel
    .find({ status: BookingStatus.ACCEPTED })
    .distinct('userId')
    .exec();

  // Trouver les utilisateurs correspondants à ces userIds
  return this.userModel.find({ _id: { $in: userIds } }).exec();
}


  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }

  async remove(id: string): Promise<{ message: string }> {
    const booking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return { message: `Booking deleted successfully.` };
  }

  async getBookedDates(bungalowId: string, startDate?: string, endDate?: string): Promise<string[]> {
    const bungalow = await this.bungalowModel.findById(bungalowId).exec();
    if (!bungalow) throw new NotFoundException(`Bungalow not found`);

    const query: any = {
      bungalowId,
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use ISO 8601.');
      }

      if (start >= end) {
        throw new BadRequestException('startDate must be before endDate.');
      }

      query.$or = [
        { checkInDate: { $lte: end, $gte: start } },
        { checkOutDate: { $lte: end, $gte: start } },
        { checkInDate: { $lte: start }, checkOutDate: { $gte: end } },
      ];
    }

    const bookings = await this.bookingModel.find(query).exec();
    const bookedDates = new Set<string>();

    bookings.forEach((booking) => {
      const currentDate = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);
      while (currentDate < end) {
        bookedDates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Array.from(bookedDates).sort();
  }

 

}
