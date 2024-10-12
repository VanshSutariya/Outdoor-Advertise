import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PosterDetailsService } from './poster-details.service';
import { CreatePosterDto } from './dto/createPoster.dto';
import { UpdatePosterDto } from './dto/updatePoster.dto';
import mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { RolesGuard } from 'src/RoleGuard/role.guard';
import { HasRoles } from 'src/RoleGuard/roles.decorater';
import { Roles } from 'src/auth/roles.constants';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('poster')
export class PosterDetailsController {
  constructor(private posterdetailsService: PosterDetailsService) {}

  @Get()
  async getAll(
    @Query() query: ExpressQuery,
    @Query('isPopularClicked') isPopularClicked: string,
  ) {
    if (isPopularClicked === 'true') {
      return await this.posterdetailsService.getAllPosters(query, true);
    } else {
      return await this.posterdetailsService.getAllPosters(query);
    }
  }

  @Get(':id')
  async getPosterById(@Param('id') id: string) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid user id ', 404);
    const newPoster = await this.posterdetailsService.getPosterById(id);
    if (!newPoster) throw new HttpException('UserNotFound', 404);
    return newPoster;
  }

  @Post('add')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.member, Roles.admin)
  async createPoster(@Body() createPosterDto: CreatePosterDto) {
    return await this.posterdetailsService.createPoster(createPosterDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.member, Roles.admin)
  async updatePoster(
    @Param('id') id: string,
    @Body() updatePosterDto: UpdatePosterDto,
  ) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid user id ', 404);
    return this.posterdetailsService.updatePoster(id, updatePosterDto);
  }

  @Patch('status/:id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin)
  async updatePosterStatus(
    @Param('id') id: string,
    @Body() updatePosterDto: UpdatePosterDto,
  ) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid poster id', 404);

    return this.posterdetailsService.updatePosterStatus(id, updatePosterDto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl: any = await this.posterdetailsService.uploadImage(
      file.buffer,
    );
    return imageUrl;
  }

  // soft delete
  @Patch('deletePoster/:id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.member, Roles.admin)
  async deletePoster(@Param('id') id: string) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid user id ', 404);
    const deletePoster = await this.posterdetailsService.deletePoster(id);
    if (!deletePoster) throw new HttpException('UserNotFound', 404);
    return { message: 'Poster deleted successfully' };
  }
}
