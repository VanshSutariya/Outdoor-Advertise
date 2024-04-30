import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../../store/cart-slice';
import { RootState } from '../../store';

interface BillingType {
  handleAutoChange: () => void;
  id: string;
  price: number;
  image: string;
  title: string;
  address: string;
  maxQty: number;
  minQty: number;
  minDays: number;
  totalPrice: number;
  diffInDays: number;
  autoInputError: string;
  mediatype: string | boolean;
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
  maxQty,
  minQty,
  minDays,
  autoInputError,
  price,
  mediatype,
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
        bookingDates: datesArray,
      }),
    );
  };
  return (
    <>
      <div className=" p-5 border-[2px]  border-gray-200 shadow-md shadow-gray-300 rounded-2xl">
        <p className="pb-3 font-poppins">
          {' '}
          <span className="text-xl font-bold">₹{price}/</span>
          <span className="px-1 text-xl">
            {mediatype === 'Rickshaws' ? 'auto' : 'day'}
          </span>
        </p>

        <div className=" flex gap-2 border-2">
          <p className="text-base font-inter p-3 text-red-950">
            Start:{' '}
            <strong>{state[0].startDate.toLocaleDateString('en-IN')}</strong>
          </p>
          <p className="text-base font-inter p-3 text-red-950">
            End: <strong>{state[0].endDate.toLocaleDateString('en-IN')}</strong>
          </p>
        </div>
        {mediatype && (
          <div className="flex border-2 justify-around py-2 px-1 mt-4 rounded-lg ">
            <label className="mr-2 font-inter">
              <strong>Booking Quantity</strong>
            </label>
            <input
              type="number"
              className="bg-transparent border-2"
              ref={noOfAuto}
              onChange={handleAutoChange}
              min={1}
            />
          </div>
        )}
        {autoInputError && (
          <p className="text-blue-500 text-lg">{autoInputError}</p>
        )}
        <div className="text-center">
          {diffInDays >= minDays ? (
            <>
              {mediatype ? (
                Number(noOfAuto.current.value) >= minQty &&
                Number(noOfAuto.current.value) <= maxQty ? (
                  isLoggedIn ? (
                    <Link href="/cart">
                      <button
                        onClick={addToCartHandler}
                        className="tracking-widest mt-2 text-white w-full md:w-[394px] text-2xl p-2 bg-green-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                      >
                        Reserve
                      </button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <button
                        // onClick={}
                        className="tracking-widest mt-2 text-white w-full md:w-[394px] text-2xl p-2 bg-green-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                      >
                        Reserve
                      </button>
                    </Link>
                  )
                ) : (
                  <p className="tracking-widest mt-2 text-white w-full md:w-[394px] text-2xl p-2 bg-red-500 rounded-lg ">
                    Add Proper Booking Quantity
                  </p>
                )
              ) : isLoggedIn ? (
                <Link href="/cart">
                  <button
                    onClick={addToCartHandler}
                    className="font-inter tracking-tighter mt-2 text-white w-full text-2xl p-2 bg-blue-500 rounded-lg hover:bg-green-600 active:bg-green-600 focus:bg-indigo-950"
                  >
                    Add To Cart
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    // onClick={}
                    className="tracking-widest mt-2 text-white w-full text-2xl p-2 bg-green-500 rounded-lg hover:bg-purple-700 active:bg-purple-900 focus:bg-indigo-950"
                  >
                    Reserve
                  </button>
                </Link>
              )}

              {mediatype && noOfAuto && diffInDays && (
                <div className=" bg-transparent  border-2 border-black mt-3 rounded-lg  ">
                  <p className="text-lg font-inter">
                    Total No. of {mediatype} : {noOfAuto.current.value}{' '}
                  </p>
                  <p className="text-lg font-inter ">
                    Total Booking Days : {diffInDays}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="p-2 mb-2 text-xl text-white font-inter bg-orange-500 rounded-md mt-3">
                Select Minimum {minDays} days
              </p>
            </>
          )}
        </div>
        <div className=" border-b-[2px] border-b-gray-300">
          <div className=" flex mt-5 p-2 text-lg rounded-lg  font-inter ">
            <div className="w-1/2">
              <p>
                ₹{price} X {diffInDays}days
              </p>
            </div>
            <div className="font-inter w-1/2 flex justify-end">
              <p> ₹{totalPrice}</p>
            </div>
          </div>
          <div className="font-inter flex p-2 text-lg pb-5">
            <div className="w-1/2">
              <p>Extra Charges</p>
            </div>
            <div className=" w-1/2 flex justify-end">
              <p> ₹0</p>
            </div>
          </div>
        </div>
        <div className=" flex p-2 text-xl font-semibold tracking-wider font-inter  ">
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
