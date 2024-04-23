import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schemas';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/createCart.dto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModal: Model<Cart>) {}

  async getAll(query: Query) {
    let DBQuery = {};

    if (query?.userId) {
      DBQuery['userId'] = query?.userId;
    }

    const resData = await this.cartModal.find(DBQuery);
    if (!resData) throw new HttpException('No Data in db.', 404);
    return resData;
  }

  async createCart(createCartDto: CreateCartDto) {
    const newCart = await this.cartModal.create(createCartDto);
    if (!newCart) throw new HttpException('Cart details is not added.', 404);
    return newCart;
  }

  async deleteCartById(id: string) {
    return this.cartModal.findByIdAndDelete(id);
  }

  async deleteFromCart(userId: string, posterId: string): Promise<Cart> {
    return this.cartModal.findOneAndDelete({ userId, posterId });
  }

  async deleteAll(userId: string): Promise<string> {
    try {
      const result = await this.cartModal.deleteMany({ userId }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`No data found for userId: ${userId}`);
      }
      return `Successfully deleted data for userId: ${userId}`;
    } catch (error) {
      throw new Error(
        `Failed to delete data for userId: ${userId}. Error: ${error.message}`,
      );
    }
  }
}
