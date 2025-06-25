import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from '../../auth/dto/signup.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto extends PartialType(SignUpDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
