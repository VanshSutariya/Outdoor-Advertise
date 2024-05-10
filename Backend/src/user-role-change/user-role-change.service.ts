import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserRoleChange } from './schema/userRoleChange.schema';
import { Model } from 'mongoose';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateDto } from 'src/auth/dto/login.dto';
import { Roles } from 'src/auth/roles.constants';
import { Query } from 'express-serve-static-core';
import { RoleChangeGateway } from 'src/gateway/role-change-gateway';

@Injectable()
export class UserRoleChangeService {
  constructor(
    @InjectModel(UserRoleChange.name) private roleChange: Model<UserRoleChange>,
    private authService: AuthService,
    private readonly roleChangeGateway: RoleChangeGateway,
  ) {}

  async getAllRequests(query: Query) {
    let DBQuery = {};

    if (query?.status) {
      DBQuery['status'] = {
        $regex: '^' + query?.status,
        $options: 'i',
      };
    }

    if (query?.user) {
      DBQuery['user'] = query?.user;
    }
    const resPerPage = Number(query?.per_page) || 0;
    const currPage = Number(query.page) || 1;
    const skip = resPerPage * (currPage - 1);
    return await this.roleChange
      .find(DBQuery)
      .populate('user')
      .limit(resPerPage)
      .skip(skip);
  }

  async createUserRoleChange(_id: string) {
    const user = _id;
    const newUserRoleChange = await this.roleChange.create({
      user,
    });
    console.log(newUserRoleChange);

    if (!newUserRoleChange)
      throw new HttpException('enter valid Credentials.', 401);
    console.log(newUserRoleChange);
    const userData = await this.roleChange
      .find(newUserRoleChange._id)
      .populate({ path: 'user', select: 'email role name' });
    this.roleChangeGateway.userRoleReq(userData);
    return newUserRoleChange;
  }

  async updateUserRoleChangeStatus(id: string, status: UpdateStatusDto) {
    const updatedUserRoleChange = await this.roleChange
      .findByIdAndUpdate(id, status, { new: true })
      .populate('user');

    if (!updatedUserRoleChange) {
      throw new NotFoundException('The role change request was not  found.');
    }

    if (status.status === 'approved') {
      const updateDto: UpdateDto = {
        role: Roles.member,
        image: updatedUserRoleChange.user.image,
      };

      const id = updatedUserRoleChange.user._id;
      await this.authService.updateUserDetails(id, updateDto);
    }
    console.log(updatedUserRoleChange);

    this.roleChangeGateway.sendRoleChangeUpdate(updatedUserRoleChange);

    return updatedUserRoleChange;
  }
}
