import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toastFunction from "../reactToast/toast";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { cartActions } from "@/store/cart-slice";
import { FaRegEdit } from "react-icons/fa";
import ImageGenerator from "./ImageGenerater";

interface BillingType {
  id: string;
  price: number;
  image: string;
  title: string;
  address: string;
  maxQty: number;
  minQty: number;
  minDays: number;
  createdBy: string;
  diffInDays: number;
  mediatype: string | boolean;
  isLoggedIn: boolean;
  state: { startDate: Date; endDate: Date; key: string }[];
}

const Billing: React.FC<BillingType> = ({
  id,
  diffInDays,
  maxQty,
  minQty,
  minDays,
  price,
  mediatype,
  state,
  image,
  title,
  address,
  createdBy,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [autoInputError, setAutoInputError] = useState<string>();
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [editImg, setEditImg] = useState<boolean>(false);
  const [customerPosterImage, setCustomerPosterImage] = useState<string>();

  const { userId, isLoggedIn }: { userId: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  const handleBookingQuantityError = (errorMessage: string) => {
    toastFunction("warning", errorMessage);
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
    const posterId = id;

    dispatch(
      cartActions.addItemToCart({
        posterId,
        image,
        userId,
        title,
        address,
        totalPrice: finalTotalPrice,
        bookingDates: datesArray,
        createdBy,
        customerPosterImage,
      })
    );

    router.push("/outdoorAd/cart");
  };

  function handleCart() {
    if (customerPosterImage && customerPosterImage.trim() !== "") {
      if (
        mediatype === "Rickshaws" ||
        mediatype === "Poles" ||
        mediatype === "Buses"
      ) {
        if (bookingQuantity < minQty || bookingQuantity > maxQty) {
          handleBookingQuantityError(
            bookingQuantity < minQty
              ? `Booking Quantity should be greater or equal to ${minQty}`
              : `Booking Quantity should be less than ${maxQty}`
          );
          return;
        }
      }

      toastFunction("success", "Added to Cart !");
      setTimeout(addToCartHandler, 900);
    } else {
      toastFunction("warning", "Please upload your Ad image.");
    }
  }

  const handlEditImage = () => {
    setEditImg((prev) => !prev);
    setCustomerPosterImage("");
  };

  const handleAutoChange = (e: any) => {
    const inputValue = parseInt(e.target.value, 10);
    setBookingQuantity(inputValue);
    if (inputValue < minQty || inputValue > maxQty) {
      setAutoInputError(
        `Book minimum ${minQty} and maximum ${maxQty} Quantity.`
      );
    } else {
      setAutoInputError("");
    }
  };

  const totalPrice = mediatype
    ? bookingQuantity > 0
      ? bookingQuantity * price * diffInDays
      : 1 * price * diffInDays
    : price * diffInDays;

  const extraCharges = Math.round(totalPrice * 0.05);
  const finalTotalPrice = Math.round(totalPrice * 1.05);

  return (
    <>
      <div className=" p-5 border-[2px]   border-gray-200 shadow-md shadow-gray-300 rounded-2xl">
        <p className="pb-3 font-poppins">
          <span className="text-xl font-bold">₹{price}/</span>
          <span className="px-1 text-xl">
            {mediatype === "Rickshaws"
              ? "auto"
              : mediatype === "Poles"
              ? "pole"
              : mediatype === "Buses"
              ? "bus"
              : "day"}
          </span>
        </p>

        <div className=" flex gap-2 border-2 font-inter">
          <p className="text-base p-3">
            Start:{" "}
            <strong>{state[0].startDate.toLocaleDateString("en-IN")}</strong>
          </p>
          <p className="text-base p-3 ">
            End: <strong>{state[0].endDate.toLocaleDateString("en-IN")}</strong>
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
              onChange={handleAutoChange}
              value={bookingQuantity}
              min={1}
              required
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
                <Link href="/outdoorAd/login">
                  <button className="tracking-widest mt-2 text-white w-full md:w-[394px] text-2xl p-2 bg-blue-500  hover:bg-green-400 hover:scale-105 transition-all delay-70 active:bg-green-600 active:scale-100  rounded-lg">
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
                {!mediatype
                  ? `₹${price} X ${diffInDays}days`
                  : ` ₹${price} x ${bookingQuantity ? bookingQuantity : 1} ${
                      mediatype === "Rickshaws"
                        ? "auto"
                        : mediatype === "Poles"
                        ? "pole"
                        : mediatype === "Buses"
                        ? "bus"
                        : "day"
                    } x ${diffInDays}days `}
              </p>
            </div>
            <div className="font-inter w-1/2 flex justify-end">
              <p> ₹{totalPrice}</p>
            </div>
          </div>
          <div className="font-inter flex p-2 text-lg pb-5">
            <div className="w-1/2 flex">
              <p>Extra Charges : </p>
              <p className="md:ml-4">5%</p>
            </div>

            <div className="w-1/2 flex justify-end">
              <p>₹{extraCharges}</p>
            </div>
          </div>
        </div>
        <div className=" flex p-2 text-xl font-semibold tracking-wider font-inter  ">
          <div className="w-1/2">
            <p className="">Total Price:</p>
          </div>
          <div className=" w-1/2 flex justify-end">
            <p> ₹{finalTotalPrice}</p>
          </div>
        </div>
        <div>
          {customerPosterImage && editImg && (
            <>
              <div className=" text-xl md:mt-10 font-poppins font-semibold text-green-500 ">
                Image Uploaded Successfully
              </div>
              <div className="flex">
                <p className="pt-[4px] items-center text-red-500 font-poppins font-medium text-lg">
                  Edit Image
                </p>
                <button
                  onClick={handlEditImage}
                  className="ml-3 hover:text-green-600"
                >
                  <FaRegEdit size={28} />
                </button>
              </div>
            </>
          )}
          {!customerPosterImage && !editImg && (
            <>
              <div className="mt-6 md:mb-3 font-poppins text-lg ">
                Upload your Advertise image
              </div>
              <ImageGenerator
                setImage={setCustomerPosterImage}
                setEditImg={setEditImg}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Billing;
