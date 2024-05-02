import React, { useEffect, useState } from 'react';
import PosterItem from './poster-item';
import { fetchAllPoster } from '../../utils/http';

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
  id?: string;
}

const PosterGrid: React.FC<PosterGridProps> = (props) => {
  const [posterData, setPosterData] = useState<Poster[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  let per_page: number = 6;
  const totalPages: number = Math.ceil(props.totalLength / per_page);
  let isPageOutOfRange: boolean;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.id) {
          const resData: Poster[] = await fetchAllPoster(
            page,
            per_page,
            props.id,
          );
          setPosterData(resData);
        } else {
          const resData: Poster[] = await fetchAllPoster(page, per_page);
          setPosterData(resData);
        }

        let pageNumbers: number[] = [];
        const offsetNumber: number = 2;
        isPageOutOfRange = page > totalPages;
        for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
          if (i >= 1 && i <= totalPages) {
            pageNumbers.push(i);
          }
        }
        setPageNumbers(pageNumbers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, props.totalLength, totalPages]);

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
        {posterData.map((poster: Poster) => (
          <div
            className="mt-8 rounded-lg transform inline-block overflow-hidden transition-transform duration-300  hover:scale-130"
            key={poster._id}
          >
            {props.id ? (
              <PosterItem {...poster} id={props.id} />
            ) : (
              <PosterItem {...poster} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-5 ">
        {isPageOutOfRange ? (
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
                      ? 'bg-gray-800 fw-bold px-2 rounded-md text-white '
                      : 'hover:bg-gray-800 hover:text-white px-1 rounded-md '
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
