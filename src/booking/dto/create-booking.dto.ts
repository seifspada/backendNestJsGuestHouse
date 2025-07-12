import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  bungalowId: string;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsNumber()
  @Min(0)
  numberOfAdults: number;

  @IsNumber()
  @Min(0)
  numberOfChildren: number;

  @IsNumber()
  @Min(1)
  totalGuests: number;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  totalPrice: number;

  @IsNumber()
  finalAmount: number;

  @IsString()
  guestNotes?: string;

  // ❌ Remove the following if you're generating them automatically:
  // bookingReference
  // status
  // numberOfNights
  // bookedAt
}
