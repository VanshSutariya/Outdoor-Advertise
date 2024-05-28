import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { Booking } from './schema/booking.schema';
import { User } from 'src/auth/schemas/user.schema';
import { CreateBookingDto } from './dto/createBooking.dto';
import { Posters } from 'src/poster-details/schemas/posters.schema';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Posters.name) private readonly posterModel: Model<Posters>,
  ) {}

  // get all data--------------------------------------
  async getAll(query: Query) {
    let DBQuery = {};

    if (query?.userId) {
      DBQuery['userId'] = query?.userId;
    }

    if (query?.createdBy) {
      DBQuery['createdBy'] = query?.createdBy;
    }

    const resPerPage = Number(query?.per_page) || 0;
    const currPage = Number(query.page) || 1;
    const skip = resPerPage * (currPage - 1);
    const resData = await this.bookingModel
      .find(DBQuery)
      .populate({ path: 'userId', select: 'name email' })
      .populate({ path: 'posterId', select: 'title address price' })
      .populate({ path: 'createdBy', select: 'name email' })
      .limit(resPerPage)
      .skip(skip)
      .sort({ createdAt: -1 });

    if (!resData) throw new HttpException('You have no order placed yet.', 404);
    const totalLength = await this.userModel.countDocuments(DBQuery);

    return { totalLength, resData };
  }
  // get booking data using id ---------------------------------------------------
  async getBookingById(id: string) {
    return await this.bookingModel
      .findById(id)
      .populate({ path: 'userId', select: 'name email' })
      .populate({ path: 'posterId', select: 'title address' })
      .populate({ path: 'createdBy', select: 'name email' });
  }
  // create booking data-----------------------------------------
  async createBooking(createBookingDto: CreateBookingDto) {
    const newBooking = await this.bookingModel.create(createBookingDto);
    if (!newBooking)
      throw new HttpException('Booking details is not added.', 404);
    return newBooking;
  }

  // delete data by id---------------------------------------------
  async deleteBookingtById(id: string) {
    return this.bookingModel.findByIdAndDelete(id);
  }

  // delete all data of specific user
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

  // current month sales ------------------------------------------------
  async getCurrentMonthSales(id?: string) {
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

      let matchQuery: any = {
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      };

      if (id) {
        matchQuery = {
          ...matchQuery,
          createdBy: new mongoose.Types.ObjectId(id),
        };
      }
      const totalSalesResult = await this.bookingModel.aggregate([
        {
          $match: matchQuery,
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

      const bookings = await this.bookingModel.find(matchQuery);
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

  // Member dashboard data----------------------------------------------------------------------------------
  async getMemberRevenueStats(id: string): Promise<{
    currentYearTotalRevenue: number;
    yearlyRevenue: number[];
    todayEarning: number;
    currentMonthEarning: number;
    totalPosters: number;
  }> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adjust month to be 1-indexed for MongoDB
    currentDate.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setUTCDate(currentDate.getUTCDate() + 1);
    const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
    const endOfYear = new Date(Date.UTC(currentYear + 1, 0, 1));

    const totalRevenue = await this.bookingModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(id),
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31),
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
    const monthResult = await this.bookingModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(id),
          $expr: { $eq: [{ $year: '$createdAt' }, currentYear] },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalEarning: { $sum: '$totalPrice' },
        },
      },
      {
        $match: { _id: currentMonth },
      },
    ]);
    const dayResult = await this.bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentDate,
            $lt: endOfDay,
          },
          createdBy: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          todayEarning: { $sum: '$totalPrice' },
        },
      },
    ]);
    const currentYearData = await this.bookingModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(id),
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
    const yourPosters = await this.posterModel.aggregate([
      {
        $match: {
          createdBy: id,
        },
      },
      {
        $group: {
          _id: null,
          totalPosters: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const yearlyRevenue: number[] = new Array(12).fill(0);
    currentYearData.forEach((item: any) => {
      const monthIndex = item._id - 1;
      yearlyRevenue[monthIndex] = item.totalRevenue;
    });

    return {
      currentYearTotalRevenue:
        totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
      currentMonthEarning:
        monthResult.length > 0 ? monthResult[0].totalEarning : 0,
      todayEarning: dayResult.length > 0 ? dayResult[0].todayEarning : 0,
      totalPosters: yourPosters.length > 0 ? yourPosters[0].totalPosters : 0,
      yearlyRevenue,
    };
  }

  // get all revenue data for admin pannel ----------------------------------
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
