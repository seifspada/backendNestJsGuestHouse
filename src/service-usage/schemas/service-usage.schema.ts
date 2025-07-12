// service-usage.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from '../../service/schemas/service.schema';

@Schema({ timestamps: true })
export class ServiceUsage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // guest (role: 'user')

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  responsable: Types.ObjectId; // assigned by (role: 'responsable')

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  service: Types.ObjectId;

  // selected duration in minutes (e.g., 30, 60, 90, 120)
  @Prop({ required: true, enum: [30, 60, 90, 120] })
  duration: number;

  // calculated total price = (duration / service.duration) * service.price
  @Prop({ required: true })
  price: number;

  @Prop()
  notes?: string;
}

export const ServiceUsageSchema = SchemaFactory.createForClass(ServiceUsage);
