import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  Body,
  Controller,
  Delete,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('poster')
export class PosterDetailsController {
  constructor(private posterdetailsService: PosterDetailsService) {}

  @Get()
  async getAllPosters(@Query() query: ExpressQuery) {
    return this.posterdetailsService.getAllPosters(query);
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
  async createPoster(@Body() createPosterDto: CreatePosterDto) {
    return await this.posterdetailsService.createPoster(createPosterDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updatePoster(
    @Param('id') id: string,
    @Body() updatePosterDto: UpdatePosterDto,
  ) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid user id ', 404);
    return this.posterdetailsService.updatePoster(id, updatePosterDto);
  }

  @Delete(':id')
  async deletePoster(@Param('id') id: string) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid user id ', 404);
    const deletePoster = await this.posterdetailsService.deletePoster(id);
    if (!deletePoster) throw new HttpException('UserNotFound', 404);
    return;
  }
}
