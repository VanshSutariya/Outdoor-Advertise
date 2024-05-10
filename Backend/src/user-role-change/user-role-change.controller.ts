import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserRoleChangeService } from './user-role-change.service';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('userRoleChange')
export class UserRoleChangeController {
  constructor(private roleChangeService: UserRoleChangeService) {}

  @Get()
  async getAllRequests(@Query() query: ExpressQuery) {
    const requests = await this.roleChangeService.getAllRequests(query);
    if (!requests) throw new HttpException('No requests for role change.', 404);
    return requests;
  }

  @Post()
  async createRoleChangeReq(@Body() _id: string,) {
    return this.roleChangeService.createUserRoleChange(_id);
  }

  @Patch(':id')
  async userRoleStatus(
    @Param('id') id: string,
    @Body() status: UpdateStatusDto,
  ) {
    return this.roleChangeService.updateUserRoleChangeStatus(id, status);
  }
}
