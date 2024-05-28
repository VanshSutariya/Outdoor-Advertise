"use client";

import Billing from "./billing";
import { addDays } from "date-fns";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-date-range";
import useFindWidth from "../hooks/useWidth";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DatePickerProps {
  id: string;
  image: string;
  title: string;
  address: string;
  price: number;
  minDays: number;
  mediatype: string | boolean;
  minQty: number;
  maxQty: number;
  bookingDate: string[];
  createdBy: string;
}
const DatePicker: React.FC<DatePickerProps> = ({
  id,
  image,
  title,
  address,
  price,
  minDays,
  mediatype,
  minQty,
  maxQty,
  bookingDate,
  createdBy,
}) => {
  const windowWidth = useFindWidth();
  const [diffInDays, setDiffInDays] = useState<number>(0);

  const { isLoggedIn }: { isLoggedIn: boolean } = useSelector(
    (state: RootState) => state.auth
  );

  const calculateMinDate = (): Date => {
    let nextAvailableDate = new Date();
    const arr = bookingDate;

    while (arr.includes(nextAvailableDate.toLocaleDateString())) {
      nextAvailableDate = addDays(nextAvailableDate, 1);
    }

    let startDate = nextAvailableDate;

    const md = Number(minDays) - 1;
    let endDate = addDays(startDate, md);
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      if (arr.includes(date.toLocaleDateString())) {
        startDate = addDays(date, 1);
        const mdd = Number(minDays) - 1;
        endDate = addDays(startDate, mdd);
      }
    }

    return startDate;
  };

  const [state, setState] = useState([
    {
      startDate: calculateMinDate(),
      endDate: addDays(calculateMinDate(), minDays ? minDays - 1 : 3),
      key: "selection",
    },
  ]);

  const NextAvailableDate = (): Date => {
    let nextAvailableDate = new Date();
    const arr = bookingDate;

    while (arr.includes(nextAvailableDate.toLocaleDateString())) {
      nextAvailableDate = addDays(nextAvailableDate, 1);
    }

    return nextAvailableDate;
  };
  const clearDates = () => {
    setState([
      {
        startDate: NextAvailableDate(),
        endDate: NextAvailableDate(),
        key: "selection",
      },
    ]);
  };

  useEffect(() => {
    const diff = differenceInDays(state[0].endDate, state[0].startDate) + 1;
    setDiffInDays(diff);
  }, [state]);

  const convertedBookingDates = bookingDate.map(
    (dateString) => new Date(dateString)
  );
  return (
    <>
      <div className="md:flex">
        <div className="mx-10 md:pt-5 border-[2px] border-gray-200 shadow-md shadow-gray-300 rounded-2xl p-3 ">
          <DateRange
            onChange={(item: any) => setState([item.selection])}
            ranges={state}
            minDate={calculateMinDate()}
            rangeColors={["#EC7A20"]}
            months={2}
            direction={windowWidth < 780 ? "vertical" : "horizontal"}
            // showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            disabledDates={convertedBookingDates}
          />
          <div className="">
            <button
              className="text-md border-2 md:ml-4 px-2 py-1 border-black rounded-lg  bg-black text-white hover:scale-105 active:scale-95 "
              onClick={clearDates}
            >
              Clear Date
            </button>
          </div>
        </div>
        <Billing
          id={id}
          title={title}
          image={image}
          price={price}
          state={state}
          maxQty={maxQty}
          minQty={minQty}
          createdBy={createdBy}
          address={address}
          minDays={minDays}
          mediatype={mediatype}
          diffInDays={diffInDays}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </>
  );
};

export default DatePicker;
