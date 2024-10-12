import Link from "next/link";
import { RootState } from "@/store";
import { updateCart } from "@/utils/http";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toastFunction from "../reactToast/toast";
import { cartActions } from "@/store/cart-slice";
import { useDispatch, useSelector } from "react-redux";

interface BillingType {
  id: string;
  price: number;
  maxQty: number;
  minQty: number;
  minDays: number;
  diffInDays: number;
  mediatype: string | boolean;
  isLoggedIn: boolean;
  state: { startDate: Date; endDate: Date; key: string }[];
}

const BillingPoster: React.FC<BillingType> = ({
  id,
  diffInDays,
  maxQty,
  minQty,
  minDays,
  price,
  mediatype,
  state,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [autoInputError, setAutoInputError] = useState<string>();
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [editImg, setEditImg] = useState<boolean>(false);
  const [customerPosterImage, setCustomerPosterImage] = useState<string>();

  const { userId, isLoggedIn }: { userId: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  const { items } = useSelector((state: RootState) => state.cart);
  const existingItem = items.find((item) => item.posterId === id);
  let matchingItems: any;
  if (existingItem) {
    matchingItems = items.filter((item) => item.posterId === id);
  }

  useEffect(() => {
    if (existingItem) {
      setCustomerPosterImage(matchingItems[0].customerPosterImage);
    }
  }, [existingItem]);

  const handleBookingQuantityError = (errorMessage: string) => {
    toastFunction("warning", errorMessage);
  };

  const addToCartHandler = async () => {
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
    try {
      const bodyData = {
        bookingDate: datesArray,
        customerPosterImage: customerPosterImage,
        totalPrice: Math.round(totalPrice * 1.05),
      };
      await updateCart(userId, posterId, bodyData);
      dispatch(
        cartActions.updateCartData({
          id,
          bookingDates: datesArray,
          customerPosterImage,
          finalTotalPrice,
        })
      );

      router.push("/outdoorAd/cart");
    } catch (error: any) {
      toastFunction("error", error.message);
    }
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

  const GenerateImage: any = async (e: { target: { files: any[] } }) => {
    toastFunction("info", "Image uploading...");
    const file: File | null = e.target.files?.[0];
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await fetch(`http://localhost:4000/cart/upload`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toastFunction("success", "Image Uploaded Successfully.");
        setCustomerPosterImage(data.secure_url);
        setEditImg(true);
      } else {
        toastFunction("warning", "Image upload failed!. Try again");
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error: any) {
      toastFunction("error", error);
    }
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
          {customerPosterImage && !editImg && (
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
              <input
                type="file"
                id="file-upload"
                onChange={GenerateImage}
                className="w-full hidden"
              />
              <label
                htmlFor="file-upload"
                className="bg-orange-400 cursor-pointer text-center hover:bg-orange-600  transition-all duration-500 font-bold text-lg text-white p-2 mt-4 rounded-lg "
              >
                {editImg ? "Uploading......." : "Choose file"}
              </label>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BillingPoster;
