import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schemas';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/createCart.dto';
import { Query } from 'express-serve-static-core';
import { v2 } from 'cloudinary';
import { UpdateCartDto } from './dto/updateCart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModal: Model<Cart>) {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDNERY_KEY,
      api_secret: process.env.CLOUDNERY_SECRET_KEY,
    });
  }

  async getAll(query: Query) {
    let DBQuery = {};

    if (query?.userId) {
      DBQuery['userId'] = query?.userId;
    }

    const resData = await this.cartModal.find(DBQuery).sort({ createdAt: -1 });
    if (!resData) throw new HttpException('No Data in db.', 404);
    return resData;
  }

  async getCartById(id: string) {
    const cartData = this.cartModal.findById(id);
    if (!cartData) throw new HttpException('No Data in db.', 404);
    return cartData;
  }

  async createCart(createCartDto: CreateCartDto) {
    const newCart = await this.cartModal.create(createCartDto);
    if (!newCart) throw new HttpException('Cart details is not added.', 404);
    return newCart;
  }

  async updateCart(
    userId: string,
    posterId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const { bookingDate, customerPosterImage, totalPrice } = updateCartDto;

    const cart = await this.cartModal.findOne({ userId, posterId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (bookingDate) {
      cart.bookingDate = bookingDate;
    }
    if (customerPosterImage) {
      cart.customerPosterImage = customerPosterImage;
    }
    if (totalPrice) {
      cart.totalPrice = totalPrice;
    }

    const result = await cart.save();
    return result;
  }

  async uploadImage(filepath: Buffer) {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'Customer Ad Images', resource_type: 'auto' },
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
