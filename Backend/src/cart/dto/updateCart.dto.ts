import { Injectable } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Injectable()
export class UpdateCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  posterId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  finalTotal: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookingDate: string[];
}
