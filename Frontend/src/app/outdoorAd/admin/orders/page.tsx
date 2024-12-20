"use client";
import { useEffect, useState } from "react";
import numeral from "numeral";
import { fetchAllBookingsOrders } from "@/utils/http";
import Sidebar from "@/components/admincomponents/sidebar";
import { differenceInDays } from "date-fns";

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
const OrderAdminPage = () => {
  const [orders, setOrders] = useState<Orders[]>();
  const [page, setPage] = useState<number>(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  let per_page: number = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newOrders: any = await fetchAllBookingsOrders({
          page,
          per_page,
        });
        setTotalPages(Math.ceil(newOrders.totalLength / per_page));

        setOrders(newOrders.resData);

        let pageNumbers: number[] = [];
        const offsetNumber: number = 2;

        for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
          if (i >= 1 && i <= totalPages) {
            pageNumbers.push(i);
          }
        }
        setPageNumbers(pageNumbers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, totalPages]);

  const handlePrevClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  const handlePagebutton = (pageNumber: number) => {
    setPage(pageNumber);
  };

  function formatRevenue(revenue: any) {
    const crore = 10000000;
    const lakh = 100000;

    if (revenue >= crore) {
      return `₹${(revenue / crore).toFixed(2)} CR`;
    } else if (revenue >= lakh) {
      return `₹${(revenue / lakh).toFixed(2)} L`;
    } else {
      return "₹" + numeral(revenue).format("0,0.00");
    }
  }
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
    <Sidebar>
      <div className="overflow-x-auto">
        <div>
          <h1 className="text-2xl font-inter p-3 md:mb-3 font-semibold ">
            All Orders History
          </h1>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-300">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 w-[750px] font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  BookingDates
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-poppins">
              {orders &&
                orders?.map((item: any) => (
                  <tr key={item._id}>
                    <td className="py-4 ">
                      <div className="flex items-center">
                        <img
                          className="md:h-[100px] md:w-[120px] h-16 w-12 md:ml-2 mr-4 md:rounded-3xl"
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
                    <td className="text-[21px] font-semibold text-center">
                      {calculateQuantity(
                        item.totalPrice,
                        item.posterId.price,
                        new Date(item.bookingDate[item.bookingDate.length - 1]),
                        new Date(item.bookingDate[0])
                      )}
                    </td>
                    <td>
                      {item.bookingDate[0] +
                        "  -  " +
                        item.bookingDate[item.bookingDate.length - 1]}
                    </td>
                    <td className="text-lg ">
                      {formatRevenue(item.totalPrice)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-5 ">
        {page > totalPages ? (
          <div>No more pages...</div>
        ) : (
          <div className="flex justify-center items-center mt-16">
            <div className="flex border-[2px] gap-4 rounded-[10px] border-black p-2">
              {page === 1 ? (
                <div className="opacity-60" aria-disabled="true">
                  Previous
                </div>
              ) : (
                <button
                  className="font-semibold"
                  onClick={handlePrevClick}
                  aria-label="Previous Page"
                >
                  Previous
                </button>
              )}

              {pageNumbers.map((pageNumber: number, index: number) => (
                <button
                  key={index}
                  className={
                    page === pageNumber
                      ? "bg-gray-800 fw-bold px-2 rounded-md text-white "
                      : "hover:bg-gray-800 hover:text-white px-1 rounded-md "
                  }
                  onClick={() => handlePagebutton(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              {page === totalPages ? (
                <div className="opacity-60" aria-disabled="true">
                  Next
                </div>
              ) : (
                <button
                  className="font-semibold"
                  onClick={handleNextClick}
                  aria-label="Next Page"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default OrderAdminPage;
