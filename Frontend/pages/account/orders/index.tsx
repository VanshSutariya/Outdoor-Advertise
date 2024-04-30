import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import NavBar from "../../../components/Header";
import { RootState } from "../../../store";

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const { userId }: { userId: string | null } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/booking?userId=${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch booking orders data.");
        }
        const data = await res.json();
        console.log(data);

        setOrders(data);

        // Dispatch an action to update Redux state with fetched cart data
      } catch (error) {
        console.error("Error fetching cart data:", error.message);
      }
    };
    func();
  }, [userId]);

  return (
    <>
      <NavBar />
      <div className=" h-screen py-8">
        <div className=" container  mx-auto px-4">
          <div className="flex justify-center text-2xl font-semibold mb-4 ">
            Orders History
          </div>
          <div className="flex flex-col justify-center md:flex-row gap-4">
            <div className="md:w-3/4 ">
              <div className="bg-slate-100 rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-b-gray-300">
                      <th className="text-left font-semibold pl-8  ">
                        Product
                      </th>
                      <th className="text-left font-semibold ">
                        Booking Dates
                      </th>
                      <th className="text-left font-semibold ">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b-2 border-b-gray-300"
                        >
                          <td className="py-4 ">
                            <div className="flex items-center">
                              <img
                                className="md:h-[120px] md:w-[150px] h-16 w-12 mr-4 md:rounded-3xl"
                                src={item.image}
                                alt="Product image"
                              />
                              <span className="flex-col font-semibold text-lg">
                                {item.title}
                                <p className="text-[15px] font-normal">
                                  {item.address}
                                </p>
                              </span>
                            </div>
                          </td>
                          <td>
                            {item.bookingDate[0] +
                              "  -  " +
                              item.bookingDate[item.bookingDate.length - 1]}
                          </td>
                          <td className="text-[21px] font-semibold">
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
        <Link href="/" className="">
          <p className="mt-3 flex justify-center text-blue-400 text-lg">
            <IoIosArrowRoundBack size={30} />
            back to shopping
          </p>
        </Link>
      </div>
    </>
  );
}
