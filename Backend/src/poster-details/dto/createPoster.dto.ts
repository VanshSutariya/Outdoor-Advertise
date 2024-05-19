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
import { MEDIA_PLAN, PosterStatus } from '../constants/mediaPlan.constants';
import { Transform } from 'class-transformer';

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

  @IsEnum(PosterStatus)
  @IsNotEmpty()
  @Transform(() => PosterStatus.PENDING, { toClassOnly: true })
  status: PosterStatus = PosterStatus.PENDING;

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

  @IsNotEmpty()
  @IsString()
  createdBy: string;

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
