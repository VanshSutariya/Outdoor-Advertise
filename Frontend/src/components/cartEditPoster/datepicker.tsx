"use client";
import { useEffect, useRef, useState } from "react";
import { addDays } from "date-fns";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useFindWidth from "../hooks/useWidth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import BillingPoster from "./billingPoster";

interface DatePickerProps {
  id: string;
  price: number;
  minDays: number;
  mediatype: string | boolean;
  minQty: number;
  maxQty: number;
  bookingDate: string[];
}
const DatePickerCart: React.FC<DatePickerProps> = ({
  id,
  price,
  minDays,
  mediatype,
  minQty,
  maxQty,
  bookingDate,
}) => {
  const windowWidth = useFindWidth();
  const [diffInDays, setDiffInDays] = useState<number>(0);
  const noOfAuto = useRef<HTMLInputElement>(undefined!);
  const [autoInputError, setAutoInputError] = useState<string>();

  const { isLoggedIn }: { isLoggedIn: boolean } = useSelector(
    (state: RootState) => state.auth
  );

  const { items } = useSelector((state: RootState) => state.cart);

  const existingItem = items.find((item) => item.posterId === id);
  let matchingItems: any;
  if (existingItem) {
    matchingItems = items.filter((item) => item.posterId === id);
  }

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

  useEffect(() => {
    if (existingItem) {
      const newCartStartDate = matchingItems[0].bookingDate;

      const parsedStartDate = new Date(newCartStartDate[0]);
      const parsedEndDate = new Date(
        newCartStartDate[newCartStartDate.length - 1]
      );
      setState([
        {
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          key: "selection",
        },
      ]);
    }
  }, [existingItem]);

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

  const handleAutoChange = () => {
    const inputValue = parseInt(noOfAuto.current.value, 10);
    if (inputValue < minQty || inputValue > maxQty) {
      setAutoInputError(
        `Book minimum ${minQty} and maximum ${maxQty} Quantity.`
      );
    } else {
      setAutoInputError("");
    }
  };

  const totalPrice = mediatype
    ? parseInt(noOfAuto.current?.value, 10) > 0
      ? parseInt(noOfAuto.current.value, 10) * price * diffInDays
      : 1 * price * diffInDays
    : price * diffInDays;
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
        <BillingPoster
          id={id}
          price={price}
          state={state}
          maxQty={maxQty}
          minQty={minQty}
          minDays={minDays}
          noOfAuto={noOfAuto}
          mediatype={mediatype}
          totalPrice={totalPrice}
          diffInDays={diffInDays}
          isLoggedIn={isLoggedIn}
          autoInputError={autoInputError}
          handleAutoChange={handleAutoChange}
        />
      </div>
    </>
  );
};

export default DatePickerCart;
