import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MEDIA_PLAN } from '../constants/mediaPlan.constants';

export class CreatePosterDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  category: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(MEDIA_PLAN)
  mediatype: MEDIA_PLAN;

  @IsNotEmpty()
  @IsString()
  lightingType: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Price must be a number.' })
  price: number;

  @IsNotEmpty()
  @IsString()
  landmark: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  facingFrom?: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  sft: number;

  @IsNotEmpty()
  @IsNumber()
  minimumDays: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  minAutos?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  maxAutos?: number;

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
