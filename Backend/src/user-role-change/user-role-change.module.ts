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
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: UserRoleChange.name, schema: UserRoleChangeSchema },
    ]),
  ],
  controllers: [UserRoleChangeController],
  providers: [UserRoleChangeService, AuthService],
})
export class UserRoleChangeModule {}
