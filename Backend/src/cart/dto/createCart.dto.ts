import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCartDto {
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
  customerPosterImage: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  createdBy: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookingDate: string[];
}
