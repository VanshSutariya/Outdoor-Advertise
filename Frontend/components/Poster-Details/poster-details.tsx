'use client';
import { fetchOnePoster } from '../../utils/http';
import { useEffect, useState } from 'react';
import DatePicker from './date-range-picker';
import { CiLocationOn } from 'react-icons/ci';
import { LiaTagSolid } from 'react-icons/lia';

import { IoIosArrowRoundBack } from 'react-icons/io';
import Link from 'next/link';

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
}

interface PosterDetailsProps {
  id: string;
}

const PosterDetails: React.FC<PosterDetailsProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [posterData, setPosterData] = useState<PosterData>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData: PosterData = await fetchOnePoster(id);
        // Simulate loading for 1 second
        setPosterData(resData);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className=" flex justify-center text-2xl font-bold mt-16 mb-16 h-screen ">
        Loading...
      </div>
    );
  }

  if (!posterData) {
    return <div>Error: Failed to fetch poster data</div>;
  }
  const lat: number = 23.02436884189762;
  const lng: number = 72.53198504447938;
  const url: string = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;

  const excludeFields = [
    '_id',
    'image',
    '__v',
    'latLng',
    'title',
    'createdAt',
    'updatedAt',
  ];

  const dataEntries = Object.entries(posterData).filter(
    ([key]) => !excludeFields.includes(key),
  );

  const capitalizedTitle = posterData.title
    .split(' ')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
  return (
    <>
      <div>
        <Link
          href="/"
          className=" text-lg md:px-[60px] pt-3 flex text-blue-600 hover:text-blue-700 active:text-blue-500"
        >
          <IoIosArrowRoundBack size={30} /> Back
        </Link>
      </div>
      <div className="md:flex items-center justify-center">
        <div className="md:w-1/3 pt-2  p-5 rounded-lg mb-9">
          <img
            className="rounded-2xl md:h-[300px] h-[300px] w-full"
            src={posterData.image}
            alt="poster1-image"
          />
        </div>
        <div className="w-full border-[2px] border-gray-100 shadow-md sm:w-full md:w-1/2 rounded-lg ">
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
              <p className=" text-slate-600">
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
              <div className="text-slate-600">
                <p className="">
                  Size:{posterData.size} | Area: {posterData.sft} squarefoot |
                  MediaType: {posterData.mediatype}
                </p>
                <p>
                  LightingType: {posterData.lightingType?.toLocaleLowerCase()}{' '}
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
              <div className="text-slate-600">
                <p>
                  {' '}
                  Minimum Booking Days : {posterData.minimumDays} days{' '}
                  {posterData.mediatype === 'Rickshaws'
                    ? `| MinAutos :${posterData.minQty} | MaxAutos:${posterData.maxQty} `
                    : ''}
                  {posterData.mediatype === 'Poles'
                    ? `| MinPoles :${posterData.minQty} | MaxPoles:${posterData.maxQty} `
                    : ''}
                </p>
              </div>
            </div>
            <div className="flex  justify-center pt-4">
              <p className="-pl-3">
                <span className="text-lg">Price </span>{' '}
                <span className="text-xl ml-5 text-green-500 font-bold font-poppins">
                  {posterData.mediatype === 'Rickshaws'
                    ? `₹${posterData.price}/ auto`
                    : `₹${posterData.price}/ day`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="rounded-lg pb-10 w-full flex ">
        <iframe
          title="Google Maps"
          width="100%"
          height="300"
          src={url}
        ></iframe>
      </div> */}
      <div className="justify-center flex pb-3">
        <DatePicker
          title={posterData.title}
          price={posterData.price}
          minDays={posterData.minimumDays}
          mediatype={
            posterData.mediatype === 'Rickshaws' ||
            posterData.mediatype === 'Poles'
              ? posterData.mediatype
              : false
          }
          minQty={posterData.minQty}
          maxQty={posterData.maxQty}
          bookingDate={posterData.bookingDate}
          id={id}
          image={posterData.image}
          address={posterData.address}
        />
      </div>
    </>
  );
};

export default PosterDetails;
