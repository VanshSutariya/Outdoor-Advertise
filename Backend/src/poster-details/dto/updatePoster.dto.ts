import { Injectable } from '@nestjs/common';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MEDIA_PLAN } from '../constants/mediaPlan.constants';

@Injectable()
export class UpdatePosterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lightingType?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber({}, { message: 'Price must be a number.' })
  @Max(1000000, {
    message: 'Price should not be greater than 10,00,000 per day.',
  })
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  size?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  sft?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(2, { message: 'Minimum Days must be greater than or equal to 4' })
  minimumDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookingDate?: string[];

  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  category?: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(MEDIA_PLAN)
  mediatype?: MEDIA_PLAN;

  @IsNotEmpty()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  landmark?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  facingFrom?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  minAutos?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  maxAutos?: number;

  @IsNotEmpty()
  @IsString()
  createdBy?: string;

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
}
