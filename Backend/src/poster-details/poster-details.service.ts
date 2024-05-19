import { HttpException, Injectable } from '@nestjs/common';
import { Posters } from './schemas/posters.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePosterDto } from './dto/createPoster.dto';
import { UpdatePosterDto } from './dto/updatePoster.dto';
import { Query } from 'express-serve-static-core';
import { v2 } from 'cloudinary';
import { RoleChangeGateway } from 'src/gateway/role-change-gateway';
import { title } from 'process';
@Injectable()
export class PosterDetailsService {
  constructor(
    @InjectModel(Posters.name) private postersModel: Model<Posters>,
    private readonly posterreqGateway: RoleChangeGateway,
  ) {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDNERY_KEY,
      api_secret: process.env.CLOUDNERY_SECRET_KEY,
    });
  }

  // get all posters
  async getAllPosters(query: Query, isPopularClicked: boolean = false) {
    let DBQuery: any = {};

    if (query?.state) {
      DBQuery['state'] = {
        $regex: '^' + query?.state,
        $options: 'i',
      };
    }
    if (query?.city) {
      DBQuery['city'] = { $regex: '^' + query?.city, $options: 'i' };
    }
    if (query?.address) {
      DBQuery['address'] = { $regex: query?.address, $options: 'i' };
    }
    if (query?.mediatype) {
      DBQuery['mediatype'] = query?.mediatype;
    }
    if (query?.createdBy) {
      DBQuery['createdBy'] = query?.createdBy;
    }
    if (query?.status) {
      DBQuery['status'] = query?.status;
    }

    if (query.status || query.isActive) {
      DBQuery['isActive'] = false;
    } else {
      DBQuery['isActive'] = true;
    }

    if (isPopularClicked) {
      const posters = await this.postersModel.find();
      const totalBookings = posters.reduce(
        (acc, poster) => acc + poster.totalBooking,
        0,
      );
      const averageBooking = totalBookings / posters.length;
      DBQuery['totalBooking'] = { $gt: averageBooking };
    }

    const resPerPage = Number(query?.per_page) || 0;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const resData = await this.postersModel
      .find(DBQuery)
      .limit(resPerPage)
      .skip(skip);

    if (resData.length === 0) {
      throw new HttpException(
        'No posters available. Please try again later.',
        400,
      );
    }

    const posters = await this.postersModel.find();
    const totalBookings = posters.reduce(
      (acc, poster) => acc + poster.totalBooking,
      0,
    );
    const averageBooking = totalBookings / posters.length;

    const totalLength = await this.postersModel.countDocuments(DBQuery);

    if (totalLength <= 0) {
      throw new Error('No posters available. Please try again later.');
    }
    return { averageBooking, totalLength, resData };
  }

  // Get One
  async getPosterById(id: string) {
    return await this.postersModel.findById(id);
  }

  // Create Poster
  async createPoster(createposterDto: CreatePosterDto) {
    const newPoster = await this.postersModel.create(createposterDto);
    if (!newPoster)
      throw new HttpException('New Poster/Hoarding is not Created.', 404);

    const posterData = {
      _id: newPoster._id,
      title: newPoster.title,
      image: newPoster.image,
      price: newPoster.price,
      lightingType: newPoster.lightingType,
    };
    this.posterreqGateway.posterReq(posterData);
    return newPoster;
  }

  // update poster
  async updatePoster(id: string, updatePosterDto: UpdatePosterDto) {
    const poster = await this.postersModel.findById(id);

    if (!poster) {
      throw new HttpException('Poster not found', 404);
    }
    if (updatePosterDto?.bookingDate) {
      const existingBookingDate = poster.bookingDate;

      const existingBookingDateObjects = existingBookingDate.map(
        (dateString) => new Date(dateString),
      );

      const newBookingDateObjects = updatePosterDto.bookingDate.map(
        (dateString) => new Date(dateString),
      );

      const updatedBookingDateObjects = [
        ...existingBookingDateObjects,
        ...newBookingDateObjects,
      ];

      updatedBookingDateObjects.sort((a, b) => a.getTime() - b.getTime());
      const options: Intl.DateTimeFormatOptions = {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      };
      const updatedBookingDate = updatedBookingDateObjects?.map((dateObject) =>
        dateObject.toLocaleDateString('en-US', options),
      );

      const updatedPoster = await this.postersModel.findByIdAndUpdate(
        id,
        { bookingDate: updatedBookingDate },
        { new: true },
      );

      if (!updatedPoster) {
        throw new HttpException('Failed to update poster', 500);
      }

      // Return the updated poster document
      return updatedPoster;
    } else {
      const newUpdate = await this.postersModel.findByIdAndUpdate(
        id,
        updatePosterDto,
        { new: true },
      );
      return newUpdate;
    }
  }

  // update poster status
  async updatePosterStatus(id: string, updatePosterDto: UpdatePosterDto) {
    const poster = await this.postersModel.findById(id);

    if (!poster) {
      throw new HttpException('Poster not found', 404);
    }

    let updatedPoster: any;
    if (updatePosterDto.status === 'approved') {
      updatedPoster = await this.postersModel.findByIdAndUpdate(
        id,
        { status: updatePosterDto.status, isActive: true },
        { new: true },
      );
    } else {
      updatedPoster = await this.postersModel.findByIdAndUpdate(
        id,
        { status: updatePosterDto.status },
        { new: true },
      );
    }

    if (!updatedPoster) {
      throw new HttpException('Failed to update status', 500);
    }
    if (updatePosterDto.status === 'approved') {
      const posterData = {
        _id: updatedPoster._id,
        title: updatedPoster.title,
        image: updatedPoster.image,
        price: updatedPoster.price,
        lightingType: updatedPoster.lightingType,
        createdBy: updatedPoster.createdBy,
      };

      this.posterreqGateway.posterRes(posterData);
    }
    return updatedPoster;
  }

  async uploadImage(filepath: Buffer) {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'Poster Images', resource_type: 'auto' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(filepath);
    });
  }

  // totalBooking counter
  async totalBookingCounter(id: string) {
    return await this.postersModel.findByIdAndUpdate(id, {
      $inc: { totalBooking: 1 },
    });
  }

  // delete poster
  deletePoster(id: string) {
    return this.postersModel.findByIdAndUpdate(id, { isActive: false });
  }
}
