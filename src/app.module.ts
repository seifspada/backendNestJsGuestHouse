import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceModule } from './service/service.module';
import { BungalowModule } from './bungalow/bungalow.module';
import { FoodModule } from './food/food.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { ServiceUsageModule } from './service-usage/service-usage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in environment variables');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ServiceModule,
    BungalowModule,
    FoodModule,
    BookingModule,
    ReviewModule,
    NotificationModule,
    ServiceUsageModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}