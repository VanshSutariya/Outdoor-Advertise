import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Posters } from 'src/poster-details/schemas/posters.schema';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posters' })
  posterId: Posters;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  customerPosterImage: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: [String] })
  bookingDate: string[];
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
