import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define the enum right here
export enum Category {
  BreakfastSpecials = "Breakfast Specials",
  LocalCuisine = "Local Cuisine",
  InternationalFavorites = "International Favorites",
}

export type FoodDocument = Food & Document;

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(Category) })
  category: Category;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  ingredients: string[];

  @Prop({ min: 1, max: 5, default: 1 })
  spiceLevel: number;

  @Prop({ required: true })
  preparationTime: number;

  @Prop({
    type: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
      allDay: { type: Boolean, default: false },
    },
    default: {},
  })
  availability: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    allDay: boolean;
  };

  @Prop({ default: 0 })
  popularRating: number;


  @Prop({ default: true })
  isActive: boolean;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
