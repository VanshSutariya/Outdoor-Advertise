"use client";
import React, { useEffect, useState } from "react";

import { BsCurrencyRupee } from "react-icons/bs";
import { LuCreditCard } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import { TbActivityHeartbeat } from "react-icons/tb";
import numeral from "numeral";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/store";
import {
  fetchAllUsers,
  fetchMemberPosterStats,
  fetchMonthlyData,
} from "@/utils/http";
import Sidebar from "@/components/admincomponents/sidebar";
import ProfileDropDown from "@/components/admincomponents/profileDropDown";
import BarGraph from "@/components/admincomponents/barChart";

interface MonthlyPayment {
  userId: string;
  totalPrice: number;
  userName: string;
  userEmail: string;
  userImage?: string;
}

interface TopPayment {
  totalSales: number;
  topMonthlyPayment: MonthlyPayment[];
}

export default function DashboardPage() {
  const [topPayment, setTopPayments] = useState<TopPayment | null>(null);
  const [memberStats, setMemberStats] = useState({
    totalRevenue: 0,
    currentMonthRevenue: 0,
    todayEarning: 0,
    totalPosters: 0,
  });
  const [monthlyData, setMonthlyData] = useState<number[]>([]);

  const {
    userId,
    token,
  }: {
    userId: string | null;
    token: string;
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    try {
      const data = async () => {
        if (userId) {
          const id = userId;
          const data = await fetchMemberPosterStats(id, token);
          setMemberStats((prev) => {
            const newState = { ...prev };
            newState.totalRevenue = data.currentYearTotalRevenue;
            newState.currentMonthRevenue = data.currentMonthEarning;
            newState.todayEarning = data.todayEarning;
            newState.totalPosters = data.totalPosters;
            return newState;
          });
          setMonthlyData(data.yearlyRevenue);

          const monthlydata = await fetchMonthlyData(token, userId);
          setTopPayments(monthlydata);
        }
      };
      data();
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  function formatRevenue(revenue: any) {
    const crore = 10000000; // 1 crore = 10,000,000
    const lakh = 100000; // 1 lakh = 100,000

    if (revenue >= crore) {
      return `₹${(revenue / crore).toFixed(2)} CR`;
    } else if (revenue >= lakh) {
      return `₹${(revenue / lakh).toFixed(2)} L`;
    } else {
      return "₹" + numeral(revenue).format("0,0.00");
    }
  }

  return (
    <>
      <Sidebar>
        <div className="container mx-auto font-poppins ">
          <div className="text-3xl xs:flex items-center font-semibold -mt-7  font-inter">
            <p>Dashboard</p>
            <Link
              href="/"
              className="md:ml-20 md: mt-1 text-xl font-normal font-poppins"
            >
              Home
            </Link>
            <div className="flex mt-3 justify-end w-full items-center">
              <ProfileDropDown />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-3 -mb-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                Total Revenue
                <BsCurrencyRupee className="md:ml-24 text-gray-400 mt-1" />
              </div>
              <p className="text-2xl ml-1 font-medium ">
                {memberStats.totalRevenue && memberStats.totalRevenue !== null
                  ? formatRevenue(memberStats.totalRevenue)
                  : "₹ 0"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                Monthly Revenue
                <GiReceiveMoney
                  className="md:ml-[65px]  text-gray-400"
                  size={20}
                />
              </div>
              <p className="text-2xl font-medium ml-1">
                {memberStats.currentMonthRevenue &&
                memberStats.currentMonthRevenue !== null
                  ? formatRevenue(memberStats.currentMonthRevenue)
                  : "₹0"}
              </p>
              {/* <p className="text-green-500">+180.1% from last month</p> */}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                Today Earnings
                <LuCreditCard className="md:ml-20 text-gray-400 mt-1" />
              </div>
              <p className="text-2xl ml-2 tracking-wider font-medium ">
                {memberStats.todayEarning && memberStats.todayEarning !== null
                  ? formatRevenue(memberStats.todayEarning)
                  : "₹0"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                Your Posters
                <TbActivityHeartbeat
                  size={22}
                  className="font-light md:ml-[95px] mt-1 text-gray-400"
                />
              </div>
              <p className="text-2xl font-medium ml-2">
                {memberStats.totalPosters && memberStats.totalPosters !== null
                  ? `+${memberStats.totalPosters}`
                  : "+0"}
              </p>

              {/* <p className="text-green-500">+19% from last month</p> */}
            </div>
          </div>

          <div className="mt-8 md:flex md:gap-3 ">
            <BarGraph monthlyData={monthlyData} />

            <div className=" border-[2px] border-gray-200  p-3 rounded-xl md:w-full">
              <div className="mb-4">
                <h1 className="text-lg">Recent Sales</h1>
                <p className="text-sm text-gray-400">
                  You made {topPayment ? topPayment?.totalSales : "0"} Sales
                  this month
                </p>
              </div>
              <ul>
                {topPayment !== null &&
                  topPayment.topMonthlyPayment?.map((item, index) => (
                    <li
                      key={index}
                      className="md:flex items-center justify-between py-2 border-b mb-3"
                    >
                      <div className="md:flex items-center">
                        <img
                          src={item.userImage ? item.userImage : "/profile.png"}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full mr-4"
                        />
                        <div>
                          <p className="">{item.userName}</p>
                          <p className="">{item.userEmail}</p>
                        </div>
                      </div>
                      <p className="text-green-500">
                        ₹{numeral(item.totalPrice).format("0,0.00")}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
