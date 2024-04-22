import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  posterId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: [String] })
  bookingDate: string[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
