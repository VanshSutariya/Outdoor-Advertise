import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactUsDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
