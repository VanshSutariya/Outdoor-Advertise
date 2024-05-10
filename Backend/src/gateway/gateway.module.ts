import { Module } from '@nestjs/common';
import { RoleChangeGateway } from './role-change-gateway';

@Module({
  providers: [RoleChangeGateway],
})
export class GatewayModule {}
