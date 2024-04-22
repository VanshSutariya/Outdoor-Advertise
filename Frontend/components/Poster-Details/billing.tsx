import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { RootState } from "../../store";

interface BillingType {
  handleAutoChange: () => void;
  id: string;
  price: number;
  image: string;
  title: string;
  address: string;
  maxauto: number;
  minauto: number;
  minDays: number;
  totalPrice: number;
  diffInDays: number;
  autoInputError: string;
  rickshaws: boolean;
  isLoggedIn: boolean;
  bookingDate: string[];
  noOfAuto: React.RefObject<HTMLInputElement>;
  state: { startDate: Date; endDate: Date; key: string }[];
}

const Billing: React.FC<BillingType> = ({
  handleAutoChange,
  id,
  totalPrice,
  diffInDays,
  maxauto,
  minauto,
  minDays,
  autoInputError,
  price,
  rickshaws,
  state,
  image,
  title,
  address,
  noOfAuto,
  bookingDate,
}) => {
  const dispatch = useDispatch();

  const {
    userId,
    userName,
    isLoggedIn,
  }: { userId: string | null; userName: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  const [bookingDates, setBookingDates] = useState<string[]>([]);

  const addToCartHandler = () => {
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

    const updatedBookingDates = [...bookingDate, ...datesArray];
    setBookingDates(updatedBookingDates);

    const posterId = id;
    dispatch(
      cartActions.addItemToCart({
        posterId,
        image,
        userId,
        title,
        address,
        totalPrice,
        bookingDates: updatedBookingDates,
      })
    );
  };
  return (
    <>
      <div className=" p-5 border-[2px]  border-gray-200 shadow-md shadow-gray-300 rounded-2xl">
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
          {diffInDays >= minDays ? (
            <>
              {rickshaws ? (
                Number(noOfAuto.current.value) >= minauto &&
                Number(noOfAuto.current.value) <= maxauto ? (
                  isLoggedIn ? (
                    <Link href="#">
                      <button
                        // onClick={}
                        className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-pink-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                      >
                        Reserve
                      </button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <button
                        // onClick={}
                        className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-pink-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                      >
                        Reserve
                      </button>
                    </Link>
                  )
                ) : (
                  <p className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-blue-500 rounded-lg ">
                    Add Proper Booking Quantity
                  </p>
                )
              ) : isLoggedIn ? (
                <Link href="#">
                  <button
                    onClick={addToCartHandler}
                    className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-pink-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                  >
                    Add to Cart
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    // onClick={}
                    className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-pink-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                  >
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
            <>
              <p className="p-2 mb-2 text-xl font-mono bg-orange-500 rounded-md mt-3">
                Select Minimum {minDays} days
              </p>
            </>
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
