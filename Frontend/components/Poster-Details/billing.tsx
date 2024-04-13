import { log } from "console";
import Link from "next/link";

interface BillingType {
  handleAutoChange: () => void;
  totalPrice: number;
  diffInDays: number;
  maxauto: number;
  minauto: number;
  minDays: number;
  autoInputError: string;
  price: number;
  rickshaws: boolean;
  state: { startDate: Date; endDate: Date; key: string }[];
  noOfAuto: React.RefObject<HTMLInputElement>;
  isLoggedIn: boolean;
}

const Billing: React.FC<BillingType> = ({
  handleAutoChange,
  totalPrice,
  diffInDays,
  maxauto,
  minauto,
  minDays,
  autoInputError,
  price,
  rickshaws,
  state,
  noOfAuto,
  isLoggedIn,
}) => {
  return (
    <>
      <div className=" p-5 border-[1px]  border-gray-200 shadow-md shadow-gray-500 rounded-2xl">
        <p className="pb-3">
          {" "}
          <span className="text-xl font-bold">₹{price} /</span>
          <span className="px-1 text-xl">
            {rickshaws ? "per Auto" : "per day"}
          </span>
        </p>

        <div className=" flex gap-2">
          <p className="text-lg font-mono border-2 border-black	 rounded-md p-3 text-red-950">
            StartDate: {state[0].startDate.toLocaleDateString("en-IN")}
          </p>
          <p className="text-lg font-mono border-2 border-black rounded-md p-3 text-red-950">
            EndDate: {state[0].endDate.toLocaleDateString("en-IN")}
          </p>
        </div>
        {rickshaws && (
          <div className="flex border-2 border-black justify-around p-1 mt-4 rounded-lg ">
            <label>Booking Quantity </label>
            <input
              type="number"
              className="bg-transparent border-2 border-black"
              ref={noOfAuto}
              onChange={handleAutoChange}
            />
          </div>
        )}
        {autoInputError && (
          <p className="text-red-500 text-lg">{autoInputError}</p>
        )}
        <div className="text-center">
          {diffInDays > minDays ? (
            <>
              {rickshaws &&
                Number(noOfAuto.current.value) >= minauto &&
                Number(noOfAuto.current.value) <= maxauto && (
                  <button className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-blue-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950">
                    Reserve
                  </button>
                )}
              {!rickshaws && isLoggedIn ? (
                <Link href="/">
                  <button className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-blue-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950">
                    Reserve
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-pink-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950">
                    Reserve
                  </button>
                </Link>
              )}
              {rickshaws && noOfAuto && diffInDays && (
                <div className=" bg-transparent  border-2 border-black mt-3 rounded-lg  ">
                  <p className="text-lg font-mono">
                    Total No. of rickshaws : {noOfAuto.current.value}{" "}
                  </p>
                  <p className="text-lg font-mono ">
                    Total Booking Days : {diffInDays}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="p-2 mb-2 text-xl font-mono bg-orange-500 rounded-md mt-3">
              Select Minimum {minDays} days
            </p>
          )}
        </div>
        <div className=" border-b-[2px] border-b-gray-300">
          <div className=" flex mt-5 p-2 text-lg rounded-lg  font-mono ">
            <div className="w-1/2">
              <p className="underline">
                ₹{price} X {diffInDays}days
              </p>
            </div>
            <div className=" w-1/2 flex justify-end">
              <p> ₹{totalPrice}</p>
            </div>
          </div>
          <div className=" flex p-2 text-lg font-mono pb-5">
            <div className="w-1/2">
              <p className="underline">Extra Charges</p>
            </div>
            <div className=" w-1/2 flex justify-end">
              <p> ₹0</p>
            </div>
          </div>
        </div>
        <div className=" flex p-2 text-xl font-semibold tracking-wider font-mono  ">
          <div className="w-1/2">
            <p className="">Total Price:</p>
          </div>
          <div className=" w-1/2 flex justify-end">
            <p> ₹{totalPrice}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Billing;
