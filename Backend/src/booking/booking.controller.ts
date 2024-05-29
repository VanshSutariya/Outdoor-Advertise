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
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateBookingDto } from './dto/createBooking.dto';
import { BookingService } from './booking.service';
import { RolesGuard } from 'src/RoleGuard/role.guard';
import { HasRoles } from 'src/RoleGuard/roles.decorater';
import { Roles } from 'src/auth/roles.constants';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  @HasRoles(Roles.member, Roles.admin, Roles.user)
  async getAll(@Query() query: ExpressQuery) {
    return await this.bookingService.getAll(query);
  }

  @Get('id/:id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.member, Roles.admin)
  async getBookingById(@Param('id') id: string) {
    return await this.bookingService.getBookingById(id);
  }

  @Get('data')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin)
  async getRevenueData(): Promise<{
    totalRevenue: number;
    todayRevenue: number;
    yearlyRevenue: number[];
  }> {
    return await this.bookingService.getRevenueData();
  }

  @Get('currMonthData/:id?')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.member, Roles.admin)
  async getCurrentMonthSales(@Param('id') id?: string) {
    return await this.bookingService.getCurrentMonthSales(id);
  }

  @Get('memberStats/:id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.member, Roles.admin)
  async getMemberRevenueStats(@Param('id') id: string) {
    return await this.bookingService.getMemberRevenueStats(id);
  }

  @Post('add')
  async createBooking(@Body() bookingDto: CreateBookingDto) {
    return await this.bookingService.createBooking(bookingDto);
  }

  //delete all booking of specific user poster
  @Delete(':id')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin)
  async deleteCartData(@Param('id') id: string) {
    const deleteBooking = this.bookingService.deleteBookingtById(id);
    if (!deleteBooking)
      throw new HttpException('Booking details not found.', 404);
    return { message: 'Booking detials deleted successfully.' };
  }

  //delete all booking data
  @Delete(':userId')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.admin)
  async deleteByUserId(@Param('userId') userId: string): Promise<string> {
    try {
      return await this.bookingService.deleteAll(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(
        `Failed to delete Booking data for userId: ${userId}. Error: ${error.message}`,
      );
    }
  }
}
