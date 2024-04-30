import { HttpException, Injectable } from '@nestjs/common';
import { Posters } from './schemas/posters.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePosterDto } from './dto/createPoster.dto';
import { UpdatePosterDto } from './dto/updatePoster.dto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class PosterDetailsService {
  constructor(
    @InjectModel(Posters.name) private postersModel: Model<Posters>,
  ) {}

  // get all posters
  async getAllPosters(query: Query) {
    // if (query?.price) {
    //   if (query?.priceCondition) {
    //     DBQuery['price'] = {
    //       [`$${query?.priceCondition}`]: query?.price,
    //     };
    //   } else {
    //     DBQuery['price'] = query?.price;
    //   }
    // }
    let DBQuery = {};

    if (query?.state) {
      DBQuery['state'] = {
        $regex: '^' + query?.state,
        $options: 'i',
      };
    }
    if (query?.city) {
      DBQuery['city'] = { $regex: '^' + query?.city, $options: 'i' };
    }

    const resPerPage = Number(query?.per_page) || 0;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const resData = await this.postersModel
      .find(DBQuery)
      .limit(resPerPage)
      .skip(skip);
    return resData;
  }

  // Get One
  getPosterById(id: string) {
    return this.postersModel.findById(id);
  }

  // Create Poster
  async createPoster(createposterDto: CreatePosterDto) {
    // const count = await this.postersModel.countDocuments({});
    // const id = `pid${count + 1}`;
    const newPoster = await this.postersModel.create(createposterDto);
    if (!newPoster)
      throw new HttpException('New Poster/Hoarding is not Created.', 404);
    return newPoster;
  }

  // update poster
  async updatePoster(id: string, updatePosterDto: UpdatePosterDto) {
    const poster = await this.postersModel.findById(id);

    if (!poster) {
      throw new HttpException('Poster not found', 404);
    }

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
    const updatedBookingDate = updatedBookingDateObjects.map((dateObject) =>
      dateObject.toLocaleDateString('en-US', options),
    );
    console.log(updatedBookingDate);

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
  }

  // delete poster
  deletePoster(id: string) {
    return this.postersModel.findByIdAndDelete(id);
  }
}
