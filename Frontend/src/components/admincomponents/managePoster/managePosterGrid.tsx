import React, { useEffect, useState } from "react";
import { ManagePoster } from "@/utils/http";
import ManagePosterItem from "./managePosterItem";
import { io } from "socket.io-client";
import toastFunction from "@/components/reactToast/toast";

interface Poster {
  _id: string;
  title: string;
  image: string;
  price: number;
  lightingType: string;
}

const ManagePosterGrid: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posterData, setPosterData] = useState<Poster[]>([]);
  const [page, setPage] = useState<number>(1);
  const [avgBooking, setAvgBooking] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  const per_page: number = 6;
  const socket = io("http://localhost:4040");

  useEffect(() => {
    socket.on("posterReq", (val) => {
      console.log("call data", val, val[0]);
      const data = val;

      setPosterData((prev) => [...prev, data]);
      setError(null);
    });

    return () => {
      socket.off("connection");
      socket.off("posterReq");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    setError(null);
    const fetchData = async () => {
      try {
        let resData: any;
        const status = "pending";
        resData = await ManagePoster(status, page, per_page);

        setLoading(false);

        setTotalPages(Math.ceil(resData.totalLength / per_page));
        setPosterData(resData.resData);
        setAvgBooking(resData.averageBooking);

        let pageNumbers: number[] = [];
        const offsetNumber: number = 2;
        for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
          if (i >= 1 && i <= totalPages) {
            pageNumbers.push(i);
          }
        }
        setPageNumbers(pageNumbers);
      } catch (error: any) {
        setLoading(false);
        setError(error.message);
      }
    };

    fetchData();
  }, [page, totalPages]);

  if (error || loading) {
    return (
      <div className="flex justify-center text-3xl font-poppins h-[260px] mt-16">
        {error}
        {loading && (
          <div className="rounded-full h-10 w-10 bg-gray-700 animate-ping"></div>
        )}
      </div>
    );
  }
  const handlePrevClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  const handlePagebutton = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <>
      <div className=" px-6 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-2 mx-auto justify-items-center ">
        {!error &&
          posterData.length > 0 &&
          posterData.map((poster: Poster) => (
            <div
              className="mt-8 rounded-lg transform inline-block overflow-hidden transition-transform duration-300  hover:scale-130"
              key={poster._id}
            >
              <ManagePosterItem {...poster} avgBooking={avgBooking} />
            </div>
          ))}
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
    </>
  );
};

export default ManagePosterGrid;
