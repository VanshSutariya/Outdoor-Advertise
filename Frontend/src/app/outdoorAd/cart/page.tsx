"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { RootState } from "@/store";
import { cartActions } from "@/store/cart-slice";
import NavBar from "@/components/Header";
import { UploadButton } from "@/utils/uploadthing";
import toastFunction from "@/components/reactToast/toast";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId }: { userId: string | null } = useSelector(
    (state: RootState) => state.auth
  );
  const { items, finalTotal } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(`http://localhost:4000/cart?userId=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch cart data.");
        }
        const data = await res.json();
        // Dispatch an action to update Redux state with fetched cart data
        dispatch(cartActions.setCartItems(data));
      } catch (error: any) {
        console.error("Error fetching cart data:", error.message);
      }
    };
    func();
  }, [userId]);

  function handleDelete(posterId: string) {
    dispatch(cartActions.removeItem({ userId, posterId }));
  }

  function handleEdit(posterId: string) {
    dispatch(cartActions.removeItem({ userId, posterId }));
    router.push(`/outdoorAd/poster/${posterId}`);
  }

  async function handleCheckout() {
    try {
      const response = await fetch("http://localhost:4000/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });

      if (response.ok) {
        const data = await response.text();
        router.push(data);
      } else {
        throw new Error("Error creating checkout session.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <NavBar />
      <div className=" h-screen py-8">
        <div className="container  mx-auto px-4">
          <h1 className="text-3xl font-inter font-semibold mb-4 md:ml-10">
            Shopping Cart
          </h1>
          <div className="flex flex-col justify-center md:flex-row gap-4">
            <div className="md:w-3/4 ">
              <div className="bg-slate-100 rounded-lg shadow-md p-6 mb-4">
                <table className="w-full font-poppins">
                  <thead>
                    <tr className="border-b-2 border-b-gray-300">
                      <th className="text-left font-semibold pl-8">Product</th>
                      <th className="text-left font-semibold ">
                        Booking Dates
                      </th>
                      <th className="text-left font-semibold md:w-[70px] ">
                        Delete
                      </th>
                      <th className="text-left font-semibold md:w-[70px]">
                        Edit
                      </th>
                      <th className="text-left font-semibold ">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items.map((item) => (
                        <tr
                          key={item.posterId}
                          className="border-b-2 border-b-gray-300"
                        >
                          <td className="py-4 ">
                            <div className="flex items-center">
                              <img
                                className="md:h-[120px] md:w-[150px] h-16 w-12 mr-4 md:rounded-3xl"
                                src={item.image}
                                alt="Product image"
                              />
                              <span className="flex-col font-semibold text-lg">
                                {item.title}
                                <p className="text-[15px] font-normal">
                                  {item.address}
                                </p>
                              </span>
                            </div>
                          </td>
                          <td className="tracking-tighter pb-1">
                            {item.bookingDate[0] +
                              "  -  " +
                              item.bookingDate[item.bookingDate.length - 1]}
                          </td>
                          <td className=" ">
                            <button
                              onClick={() => handleDelete(item?.posterId)}
                              className=""
                            >
                              <MdDeleteOutline
                                size={28}
                                className="hover:text-red-700"
                              />
                            </button>
                          </td>
                          <td className="items-center">
                            <button onClick={() => handleEdit(item?.posterId)}>
                              <FaRegEdit
                                size={23}
                                className="hover:text-green-500"
                              />
                            </button>
                          </td>
                          <td className="text-[21px] font-semibold">
                            ₹{item.totalPrice}
                          </td>
                        </tr>
                      ))}

                    {/* <!-- More product rows --> */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="md:w-1/4">
              <div className="bg-slate-100 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{finalTotal}</span>
                </div>

                {/* <hr className="my-2"> */}
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">₹{finalTotal}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                >
                  Checkout
                </button>
              </div>
              <Link href="/outdoorAd" className="">
                <p className="mt-3 flex justify-center text-blue-400 text-lg">
                  <IoIosArrowRoundBack size={30} />
                  back to shopping
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
