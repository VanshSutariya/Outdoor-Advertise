import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/createCart.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCartDto } from './dto/updateCart.dto';
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getAll(@Query() query: ExpressQuery) {
    return await this.cartService.getAll(query);
  }

  @Get(':id')
  async getCartById(@Param('id') id: string) {
    return await this.cartService.getCartById(id);
  }

  @Post('add')
  async createCart(@Body() createCartdto: CreateCartDto) {
    return await this.cartService.createCart(createCartdto);
  }

  @Patch(':userId/:posterId')
  async updateCart(
    @Param('userId') userId: string,
    @Param('posterId') posterId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return await this.cartService.updateCart(userId, posterId, updateCartDto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl: any = await this.cartService.uploadImage(file.buffer);
    return imageUrl;
  }

  //delete an specific poster
  @Delete(':userId/:posterId')
  async deleteCartData(
    @Param('userId') userId: string,
    @Param('posterId') posterId: string,
  ) {
    const deleteCart = this.cartService.deleteFromCart(userId, posterId);
    if (!deleteCart) throw new HttpException('Cart item not found.', 404);
    return { message: 'Cart item deleted successfully' };
  }

  //delete all cart data
  @Delete(':userId')
  async deleteByUserId(@Param('userId') userId: string): Promise<string> {
    try {
      return await this.cartService.deleteAll(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(
        `Failed to delete data for userId: ${userId}. Error: ${error.message}`,
      );
    }
  }
}
