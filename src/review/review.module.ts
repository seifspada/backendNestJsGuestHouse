import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    AuthModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],

 
  exports: [ReviewService],

})
export class ReviewModule {}
