import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return /^[a-zA-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/.test(text);
  }
  defaultMessage(args: ValidationArguments) {
    return 'Name must start with a character, contain only characters, numbers, and spaces, and cannot end with a space';
  }
}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Validate(CustomTextValidator)
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
