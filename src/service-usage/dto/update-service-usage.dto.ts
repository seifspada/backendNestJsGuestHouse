import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceUsageDto } from './create-service-usage.dto';

export class UpdateServiceUsageDto extends PartialType(CreateServiceUsageDto) {}
