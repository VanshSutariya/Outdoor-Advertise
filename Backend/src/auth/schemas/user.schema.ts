import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../roles.constants';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    required: true,
    validate: {
      validator: (value: string) =>
        /^[a-zA-Z][a-zA-Z0-9 ]*[a-zA-Z0-9]$/.test(value),
      message:
        'Name must start with a character, contain only characters, numbers, and spaces, and cannot end with a space',
    },
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  image: string;

  @Prop({
    type: String,
    enum: Object.values(Roles),
    default: Roles.user,
    required: false,
  })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
