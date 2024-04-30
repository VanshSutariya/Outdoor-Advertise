import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateBookingDto } from './dto/createBooking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  async getAll(@Query() query: ExpressQuery) {
    return await this.bookingService.getAll(query);
  }

  @Get('data')
  async getRevenueData(): Promise<{
    totalRevenue: number;
    todayRevenue: number;
    yearlyRevenue: number[];
  }> {
    return this.bookingService.getRevenueData();
  }
  @Get('/currMonthData')
  async getCurrentMonthSales() {
    return await this.bookingService.getCurrentMonthSales();
  }

  @Post('add')
  async createBooking(@Body() bookingDto: CreateBookingDto) {
    return await this.bookingService.createBooking(bookingDto);
  }

  //delete an specific poster
  @Delete(':userId/:posterId')
  async deleteCartData(
    @Param('userId') userId: string,
    @Param('posterId') posterId: string,
  ) {
    const deleteBooking = this.bookingService.deleteFromCart(userId, posterId);
    if (!deleteBooking) throw new HttpException('Cart item not found.', 404);
    return { message: 'Cart item deleted successfully' };
  }

  //delete all cart data
  @Delete(':userId')
  async deleteByUserId(@Param('userId') userId: string): Promise<string> {
    try {
      return await this.bookingService.deleteAll(userId);
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
