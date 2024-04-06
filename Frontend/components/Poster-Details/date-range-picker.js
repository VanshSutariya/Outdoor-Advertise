import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import useFindWidth from "@/hooks/useWidth";
function DatePicker() {
  const windowWidth = useFindWidth();
  const [diffInDays, setDiffInDays] = useState(0);
  const [billdates, setbillDates] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 5),
  });
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 5),
      key: "selection",
    },
  ]);

  let sD = state[0].startDate;

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
    const bookedDates = [
      addDays(new Date()),
      addDays(new Date(), 1),
      addDays(new Date(), 2),
      addDays(new Date(), 3),
      addDays(new Date(), 4),
    ];
    const dates = { startDate: state.startDate, endDate: state.endDate };
    setbillDates(dates);
  }, [state, diffInDays]);

  return (
    <>
      <div className=" md:flex">
        <div className="mx-10">
          <DateRange
            onChange={(item) => setState([item.selection])}
            ranges={state}
            minDate={addDays(new Date(), 2)}
            rangeColors={["#EC7A20"]}
            months={2}
            direction={windowWidth < 780 ? "vertical" : "horizontal"}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            // disabledDates={["2024/03/30", "2024/04/3"]}
            // disabledDates={bookedDates}
          />
          <div>
            <button
              className="text-lg underline  font-bold"
              onClick={clearDates}
            >
              Clear Date
            </button>
          </div>
        </div>

        <div className=" p-5 ">
          <p className="p-2  text-xl font-mono"> ₹200000 / per day</p>

          <div className=" flex gap-2">
            <p className="text-lg font-mono border-2 border-black	 rounded-md p-3 text-red-950">
              StartDate: {state[0].startDate.toLocaleDateString("en-IN")}
            </p>
            <p className="text-lg font-mono border-2 border-black rounded-md p-3 text-red-950">
              EndDate: {state[0].endDate.toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="text-center">
            <p className="border-2 border-black mt-5 p-2 text-xl rounded-lg  font-mono ">
              TotalPrice : ₹{200000 * diffInDays}
            </p>
            {diffInDays > 4 ? (
              <button className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-blue-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950">
                Book Now
              </button>
            ) : (
              <p className="p-2 mb-2 text-xl font-mono bg-red-200 rounded-md mt-2">
                {" "}
                Select Minimum 5 days{" "}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DatePicker;
