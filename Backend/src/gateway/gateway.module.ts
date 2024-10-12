import { Module } from '@nestjs/common';
import { RoleChangeGateway } from './role-change-gateway';

@Module({
  providers: [RoleChangeGateway],
  exports: [RoleChangeGateway],
})
export class GatewayModule {}
