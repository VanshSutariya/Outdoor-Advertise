import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MEDIA_PLAN, PosterStatus } from '../constants/mediaPlan.constants';
import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

@Schema({
  timestamps: true,
})
export class Posters {
  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  image: string;

  @Prop({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @Prop({
    type: String,
    enum: Object.values(MEDIA_PLAN),
    default: MEDIA_PLAN.BILLBOARD,
  })
  @IsEnum(MEDIA_PLAN)
  mediatype: MEDIA_PLAN;

  @Prop({ required: true })
  @IsString()
  lightingType: string;

  @Prop({ required: true })
  @IsString()
  state: string;

  @Prop({ required: true })
  @IsString()
  city: string;

  @Prop({ required: true })
  @IsString()
  address: string;

  @Prop({ required: true })
  @IsNumber()
  price: number;

  @Prop({ required: true })
  @IsString()
  landmark: string;

  @Prop({ required: false })
  @IsString()
  @IsOptional()
  facingFrom?: string;

  @Prop({ required: true })
  @IsString()
  size: string;

  @Prop({ required: true })
  @IsNumber()
  sft: number;

  @Prop({ required: true })
  @IsNumber()
  minimumDays: number;

  @Prop({ required: false })
  @IsNumber()
  @IsOptional()
  minQty?: number;

  @Prop({ required: false })
  @IsNumber()
  @IsOptional()
  maxQty?: number;

  @Prop({ required: true })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(2, {
    message: 'latLng must be an array of 2 elements of type number',
  })
  @ArrayMaxSize(2, {
    message: 'latLng must be an array of 2 elements of type number',
  })
  @IsNumber(
    {},
    { each: true, message: 'All elements in latLng array must be a number.' },
  )
  latLng?: number[];

  @Prop({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  bookingDate: string[];

  @Prop({
    type: String,
    enum: PosterStatus,
    default: PosterStatus.PENDING,
  })
  @IsEnum(PosterStatus)
  status: PosterStatus;

  @Prop({ default: false })
  @IsOptional()
  isActive: boolean;

  @Prop({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  totalBooking: number;

  @Prop({ type: String, required: false })
  @IsString()
  @IsOptional()
  createdBy: string;
}

export const PostersSchema = SchemaFactory.createForClass(Posters);
