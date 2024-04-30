import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from '../roles.constants';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsEnum(Roles)
  role: Roles;
}
