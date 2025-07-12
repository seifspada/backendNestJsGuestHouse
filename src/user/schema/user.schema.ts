import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  RESPONSABLE = 'responsable',
  USER = 'user',
}

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  dateNaissance?: string;

  @Prop()
  address?: string;

  @Prop()
  telephone?: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  serviceName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
