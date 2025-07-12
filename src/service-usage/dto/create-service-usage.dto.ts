// dto/create-service-usage.dto.ts
import { IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceUsageDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  responsable: string;

  @IsMongoId()
  service: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
