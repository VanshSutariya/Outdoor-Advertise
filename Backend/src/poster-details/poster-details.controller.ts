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
    return this.posterdetailsService.createPoster(createPosterDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/poster',
        filename: (req, file, cb) => {
          const randomName = new Date().toISOString();
          const imageName = randomName.replace(/:/g, '-');
          cb(null, `${imageName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
          cb(null, true);
        } else {
          cb(new Error('Only PNG and JPEG files are allowed!'), false);
        }
      },
    }),
  )
  async updatePoster(
    @Param('id') id: string,
    @Body() updatePosterDto: UpdatePosterDto,
    @UploadedFile() file: any,
  ) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('Invalid user id ', 404);
    return this.posterdetailsService.updatePoster(id, updatePosterDto, file);
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
