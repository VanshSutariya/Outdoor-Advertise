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
    // if (query?.price) {
    //   if (query?.priceCondition) {
    //     DBQuery['price'] = {
    //       [`$${query?.priceCondition}`]: query?.price,
    //     };
    //   } else {
    //     DBQuery['price'] = query?.price;
    //   }
    // }

    console.log(DBQuery);

    const resData = await this.postersModel.find(DBQuery);
    // return resData;

    return {
      result: resData.length,
      data: resData,
    };
  }

  // Get One
  getPosterById(id: string) {
    return this.postersModel.findById(id);
  }

  // Create Poster
  async createPoster(createposterDto: CreatePosterDto) {
    const count = await this.postersModel.countDocuments({});
    const id = `pid${count + 1}`;
    const newPoster = await this.postersModel.create({
      ...createposterDto,
      id,
    });
    if (!newPoster)
      throw new HttpException('New Poster/Hoardoing is not Created.', 404);
    return newPoster;
  }

  // update poster
  async updatePoster(id: string, updatePosterDto: UpdatePosterDto, file) {
    let { price, image } = updatePosterDto;
    image = file.path;
    const updatePoster = await this.postersModel.findByIdAndUpdate(
      id,
      { price, image },
      { new: true },
    );
    if (!updatePoster) throw new HttpException('Poster is not updated. ', 404);
    return updatePoster;
  }

  // delete poster
  deletePoster(id: string) {
    return this.postersModel.findByIdAndDelete(id);
  }
}
