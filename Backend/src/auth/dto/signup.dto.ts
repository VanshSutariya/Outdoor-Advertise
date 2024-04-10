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
    // Check if the text starts with a character and contains only characters and numbers
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Name must start with a character and contain only characters and numbers';
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
