import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../roles.constants';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
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
