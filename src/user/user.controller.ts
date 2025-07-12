import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  SetMetadata,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponsableService } from './responsable.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateResponsableDto } from './dto/create-responsable.dto';
import { User } from './schema/user.schema';

interface UserRequest extends Request {
  user: { id: string; email: string; role: string };
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService ,
  private readonly responsableService: ResponsableService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: UserRequest) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: UserRequest) {
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.userService.findOne(id);
  }

 @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'user')
@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
  @Request() req: UserRequest,
) {
  if (req.user.role !== 'admin' && req.user.id !== id) {
    throw new ForbiddenException('You can only update your own profile');
  }
  const requestingUser = await this.userService.findOne(req.user.id); // Fetch full UserDocument
  return this.userService.update(id, updateUserDto, requestingUser);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post('responsable')
async createResponsable(@Body() dto: CreateResponsableDto): Promise<User> {
  return this.responsableService.createResponsable(dto);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: UserRequest) {
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    return this.userService.remove(id);
  }

}


/*

@Get()
getAllUsers(@Query('role') role: string) // ?role=guest|responsable

@Get(':id')
getUserById(@Param('id') id: string)

@Post()
createUser(@Body() dto: CreateUserDto)

@Patch(':id')
updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto)

@Delete(':id')
softDeleteUser(@Param('id') id: string)

@Patch(':id/status')
updateUserStatus(@Param('id') id: string, @Body() dto: StatusDto)

@Get('search')
searchUsers(@Query('q') query: string)

@Get('stats/summary')
getUserStatistics()

@Get('me')
getProfile() // from token

@Patch('me')
updateProfile()


*/