"use client";
import { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { LiaTagSolid } from "react-icons/lia";

import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchOnePoster } from "@/utils/http";
import GoogleMaps from "@/components/Poster-Details/googleMap";
import ManageButtons from "./manageButtons";

interface PosterData {
  id: number;
  image: string;
  title: string;
  price: number;
  size: string;
  sft: number;
  lightingType: string;
  address: string;
  facingFrom: string;
  minimumDays: number;
  mediatype: string;
  minQty: number;
  maxQty: number;
  state: string;
  city: string;
  bookingDate: string[];
  createdBy: string;
  latLng: number[];
}

interface PosterDetailsProps {
  id: string;
}

const ManagePosterDetails: React.FC<PosterDetailsProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posterData, setPosterData] = useState<PosterData>();
  const { token }: { token: string } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData: PosterData = await fetchOnePoster(id);
        // Simulate loading for 1 second
        setPosterData(resData);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className=" flex-col font-poppins text-center text-3xl font-bold mt-16  h-screen ">
        <div className="pb-4 flex justify-center">
          {!error && loading && (
            <div className=" rounded-full h-10 w-10 bg-gray-700 animate-ping"></div>
          )}

          {error && (
            <main>
              <p>{error}</p>
              <Link
                href="."
                className="text-2xl md:px-[60px] pt-3 font-inter font-semibold flex text-blue-400 hover:text-blue-500 active:text-blue-500"
              >
                <div className=" hover:scale-110 active:scale-95 duration-150 flex w-full text-center justify-center md:mr-5">
                  <IoIosArrowRoundBack size={33} /> Back
                </div>
              </Link>
            </main>
          )}
        </div>
      </div>
    );
  }

  if (!posterData) {
    return <div>Error: Failed to fetch poster data</div>;
  }

  const excludeFields = [
    "_id",
    "image",
    "__v",
    "title",
    "createdAt",
    "updatedAt",
  ];

  const dataEntries = Object.entries(posterData).filter(
    ([key]) => !excludeFields.includes(key)
  );

  const capitalizedTitle = posterData.title
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
  return (
    <>
      <div>
        <Link
          href="."
          className="text-2xl md:px-[60px] pt-3 font-inter font-semibold flex text-blue-400 hover:text-blue-800 active:text-blue-500"
        >
          <p className="hover:scale-110 active:scale-95 duration-150 flex">
            <IoIosArrowRoundBack size={30} /> Back
          </p>
        </Link>
      </div>
      <div className="md:flex items-center justify-center">
        <div className="md:w-1/3 md:mr-16  p-5 rounded-lg mb-9">
          <img
            className="rounded-2xl  md:h-[300px] h-[300px] w-full"
            src={posterData.image}
            alt="poster1-image"
          />
        </div>
        <div className="w-full md:-mt-8 border-[2px] border-gray-100 shadow-md sm:w-full md:w-1/2 rounded-lg ">
          <h1 className="mt-5 flex  justify-center text-3xl text-gray-800 font-bold tracking-wider font-inter">
            {capitalizedTitle}
          </h1>
          <div className="p-5">
            {/* location */}
            <div className="border-b-[2px] border-t-[2px] border-gray-300 pb-[5px]">
              <div className=" flex ">
                <div className="pt-[5px] pr-[3px] ">
                  <CiLocationOn size={18} />
                </div>
                <p className="text-lg">Location:</p>
              </div>
              <p className=" text-slate-600 md:ml-5">
                {posterData.address?.toLocaleLowerCase()},
                {posterData.city?.toLocaleLowerCase()},
                {posterData.state?.toLocaleLowerCase()}
              </p>
            </div>
            {/* specification */}
            <div className="border-b-[2px] border-gray-300 pb-[5px]">
              <div className="text-lg flex  ">
                <div className="pt-[8px] pr-[3px] ">
                  <LiaTagSolid size={17} />
                </div>
                <p>Specifications:</p>
              </div>
              <div className="text-slate-600 md:ml-5">
                <p className="">
                  Size:{posterData.size} | Area: {posterData.sft} squarefoot |
                  MediaType: {posterData.mediatype}
                </p>
                <p>
                  LightingType: {posterData.lightingType?.toLocaleLowerCase()}{" "}
                </p>
              </div>
            </div>
            {/* Booking Info */}
            <div className="border-b-[2px] border-gray-300 pb-[5px]">
              <div className="text-lg flex ">
                <div className="pt-[8px] pr-[3px] ">
                  <LiaTagSolid size={17} />
                </div>
                <p>Booking Info:</p>
              </div>
              <div className="text-slate-600 md:ml-5">
                <p>
                  {" "}
                  Minimum Booking Days : {posterData.minimumDays} days{" "}
                  {posterData.mediatype === "Rickshaws"
                    ? `| MinAutos :${posterData.minQty} | MaxAutos:${posterData.maxQty} `
                    : ""}
                  {posterData.mediatype === "Poles"
                    ? `| MinPoles :${posterData.minQty} | MaxPoles:${posterData.maxQty} `
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex  justify-center pt-4">
              <p className="-pl-3">
                <span className="text-lg">Price </span>{" "}
                <span className="text-xl ml-5 text-green-500 font-bold font-poppins">
                  {posterData.mediatype === "Rickshaws"
                    ? `₹${posterData.price}/ auto`
                    : posterData.mediatype === "Poles"
                    ? `₹${posterData.price}/ pole`
                    : `₹${posterData.price}/ day`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-8 flex justify-center ">
        <GoogleMaps
          latitude={posterData.latLng[0]}
          longitude={posterData.latLng[1]}
        ></GoogleMaps>
      </div>
      <ManageButtons id={id} />
    </>
  );
};

export default ManagePosterDetails;
