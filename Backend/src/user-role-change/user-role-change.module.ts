import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { UserRoleChangeController } from './user-role-change.controller';
import { UserRoleChangeService } from './user-role-change.service';
import {
  UserRoleChange,
  UserRoleChangeSchema,
} from './schema/userRoleChange.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { RoleChangeGateway } from 'src/gateway/role-change-gateway';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserRoleChange.name, schema: UserRoleChangeSchema },
    ]),
  ],
  controllers: [UserRoleChangeController],
  providers: [UserRoleChangeService, AuthService, RoleChangeGateway],
})
export class UserRoleChangeModule {}
