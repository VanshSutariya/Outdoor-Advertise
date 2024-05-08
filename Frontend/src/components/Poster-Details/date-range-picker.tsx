"use client";
import { useEffect, useRef, useState } from "react";
import { addDays, max } from "date-fns";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useFindWidth from "../hooks/useWidth";
import { useSelector } from "react-redux";
import Billing from "./billing";
import { RootState } from "@/store";

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
  const noOfAuto = useRef<HTMLInputElement>();
  const [autoInputError, setAutoInputError] = useState<string>();

  const { isLoggedIn }: { isLoggedIn: boolean } = useSelector(
    (state: RootState) => state.auth
  );

  const calculateMinDate = (): Date => {
    let nextAvailableDate = new Date();
    const arr = bookingDate;

    // Find the next available date that is not in the bookingDate array
    while (arr.includes(nextAvailableDate.toLocaleDateString())) {
      nextAvailableDate = addDays(nextAvailableDate, 1);
    }

    let startDate = nextAvailableDate;
    // Find the end date based on the minimum days
    const md = Number(minDays) - 1;
    let endDate = addDays(startDate, md);

    // Check if there are any disabled dates or already booked dates between the start and end date
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      if (arr.includes(date.toLocaleDateString())) {
        // If a disabled date is found, adjust the start date accordingly
        startDate = addDays(date, 1);
        // Reset the end date based on the adjusted start date
        const mdd = Number(minDays) - 1;
        endDate = addDays(startDate, mdd);
        // Reset the loop to check again from the adjusted start date
        // date = new Date(startDate);
      }
    }

    return startDate;
  };

  const [state, setState] = useState([
    {
      startDate: calculateMinDate(), // Set the start date dynamically
      endDate: addDays(calculateMinDate(), minDays ? minDays - 1 : 3), // Adjust the end date accordingly
      key: "selection",
    },
  ]);
  console.log("initial state ================", state);

  const NextAvailableDate = (): Date => {
    let nextAvailableDate = new Date();
    const arr = bookingDate;

    // Find the next available date that is not in the bookingDate array
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
    const inputValue = parseInt(noOfAuto.current!.value, 10);
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

  return (
    <>
      <div className=" md:flex ">
        <div className="mx-10 md:pt-5 border-[2px]   border-gray-200 shadow-md shadow-gray-300 rounded-2xl p-3 ">
          <DateRange
            onChange={(item: any) => setState([item.selection])}
            ranges={state}
            minDate={calculateMinDate()}
            rangeColors={["#EC7A20"]}
            months={2}
            direction={windowWidth < 780 ? "vertical" : "horizontal"}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            disabledDates={bookingDate}
          />
          <div className="">
            <button
              className="text-md border-2 md:ml-4 px-2 py-1 border-black rounded-lg font-poppins bg-black text-white hover:scale-105 active:scale-95 "
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
          noOfAuto={noOfAuto}
          mediatype={mediatype}
          totalPrice={totalPrice}
          diffInDays={diffInDays}
          isLoggedIn={isLoggedIn}
          bookingDate={bookingDate}
          autoInputError={autoInputError}
          handleAutoChange={handleAutoChange}
        />
      </div>
    </>
  );
};

export default DatePicker;
