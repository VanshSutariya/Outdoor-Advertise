import React, { useEffect, useState } from "react";
import PosterItem from "./poster-item";
import { fetchAllPoster } from "../../utils/http";

interface Poster {
  _id: string;
  title: string;
  image: string;
  price: number;
  lightingType: string;

  // Define other properties of the poster object
}

interface PosterGridProps {
  totalLength: number;
}

const PosterGrid: React.FC<PosterGridProps> = ({ totalLength }) => {
  const [posterData, setPosterData] = useState<Poster[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  let per_page: number = 6;
  const totalPages: number = Math.ceil(totalLength / per_page);
  let isPageOutOfRange: boolean;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData: Poster[] = await fetchAllPoster({ page, per_page });
        setPosterData(resData);

        let pageNumbers: number[] = [];
        const offsetNumber: number = 2;
        isPageOutOfRange = page > totalPages;
        for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
          if (i >= 1 && i <= totalPages) {
            pageNumbers.push(i);
          }
        }
        console.log(pageNumbers);
        setPageNumbers(pageNumbers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, totalLength, totalPages]);

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
      <div className=" px-6 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto justify-items-center ">
        {posterData.map((poster: Poster) => (
          <div
            className="my-4 rounded-lg hover:shadow-xl hover:scale-105 hover:shadow-neutral-300 "
            key={poster._id}
          >
            <PosterItem {...poster} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-5 ">
        {isPageOutOfRange ? (
          <div>No more pages...</div>
        ) : (
          <div className="flex justify-center items-center mt-16">
            <div className="flex border-[2px] gap-4 rounded-[10px] border-black p-4">
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
                      ? "bg-green-500 fw-bold px-2 rounded-md text-black "
                      : "hover:bg-green-500 px-1 rounded-md "
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
