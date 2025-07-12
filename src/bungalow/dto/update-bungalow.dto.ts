import { PartialType } from '@nestjs/mapped-types';
import { CreateBungalowDto } from './create-bungalow.dto';

export class UpdateBungalowDto extends PartialType(CreateBungalowDto) {}