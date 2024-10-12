import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Schema({
  timestamps: true,
})
export class ContactUs {
  @Prop({ require: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ require: true })
  @IsNotEmpty()
  subject: string;

  @Prop({ require: true })
  @IsNotEmpty()
  description: string;
}
export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
