import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'; // Use consistent bcrypt library
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Token, TokenDocument } from './schema/token.schema';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, name, dateNaissance, address, telephone, role } = dto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (role && role !== 'user') {
      throw new BadRequestException('Signup is restricted to user role only');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: UserDocument = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      dateNaissance,
      address,
      telephone,
      role: 'user',
    });

    const payload: JwtPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = await this.generateRefreshToken(user._id);

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    const user: UserDocument | null = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Email does not exist');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

const payload: JwtPayload = { id: user._id.toString(), email: user.email, role: user.role };
const refreshToken = await this.generateRefreshToken(user._id);
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken, refreshToken };
  }

  async refresh(user: JwtPayload, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await this.tokenModel.findOne({ refreshToken, userId: user.id }).exec();
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const dbUser = await this.userModel.findById(user.id).exec();
    if (!dbUser) {
      throw new UnauthorizedException('User no longer exists');
    }

    const payload: JwtPayload = { id: user.id, email: user.email, role: dbUser.role };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    const newRefreshToken = await this.generateRefreshToken(new Types.ObjectId(user.id));
    await this.tokenModel.deleteOne({ refreshToken }).exec();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.tokenModel.deleteMany({ userId: new Types.ObjectId(userId) }).exec();
    return { message: 'Successfully logged out' };
  }

  private async generateRefreshToken(userId: Types.ObjectId): Promise<string> {
    const payload = { sub: userId.toString() };
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string | number>('JWT_REFRESH_EXPIRE', '7d');

    if (!secret) {
      throw new UnauthorizedException('JWT refresh secret not configured');
    }

    const refreshToken = this.jwtService.sign(payload, { secret, expiresIn });

    const expiresAt = new Date();
    if (typeof expiresIn === 'string') {
      const match = expiresIn.match(/^(\d+)([dhms])$/);
      if (!match) {
        throw new UnauthorizedException('Invalid JWT_REFRESH_EXPIRE format');
      }
      const value = parseInt(match[1], 10);
      const unit = match[2];
      switch (unit) {
        case 'd':
          expiresAt.setDate(expiresAt.getDate() + value);
          break;
        case 'h':
          expiresAt.setHours(expiresAt.getHours() + value);
          break;
        case 'm':
          expiresAt.setMinutes(expiresAt.getMinutes() + value);
          break;
        case 's':
          expiresAt.setSeconds(expiresAt.getSeconds() + value);
          break;
        default:
          throw new UnauthorizedException('Invalid JWT_REFRESH_EXPIRE unit');
      }
    } else {
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
    }

    const tokenDocument = {
      userId,
      refreshToken,
      expiresAt,
    };

    await this.tokenModel.create(tokenDocument);

    return refreshToken;
  }
}