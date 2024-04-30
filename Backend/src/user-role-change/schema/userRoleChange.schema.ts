import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserRoleChangeStatus } from '../dto/updateStatus.dto';
import { User } from 'src/auth/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class UserRoleChange {
  @Prop({ default: 'member', required: false })
  reqRole: string;

  @Prop({
    type: String,
    default: UserRoleChangeStatus.pending,
    enum: Object.values(UserRoleChangeStatus),
    required: false,
  })
  status: UserRoleChangeStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const UserRoleChangeSchema =
  SchemaFactory.createForClass(UserRoleChange);
