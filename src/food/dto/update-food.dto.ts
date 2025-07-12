import { IsString, IsEnum, IsNumber, Min, Max, IsArray, IsObject, IsBoolean, IsOptional } from 'class-validator';
import { Category } from '../schemas/food.schema';

export class UpdateFoodDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ingredients?: string[];

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  spiceLevel?: number;

  @IsNumber()
  @IsOptional()
  preparationTime?: number;

  @IsObject()
  @IsOptional()
  availability?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    allDay: boolean;
  };

  @IsNumber()
  @IsOptional()
  popularRating?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}