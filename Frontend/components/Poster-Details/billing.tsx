import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../../store/cart-slice';
import { RootState } from '../../store';
import toastFunction from '../reactToast/toast';
import { useRouter } from 'next/router';

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
  createdBy: string;
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
  createdBy,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    userId,
    userName,
    isLoggedIn,
  }: { userId: string | null; userName: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  const [bookingDates, setBookingDates] = useState<string[]>([]);
  const handleAddToCartSuccess = () => {
    toastFunction('success', 'Added to Cart !');
  };
  const handleBookingQuantityError = (errorMessage: string) => {
    toastFunction('warning', errorMessage);
  };

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
    console.log(createdBy);

    dispatch(
      cartActions.addItemToCart({
        posterId,
        image,
        userId,
        title,
        address,
        totalPrice,
        bookingDates: datesArray,
        createdBy,
      }),
    );

    router.push('/cart');
  };

  function handleCart() {
    if (mediatype === 'Rickshaws' || mediatype === 'Poles') {
      const qty = Number(noOfAuto.current.value);
      if (qty < minQty || qty > maxQty) {
        handleBookingQuantityError(
          qty < minQty
            ? `Booking Quantity should be greater or equal to ${minQty}`
            : `Booking Quantity should be less than ${maxQty}`,
        );
        return;
      }
    }

    handleAddToCartSuccess();
    setTimeout(addToCartHandler, 900);
  }

  return (
    <>
      <div className=" p-5 border-[2px]   border-gray-200 shadow-md shadow-gray-300 rounded-2xl">
        <p className="pb-3 font-poppins">
          <span className="text-xl font-bold">₹{price}/</span>
          <span className="px-1 text-xl">
            {mediatype === 'Rickshaws'
              ? 'auto'
              : mediatype === 'Poles'
              ? 'pole'
              : 'day'}
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
              {isLoggedIn ? (
                <button
                  onClick={handleCart}
                  className="tracking-widest mt-2 text-white w-full md:w-[394px] text-2xl p-2 bg-blue-500  hover:bg-green-400 hover:scale-105 transition-all delay-70 active:bg-green-600 active:scale-100  rounded-lg"
                >
                  Add To Cart
                </button>
              ) : (
                <Link href="/login">
                  <button
                    // onClick={}
                    className="tracking-widest mt-2 text-white w-full md:w-[394px] text-2xl p-2 bg-blue-500  hover:bg-green-400 hover:scale-105 transition-all delay-70 active:bg-green-600 active:scale-100  rounded-lg"
                  >
                    Add To Cart
                  </button>
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="p-2 mb-2 md:w-[394px] text-xl text-white font-inter bg-orange-500  mt-3">
                Select Minimum {minDays} days
              </p>
            </>
          )}
        </div>
        <div className=" border-b-[2px] border-b-gray-300">
          <div className=" flex mt-5 p-2 text-lg rounded-lg  font-inter ">
            <div className="w-full">
              <p>
                {noOfAuto.current === undefined
                  ? `₹${price} X ${diffInDays}days`
                  : ` ₹${price} x ${
                      noOfAuto?.current?.value ? noOfAuto?.current?.value : 1
                    } ${
                      mediatype === 'Rickshaws'
                        ? 'auto'
                        : mediatype === 'Poles'
                        ? 'pole'
                        : 'day'
                    } x ${diffInDays}days `}
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
