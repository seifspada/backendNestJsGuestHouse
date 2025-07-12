import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bungalow, BungalowDocument } from './schemas/bungalow.schema';
import { Booking, BookingDocument } from '../booking/schemas/booking.schema';
import { CreateBungalowDto } from './dto/create-bungalow.dto';
import { UpdateBungalowDto } from './dto/update-bungalow.dto';
import { BookingStatus } from '../booking/schemas/booking.schema';

@Injectable()
export class BungalowService {
  constructor(
    @InjectModel(Bungalow.name) private bungalowModel: Model<BungalowDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBungalowDto: CreateBungalowDto): Promise<Bungalow> {
    const createdBungalow = new this.bungalowModel(createBungalowDto);
    return createdBungalow.save();
  }

  async findAll(): Promise<Bungalow[]> {
    return this.bungalowModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Bungalow> {
    const bungalow = await this.bungalowModel.findById(id).exec();
    if (!bungalow) {
      throw new NotFoundException(`Bungalow with ID ${id} not found`);
    }
    return bungalow;
  }

  async update(id: string, updateBungalowDto: UpdateBungalowDto): Promise<Bungalow> {
    const updatedBungalow = await this.bungalowModel
      .findByIdAndUpdate(id, { $set: updateBungalowDto }, { new: true })
      .exec();
    if (!updatedBungalow) {
      throw new NotFoundException(`Bungalow with ID ${id} not found`);
    }
    return updatedBungalow;
  }

  async remove(id: string): Promise<{ message: string }> {
    const bungalow = await this.bungalowModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .exec();
    if (!bungalow) {
      throw new NotFoundException(`Bungalow with ID ${id} not found`);
    }
    return { message: `Bungalow with ID ${id} has been successfully deleted` };
  }

  async findAvailableBungalows(startDate: Date, endDate: Date): Promise<Bungalow[]> {
    // Find bookings that overlap with the requested date range and are not cancelled
    const bookedBungalows = await this.bookingModel
      .find({
        status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACCEPTED] },
        $or: [
          { checkInDate: { $lte: endDate, $gte: startDate } },
          { checkOutDate: { $lte: endDate, $gte: startDate } },
          { checkInDate: { $lte: startDate }, checkOutDate: { $gte: endDate } },
        ],
      })
      .distinct('bungalowId')
      .exec();

    // Find bungalows that are active and not in the booked list
    return this.bungalowModel
      .find({
        isActive: true,
        isAvailable: true,
        _id: { $nin: bookedBungalows },
      })
      .exec();
  }
}