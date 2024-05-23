import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookingDate: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  customerPosterImage: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  totalPrice: number;
}
