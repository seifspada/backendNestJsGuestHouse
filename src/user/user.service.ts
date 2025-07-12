import { HttpException, Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, requestingUser?: UserDocument) {
  if (updateUserDto.email) {
    const existing = await this.userModel.findOne({ email: updateUserDto.email, _id: { $ne: id } });
    if (existing) throw new ConflictException('Email already in use');
  }
  if (updateUserDto.role && (!requestingUser || requestingUser.role !== 'admin')) {
    throw new ForbiddenException('Only admins can change user roles');
  }
  const user = await this.userModel
    .findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    })
    .exec();
  if (!user) {
    throw new HttpException('User not found', 404);
  }
  return user;
}

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  
}