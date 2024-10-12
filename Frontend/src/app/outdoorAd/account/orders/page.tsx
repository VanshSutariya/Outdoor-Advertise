"use client";
import Link from "next/link";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { IoIosArrowRoundBack } from "react-icons/io";
import NavBar from "@/components/Header";

interface Orders {
  _id: string;
  title: string;
  image: string;
  address: string;
  bookingDate: string[];
  totalPrice: number;
  posterId: {
    price: number;
  };
}
export default function OrderPage() {
  const [orders, setOrders] = useState<Orders[]>();
  const { userId, token }: { userId: string | null; token: string } =
    useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/booking?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch booking orders data.");
        }
        setOrders(data.resData);
      } catch (error: any) {
        console.error("Error fetching cart data:", error.message);
      }
    };
    func();
  }, [userId]);

  function calculateQuantity(
    totalPrice: number,
    price: number,
    EndDate: Date,
    StartDate: Date
  ) {
    const noOfDays = differenceInDays(EndDate, StartDate) + 1;
    return Math.round(totalPrice / (price * 1.05 * noOfDays));
  }
  return (
    <>
      <NavBar />
      <div className="py-6 overflow-x-auto">
        <div className=" px-4">
          <div className="flex justify-center font-inter text-2xl font-semibold mb-4 ">
            Orders History
          </div>
          <div className=" flex flex-col justify-center md:flex-row gap-4">
            <div className="md:w-4/5 ">
              <div className="overflow-hidden bg-slate-100 rounded-lg shadow-md p-6 mb-4">
                <table className="table-auto min-w-full divide-y font-poppins">
                  <thead>
                    <tr className="text-left  border-b-[2px] border-b-gray-300 ">
                      <th className=" font-semibold pl-8 tracking-widest">
                        Product
                      </th>
                      <th className=" font-semibold pr-2 tracking-widest">
                        Quantity
                      </th>
                      <th className="sm:px-2 tracking-widest font-semibold md:w-[200px]">
                        Booking Dates
                      </th>

                      <th className="text-left font-semibold tracking-widest">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b-[2px] border-b-gray-300"
                        >
                          <td className="py-4 ">
                            <div className="flex items-center">
                              <img
                                className="md:h-[120px] md:w-[150px] h-16 w-12 mr-4 md:rounded-3xl"
                                src={item.image}
                                alt="Product image"
                              />
                              <span className="flex-col font-semibold text-lg md:mr-4">
                                {item.title}
                                <p className="text-[15px] font-normal ">
                                  {item.address}
                                </p>
                              </span>
                            </div>
                          </td>
                          <td className="text-[21px] font-semibold sm:pl-2">
                            {calculateQuantity(
                              item.totalPrice,
                              item.posterId.price,
                              new Date(
                                item.bookingDate[item.bookingDate.length - 1]
                              ),
                              new Date(item.bookingDate[0])
                            )}
                          </td>
                          <td>
                            {item.bookingDate[0] +
                              "  -  " +
                              item.bookingDate[item.bookingDate.length - 1]}
                          </td>
                          <td className="text-[21px] font-semibold ">
                            ₹{item.totalPrice}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Link href="/outdoorAd" className="">
          <p className="mt-3 flex justify-center font-poppins font-medium hover:text-blue-500 hover:scale-105 active:scale-90 text-blue-400 text-xl ">
            <IoIosArrowRoundBack size={30} />
            back to shopping
          </p>
        </Link>
      </div>
    </>
  );
}
