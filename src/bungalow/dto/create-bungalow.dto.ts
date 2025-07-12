import { IsString, IsNumber, IsEnum, IsArray, IsObject, IsBoolean, Min } from 'class-validator';

export class CreateBungalowDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsEnum(['deluxe', 'family', 'romantic', 'cozy'])
  type: string;

  @IsString()
  size: string;

  @IsNumber()
  @Min(1)
  bedrooms: number;

  @IsNumber()
  @Min(1)
  bathrooms: number;

  @IsArray()
  features: string[];

  @IsArray()
  images: string[];

  @IsString()
  mainImage: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsArray()
  amenities: string[];

  @IsString()
  location: string;

  @IsString()
  viewType: string;

  @IsNumber()
  @Min(1)
  maxOccupancy: number;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(0)
  weekendPrice: number;

  @IsObject()
  seasonalPricing: Record<string, any>;

  @IsBoolean()
  isActive: boolean;
}