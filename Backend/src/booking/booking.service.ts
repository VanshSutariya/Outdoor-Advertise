import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { Booking } from './schema/booking.schema';
import { CreateBookingDto } from './dto/createBooking.dto';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAll(query: Query) {
    let DBQuery = {};

    if (query?.userId) {
      DBQuery['userId'] = query?.userId;
    }
    const resPerPage = Number(query?.per_page) || 0;
    const currPage = Number(query.page) || 1;
    const skip = resPerPage * (currPage - 1);
    const resData = await this.bookingModel
      .find(DBQuery)
      .limit(resPerPage)
      .skip(skip);

    if (!resData) throw new HttpException('You have no order placed yet.', 404);
    return resData;
  }

  async getRevenueData(): Promise<{
    todayRevenue: number;
    yearlyRevenue: number[];
    totalRevenue: number;
  }> {
    const todayRevenue = await this.getTodaysRevenue();
    const yearlyRevenue = await this.getYearlyRevenue();
    const totalRevenue = await this.getTotalRevenue();

    return { totalRevenue, todayRevenue, yearlyRevenue };
  }

  // current month sales ------------------------------------------------
  async getCurrentMonthSales() {
    try {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

      const totalSalesResult = await this.bookingModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 },
          },
        },
      ]);

      const totalSales =
        totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

      const bookings = await this.bookingModel.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      const topPayments = await Promise.all(
        bookings
          .sort((a, b) => b.totalPrice - a.totalPrice)
          .slice(0, 5)
          .map(async (booking) => {
            try {
              const user = await this.userModel.findById(booking.userId);
              if (!user) {
                throw new Error('User not found');
              }
              return {
                userId: booking.userId,
                totalPrice: booking.totalPrice,
                userName: user.name,
                userEmail: user.email,
                userImage: user.image,
              };
            } catch (error) {
              console.error('Error fetching user:', error.message);
              return null;
            }
          }),
      );

      const filteredTopPayments = topPayments.filter(Boolean);

      return { totalSales, topMonthlyPayment: filteredTopPayments };
    } catch (error) {
      throw new HttpException('An error occurred', 500);
    }
  }

  async createBooking(createBookingDto: CreateBookingDto) {
    const newBooking = await this.bookingModel.create(createBookingDto);
    if (!newBooking)
      throw new HttpException('Booking details is not added.', 404);
    return newBooking;
  }

  async deleteCartById(id: string) {
    return this.bookingModel.findByIdAndDelete(id);
  }

  async deleteFromCart(userId: string, posterId: string): Promise<Booking> {
    return this.bookingModel.findOneAndDelete({ userId, posterId });
  }

  async deleteAll(userId: string): Promise<string> {
    try {
      const result = await this.bookingModel.deleteMany({ userId }).exec();
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

  async getTodaysRevenue(): Promise<number> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCDate(today.getUTCDate() + 1);
    const revenue = await this.bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
            $lt: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const todayRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    return todayRevenue;
  }

  async getYearlyRevenue(): Promise<number[]> {
    const currentYear = new Date().getUTCFullYear();
    const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
    const endOfYear = new Date(Date.UTC(currentYear + 1, 0, 1));

    const revenue = await this.bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const yearlyRevenue: number[] = new Array(12).fill(0);
    revenue.forEach((item: any) => {
      const monthIndex = item._id - 1;
      yearlyRevenue[monthIndex] = item.totalRevenue;
    });

    return yearlyRevenue;
  }
  async getTotalRevenue(): Promise<number> {
    const revenue = await this.bookingModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    return totalRevenue;
  }
}
