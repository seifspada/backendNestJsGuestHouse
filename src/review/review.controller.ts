import { Controller, Post, Get, Put, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewService.createReview(createReviewDto);
    return {
      message: 'Review created successfully',
      data: review,
    };
  }

 
    // ✅ Get all pending (unapproved) reviews
    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('pending')
  async getPendingReviews(): Promise<Review[]> {
    return this.reviewService.getPendingReviews();
  }

  // ✅ Get all approved reviews (public)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('approved')
  async getApprovedReviews(): Promise<Review[]> {
    return this.reviewService.getApprovedReviews();
  }

  // ✅ Approve a review by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/approve')
  async approveReview(@Param('id') id: string): Promise<Review> {
    return this.reviewService.approveReview(id);
  }

  // ❌ Reject (delete) a review by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/reject')
  async rejectReview(@Param('id') id: string): Promise<void> {
    return this.reviewService.rejectReview(id);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('average-by-service-type')
  async calculateAverageRatingByServiceType() {
    const averages = await this.reviewService.calculateAverageRatingByServiceType();
    return {
      message: 'Average ratings by service type retrieved successfully',
      data: averages,
    };
  }
}


