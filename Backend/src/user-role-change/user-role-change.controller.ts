import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRoleChangeService } from './user-role-change.service';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { RolesGuard } from 'src/RoleGuard/role.guard';
import { Roles } from 'src/auth/roles.constants';
import { HasRoles } from 'src/RoleGuard/roles.decorater';

@Controller('userRoleChange')
export class UserRoleChangeController {
  constructor(private roleChangeService: UserRoleChangeService) {}

  @Get()
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin, Roles.user)
  async getAllRequests(@Query() query: ExpressQuery) {
    const requests = await this.roleChangeService.getAllRequests(query);
    if (!requests) throw new HttpException('No requests for role change.', 404);
    return requests;
  }

  @Post()
  async createRoleChangeReq(@Body() _id: string) {
    return this.roleChangeService.createUserRoleChange(_id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin)
  async userRoleStatus(
    @Param('id') id: string,
    @Body() status: UpdateStatusDto,
  ) {
    return this.roleChangeService.updateUserRoleChangeStatus(id, status);
  }
}
