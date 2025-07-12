import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument, ServiceType } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async createReview(data: CreateReviewDto): Promise<Review> {
    // Simple validation example
    if (
      data.overallRating < 1 || data.overallRating > 5 ||
      data.qualityRating < 1 || data.qualityRating > 5 ||
      data.serviceRating < 1 || data.serviceRating > 5 ||
      data.valueRating < 1 || data.valueRating > 5 ||
      data.ambianceRating < 1 || data.ambianceRating > 5
    ) {
      throw new BadRequestException('Ratings must be between 1 and 5');
    }

    const createdReview = new this.reviewModel({
      serviceType: data.serviceType,
      serviceName: data.serviceName,
      overallRating: data.overallRating,
      qualityRating: data.qualityRating,
      serviceRating: data.serviceRating,
      valueRating: data.valueRating,
      ambianceRating: data.ambianceRating,
      reviewText: data.reviewText,
      user: data.userId,
      approved: false, // default false for moderation
    });

    return createdReview.save();
  }


 // ✅ Approve a review by setting approved = true
  async approveReview(id: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  // ❌ Reject a review by deleting it
  async rejectReview(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }

  // Optional: Get all unapproved reviews (for admin dashboard)
  async getPendingReviews(): Promise<Review[]> {
    return this.reviewModel.find({ approved: false });
  }

  // Optional: Get only approved reviews (for public display)
  async getApprovedReviews(): Promise<Review[]> {
    return this.reviewModel.find({ approved: true });
  }


 

async calculateAverageRatingByServiceType(): Promise<{ serviceType: ServiceType; averageRating: number }[]> {
  const result = await this.reviewModel
    .aggregate([
      { $match: { approved: true } }, // ✅ Only approved reviews
      {
        $group: {
          _id: '$serviceType',
          averageRating: { $avg: '$overallRating' }
        }
      },
      {
        $project: {
          serviceType: '$_id',
          averageRating: { $round: ['$averageRating', 2] },
          _id: 0
        }
      },
      { $sort: { serviceType: 1 } }
    ])
    .exec();

  return result;
}

}


