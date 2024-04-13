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
  bookingDate,
}) => {
  const windowWidth = useFindWidth();
  const [bookingDates, setBookingDates] = useState<string[]>([]);
  const [diffInDays, setDiffInDays] = useState<number>(0);
  const noOfAuto = useRef<HTMLInputElement>();
  const [autoInputError, setAutoInputError] = useState<string | null>(null);

  const { user, isLoggedIn }: { user: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), minDays),
      key: "selection",
    },
  ]);

  const clearDates = () => {
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  useEffect(() => {
    const diff = differenceInDays(state[0].endDate, state[0].startDate) + 1;
    setDiffInDays(diff);

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
  }, [state, diffInDays]);

  const handleBookedDates = () => {
    console.log(bookingDates);
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

  console.log(
    state[0].startDate.toLocaleDateString(),
    state[0].endDate.toLocaleDateString()
  );

  return (
    <>
      <div className=" md:flex">
        <div className="mx-10">
          <DateRange
            onChange={(item) => setState([item.selection])}
            ranges={state}
            minDate={new Date()}
            rangeColors={["#EC7A20"]}
            months={2}
            direction={windowWidth < 780 ? "vertical" : "horizontal"}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            disabledDates={bookingDate}
            // disabledDates={bookedDates}
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
