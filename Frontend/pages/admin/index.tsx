import { useEffect, useState } from 'react';
import BarGraph from '../../components/admincomponents/barChart';
import Sidebar from '../../components/admincomponents/sidebar';

import {
  fetchAllBookingsData,
  fetchAllUsers,
  fetchMonthlyData,
} from '../../utils/http';
import { BsCurrencyRupee } from 'react-icons/bs';
import { LuCreditCard, LuUsers } from 'react-icons/lu';
import { TbActivityHeartbeat } from 'react-icons/tb';
import numeral from 'numeral';
import NotificationPopUp from '../../components/admincomponents/notificationPopUp';
import ProfileDropDown from '../../components/admincomponents/profileDropDown';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

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

export default function AdminHomePage() {
  const [topPayment, setTopPayments] = useState<TopPayment | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [todayEarning, setTodayEarning] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<number[] | null>([]);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalMembers, setTotalMembers] = useState<number | null>(null);

  const {
    userName,
    userRole,
  }: {
    userName: string | null;
    userRole: string | null;
  } = useSelector((state: RootState) => state.auth);

  console.log(userName);

  useEffect(() => {
    try {
      const data = async () => {
        // Countusers
        const role = 'user';
        const userCount = await fetchAllUsers(role);
        setTotalUsers(userCount);
        // count member
        const memberrole = 'member';
        const memberCount = await fetchAllUsers(memberrole);
        setTotalMembers(memberCount);
        const data = await fetchAllBookingsData();
        setTodayEarning(data.todayRevenue);
        setTotalRevenue(data.totalRevenue);
        setMonthlyData(data.yearlyRevenue);

        const monthlydata = await fetchMonthlyData();
        setTopPayments(monthlydata);
      };
      data();
    } catch (error) {
      console.log(error);
    }
  }, []);

  function formatRevenue(revenue: any) {
    const crore = 10000000; // 1 crore = 10,000,000
    const lakh = 100000; // 1 lakh = 100,000

    if (revenue >= crore) {
      return `₹${(revenue / crore).toFixed(2)} CR`;
    } else if (revenue >= lakh) {
      return `₹${(revenue / lakh).toFixed(2)} L`;
    } else {
      return '₹' + numeral(revenue).format('0,0.00');
    }
  }

  return (
    <>
      <Sidebar>
        <div className="container mx-auto font-poppins ">
          <div className="text-3xl xs:flex items-center font-semibold -mt-5 mb-3 font-poppins">
            <p>Dashboard</p>
            <div className="flex justify-end w-full items-center">
              <div className="relative m-6 w-fit items-end ">
                <NotificationPopUp />
              </div>
              <ProfileDropDown />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                Total Revenue
                <BsCurrencyRupee className="md:ml-24 text-gray-400 mt-1" />
              </div>
              <p className="text-2xl font-medium ">
                {totalRevenue && totalRevenue !== null
                  ? formatRevenue(totalRevenue)
                  : 'Loading...'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                Today Earnings
                <LuCreditCard className="md:ml-20 text-gray-400 mt-1" />
              </div>
              <p className="text-2xl tracking-wider font-medium ">
                {todayEarning && todayEarning !== null
                  ? formatRevenue(todayEarning)
                  : '₹0'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                <p className="md:ml-3">Users</p>
                <LuUsers className="md:ml-[145px] mt-1 text-gray-400" />
              </div>
              <p className="text-2xl font-medium ml-3">
                {totalUsers !== null ? `+${totalUsers}` : 'Loading...'}
              </p>
              {/* <p className="text-green-500">+180.1% from last month</p> */}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-md  mb-4 flex">
                <p className="ml-2">Members</p>
                <TbActivityHeartbeat
                  size={22}
                  className="font-light md:ml-[115px] mt-1 text-gray-400"
                />
              </div>
              <p className="text-2xl font-medium ml-2">
                {totalMembers !== null ? `+${totalMembers}` : 'Loading...'}
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
                  You made {topPayment ? topPayment?.totalSales : '0'} Sales
                  this month
                </p>
              </div>
              <ul>
                {topPayment &&
                  topPayment.topMonthlyPayment.map((item, index) => (
                    <li
                      key={index}
                      className="md:flex items-center justify-between py-2 border-b mb-3"
                    >
                      <div className="md:flex items-center">
                        <img
                          src={item.userImage ? item.userImage : '/profile.png'}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full mr-4"
                        />
                        <div>
                          <p className="">{item.userName}</p>
                          <p className="">{item.userEmail}</p>
                        </div>
                      </div>
                      <p className="text-green-500">
                        ₹{numeral(item.totalPrice).format('0,0.00')}
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
