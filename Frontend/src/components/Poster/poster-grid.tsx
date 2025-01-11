"use client";
import React, { useEffect, useState } from "react";
import PosterItem from "./poster-item";
import { useSearchParams } from "next/navigation";
import { fetchAllPoster } from "@/utils/http";
import { io } from "socket.io-client";
import data from '../../utils/data.json'

interface Poster {
  _id: string;
  title: string;
  image: string;
  price: number;
  lightingType: string;
  createdBy: string;
  mediatype: string;
  totalBooking: number;
}

interface PosterGridProps {
  id?: string;
}

const PosterGrid: React.FC<PosterGridProps> = (props) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const address = searchParams.get("address") || undefined;
  const state = searchParams.get("state") || undefined;
  const city = searchParams.get("city") || undefined;
  const isPopularClicked = searchParams.get("isPopularClicked") || undefined;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [posterData, setPosterData] = useState<Poster[]>([]);
  const [page, setPage] = useState<number>(1);
  const [avgBooking, setAvgBooking] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  const dummydata: any = data;
  const per_page: number = 6;

  const socket = io("http://localhost:4040");

  useEffect(() => {
    socket.on("posterRes", (val) => {
      console.log("call data", val, val[0]);
      const data = val;

      setPosterData((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connection");
      socket.off("posterRes");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    setError(null);
    const fetchData = async () => {
      try {
        let resData: any;
        if (props.id) {
          resData = await fetchAllPoster(
            page,
            per_page,
            props.id,
            isPopularClicked
          );
        } else {
          const mediatype = category;
          resData = await fetchAllPoster(
            page,
            per_page,
            undefined,
            address,
            state,
            city,
            mediatype,
            isPopularClicked
          ).catch(error => {
            setTotalPages(5)
            setPosterData(getObjectsByPage(page, dummydata, mediatype));
            setLoading(false);

          })
        }
        if (resData) {

          setTotalPages(Math.ceil(resData.totalLength / per_page));
          setLoading(false);

          setPosterData(resData.resData);
          setAvgBooking(resData.averageBooking);
        }

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
        console.error("Error fetching data:", error);
      }
    };
    setLoading(true);
    fetchData();
  }, [page, totalPages, searchParams]);

  if (error || loading) {
    return (
      <div className="flex justify-center text-3xl font-poppins h-screen mt-16">
        {error ? "Something Went Wrong. Please Try Again Later." : ""}
        {loading && (
          <div className="rounded-full h-10 w-10 bg-gray-700 animate-ping"></div>
        )}
      </div>
    );
  }
  function getObjectsByPage(page: number, dataArray: any[], mediatype: string | undefined) {
    const pageSize = 6;
    const startIndex = (page - 1) * pageSize;
    let arr = dataArray.slice(startIndex, startIndex + pageSize);
    if (mediatype) {
      arr = arr.filter(data => data.mediatype === mediatype)
    }

    return arr

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
      {!error && posterData.length > 0 ? (
        <div className=" px-6 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-2 mx-auto justify-items-center ">
          {posterData.map((poster: Poster) => (
            <div
              className="mt-8 rounded-lg transform inline-block overflow-hidden transition-transform duration-300  hover:scale-130"
              key={poster._id}
            >
              {props.id && props.id === poster.createdBy && (
                <PosterItem {...poster} avgBooking={avgBooking} id={props.id} />
              )}
              {!props.id && <PosterItem {...poster} avgBooking={avgBooking} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="justify-center text-center text-3xl font-poppins h-[260px] mt-16">
          Currently No Poster Available.
        </div>
      )}
      <div className="flex justify-center gap-2 mb-5 ">
        {page > totalPages ? (
          <div></div>
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

export default PosterGrid;
