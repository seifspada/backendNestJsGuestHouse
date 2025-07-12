import { Module } from '@nestjs/common';
import { BungalowService } from './bungalow.service';
import { BungalowController } from './bungalow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bungalow, BungalowSchema } from './schemas/bungalow.schema';
import { Booking, BookingSchema } from 'src/booking/schemas/booking.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
   imports: [
    MongooseModule.forFeature([
      
     { name: Bungalow.name, schema: BungalowSchema},
          {  name: Booking.name, schema: BookingSchema},

    
    ]),AuthModule
  ],
  controllers: [BungalowController],
  providers: [BungalowService],
    exports: [BungalowService],

})
export class BungalowModule {}

