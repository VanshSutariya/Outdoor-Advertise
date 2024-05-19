import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toastFunction from "../reactToast/toast";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { cartActions } from "@/store/cart-slice";
import { FaRegEdit } from "react-icons/fa";

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
  autoInputError: string | undefined;
  mediatype: string | boolean;
  isLoggedIn: boolean;
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
  createdBy,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [editImg, setEditImg] = useState<boolean>(false);
  const [customerPosterImage, setCustomerPosterImage] = useState<string>();

  const {
    userId,

    isLoggedIn,
  }: { userId: string | null; isLoggedIn: boolean } = useSelector(
    (state: RootState) => state.auth
  );

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
    console.log(createdBy);

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
        const qty = Number(noOfAuto.current?.value);
        if (qty < minQty || qty > maxQty) {
          handleBookingQuantityError(
            qty < minQty
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
        setEditImg(false);
      } else {
        toastFunction("warning", "Image upload failed!. Try again");
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error: any) {
      toastFunction("error", error);
    }
  };

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
                {noOfAuto.current === undefined
                  ? `₹${price} X ${diffInDays}days`
                  : ` ₹${price} x ${
                      noOfAuto?.current?.value ? noOfAuto?.current?.value : 1
                    } ${
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
          {(!customerPosterImage || editImg) && (
            <>
              <div className="mt-6 md:mb-3 font-poppins text-lg ">
                Upload your Advertise image
              </div>
              <input
                type="file"
                id="file-upload"
                onChange={GenerateImage}
                className="w-full hidden  "
              />
              <label
                htmlFor="file-upload"
                className="bg-orange-400 cursor-pointer text-center hover:bg-orange-600  transition-all duration-500 font-bold text-lg text-white p-2 mt-4 rounded-lg "
              >
                Choose file
              </label>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Billing;
