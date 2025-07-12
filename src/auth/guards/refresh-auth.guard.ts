import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../schema/token.schema';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refreshToken } = request.body;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // Check if refresh token exists in database
    const storedToken = await this.tokenModel
      .findOne({ refreshToken })
      .exec();
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await this.tokenModel.deleteOne({ refreshToken }).exec();
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Verify token signature
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new UnauthorizedException('JWT refresh secret not configured');
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, { secret });
      request.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch (error) {
      await this.tokenModel.deleteOne({ refreshToken }).exec();
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}