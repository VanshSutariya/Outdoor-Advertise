import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MEDIA_PLAN } from '../constants/mediaPlan.constants';

@Schema({
  timestamps: true,
})
export class Posters {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false })
  category?: string;

  @Prop({
    type: String,
    enum: Object.values(MEDIA_PLAN),
    default: MEDIA_PLAN.BILLBOARD,
  })
  mediatype: MEDIA_PLAN;

  @Prop({ required: true })
  lightingType: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  landmark: string;

  @Prop({ required: true })
  facingFrom: string;

  @Prop({ required: false })
  size?: string;

  @Prop({ required: false })
  sft?: number;

  @Prop({ required: true })
  minimumDays: number;

  @Prop({ required: false })
  latLng?: number[];
}

export const PostersSchema = SchemaFactory.createForClass(Posters);
