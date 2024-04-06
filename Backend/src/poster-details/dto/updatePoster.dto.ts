import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
  @Min(4, { message: 'Minimum Days must be greater than or equal to 4' })
  minimumDays?: number;
}
