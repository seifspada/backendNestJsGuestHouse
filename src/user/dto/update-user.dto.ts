import { IsString, IsOptional, IsEmail, IsDateString, IsEnum } from 'class-validator';
import { UserRole } from '../schema/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  dateNaissance?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be admin, responsable, or user' })
  role?: UserRole;
}