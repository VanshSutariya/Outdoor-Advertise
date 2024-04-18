"use client";
import { useEffect, useRef, useState } from "react";
import { addDays, max } from "date-fns";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useFindWidth from "../../hooks/useWidth";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Billing from "./billing";

interface DatePickerProps {
  price: number;
  minDays: number;
  rickshaws: boolean;
  minauto: number;
  maxauto: number;
  bookingDate: string[];
}
const DatePicker: React.FC<DatePickerProps> = ({
  price,
  minDays,
  rickshaws,
  minauto,
  maxauto,
  bookingDate = [],
}) => {
  const windowWidth = useFindWidth();
  const [bookingDates, setBookingDates] = useState<string[]>([]);
  const [diffInDays, setDiffInDays] = useState<number>(0);
  const noOfAuto = useRef<HTMLInputElement>(null);
  const [autoInputError, setAutoInputError] = useState<string | null>(null);

  const { user, isLoggedIn }: { user: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  const calculateMinDate = (): Date => {
    let nextAvailableDate = new Date();
    const arr = bookingDate;
    console.log(arr);
    while (arr.includes(nextAvailableDate.toLocaleDateString())) {
      nextAvailableDate = addDays(nextAvailableDate, 1);
    }
    console.log("first", nextAvailableDate);

    return nextAvailableDate;
  };

  const [state, setState] = useState([
    {
      startDate: calculateMinDate(), // Set the start date dynamically
      endDate: addDays(calculateMinDate(), minDays ? minDays : 3), // Adjust the end date accordingly
      key: "selection",
    },
  ]);

  const clearDates = () => {
    setState([
      {
        startDate: calculateMinDate(),
        endDate: addDays(calculateMinDate(), minDays),
        key: "selection",
      },
    ]);
  };

  useEffect(() => {
    const diff = differenceInDays(state[0].endDate, state[0].startDate) + 1;
    setDiffInDays(diff);
  }, [state]);

  const handleBookedDates = () => {
    const startDate = state[0].startDate;
    const endDate = state[0].endDate;

    const datesArray = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      datesArray.push(new Date(date).toLocaleDateString());
    }

    setBookingDates([...bookingDate, ...datesArray]);
  };

  const handleAutoChange = () => {
    const inputValue = parseInt(noOfAuto.current!.value, 10);
    if (inputValue < minauto || inputValue > maxauto) {
      setAutoInputError(
        `Book min ${minauto} and max ${maxauto} Auto Quantity.`
      );
    } else {
      setAutoInputError(null);
    }
  };

  const totalPrice = rickshaws
    ? noOfAuto.current &&
      parseInt(noOfAuto.current.value, 10) * price * diffInDays
    : price * diffInDays;

  return (
    <>
      <div className=" md:flex">
        <div className="mx-10">
          <DateRange
            onChange={(item) => setState([item.selection])}
            ranges={state}
            minDate={calculateMinDate()}
            rangeColors={["#EC7A20"]}
            months={2}
            direction={windowWidth < 780 ? "vertical" : "horizontal"}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            disabledDates={bookingDate}
          />
          <div className=" pb-5 mt-3 ">
            <button
              className="text-lg hover:bg-blue-800 active:bg-blue-600 p-2 rounded-lg  text-white
               bg-blue-950 "
              onClick={clearDates}
            >
              Clear Date
            </button>
          </div>
        </div>
        <Billing
          handleBookedDates={handleBookedDates}
          handleAutoChange={handleAutoChange}
          totalPrice={totalPrice}
          diffInDays={diffInDays}
          isLoggedIn={isLoggedIn}
          maxauto={maxauto}
          minauto={minauto}
          minDays={minDays}
          autoInputError={autoInputError}
          price={price}
          rickshaws={rickshaws}
          state={state}
          noOfAuto={noOfAuto}
        />
      </div>
    </>
  );
};

export default DatePicker;
