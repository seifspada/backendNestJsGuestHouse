import { ServiceType } from '../schemas/review.schema'; // Adjust path as needed

export class UpdateReviewDto {
  serviceType?: ServiceType;
  serviceName?: string;
  overallRating?: number;
  qualityRating?: number;
  serviceRating?: number;
  valueRating?: number;
  ambianceRating?: number;
  reviewText?: string;
  userId?: string;
  approved?: boolean;
}