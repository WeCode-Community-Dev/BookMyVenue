import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  NOT_ASSIGNED = 'Not assigned',
  VENUE_OWNER = 'Venue owner',
  USER = 'User',
  ADMIN = 'Admin'
}

export enum UserStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: UserRole.USER })
  role: string;

  @Prop({ default: UserStatus.PENDING })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
