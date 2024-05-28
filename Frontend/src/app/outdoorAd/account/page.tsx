"use client";
import React from "react";
import Link from "next/link";
import { RootState } from "@/store";
import fetchUser from "@/utils/http";
import NavBar from "@/components/Header";
import Footer from "@/components/Footer";
import { FaRegEdit } from "react-icons/fa";
import { logout } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import PopUpModal from "@/components/account/popupModal";
import ImageUploader from "@/components/account/imageUploader";

interface UserDetails {
  image: string;
  name: string;
  email: string;
}
export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [editImg, setEditImg] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const {
    userId,
    userRole,
  }: { userId: string | null; userRole: string | null } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const user = async () => {
      try {
        if (userId) {
          const newUser = await fetchUser(userId);
          if (!newUser) throw new Error("User Not login.");
          setUserDetails(newUser);
        }
      } catch (error) {
        console.log(error);
      }
    };
    user();
  }, [userId]);

  if (!userDetails || !userId) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center text-3xl font-poppins h-screen mt-32">
          <div className="rounded-full h-10 w-10 bg-gray-700 animate-ping"></div>
        </div>
      </>
    );
  }
  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logout());
    setTimeout(() => {
      router.push("/outdoorAd");
    }, 500);
  };
  const handlEditImage = () => {
    setEditImg((prev) => !prev);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center items-center mb-24  ">
        <div
          className="bg-cover bg-center w-full h-80 md:h-70  "
          style={{ backgroundImage: 'url("/nnn.jpg")' }}
        ></div>
        <div className="bg-white w-11/12 md:w-2/3 max-w-2xl -mt-20 md:-mt-32 rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row  items-center md:items-start space-y-4 md:space-y-0 ">
            <div>
              {image ? (
                <img
                  src={image}
                  alt="User"
                  className="w-30 h-24 md:w-55 md:h-40 rounded-full border-4 border-white shadow-lg"
                />
              ) : userDetails.image ? (
                <img
                  src={userDetails.image}
                  alt="User"
                  className="w-30 h-24 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <img
                  src="/profile.png"
                  alt="User"
                  className="w-30 h-24 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg"
                />
              )}

              {editImg && (
                <ImageUploader
                  userId={userId}
                  setImage={setImage}
                  setEditImg={setEditImg}
                />
              )}
            </div>
            <button
              onClick={handlEditImage}
              className="-ml-5 hover:text-green-600"
            >
              <FaRegEdit size={28} />
            </button>
            <div className="text-center md:text-left md:ml-8  ">
              <h1 className="text-2xl md:text-4xl font-inter font-semibold md:pt-3 md:pb-5">
                {userDetails.name}
              </h1>
              <p className="text-gray-700 text-lg">{userDetails.email}</p>
              <p className="text-gray-700 text-lg">Role : {userRole}</p>
            </div>
          </div>
        </div>
        <div className="flex-col">
          <div className="md:flex gap-8 md:mt-8">
            <Link href="/outdoorAd/account/orders" className="w-[285px]">
              <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3 w-full  hover:bg-slate-200 active:bg-white">
                <img src="/order.png" alt="order" />
                <div>
                  <p className="ml-3 mt-3 text-lg"> Your Orders</p>
                  <p className="ml-3 text-sm"> track, return or buy things </p>
                </div>
              </div>
            </Link>
            <Link href="/outdoorAd/updatePassword" className="w-[285px]">
              <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3 w-full  hover:bg-slate-200 active:bg-white">
                <img
                  src="/updatePassword.png"
                  alt="order"
                  className="h-14 w-14 mt-1 mb-1"
                />
                <div>
                  <p className="ml-3 mt-3 text-lg"> Update Password</p>
                  <p className="ml-3 text-sm">update your password</p>
                </div>
              </div>
            </Link>
            <button onClick={handleLogout} className="w-[285px]">
              <div className="flex border-[2px] border-slate-200 mt-3  shadow-md rounded-md p-3 w-full  hover:bg-slate-200 active:bg-white">
                <img
                  src="/logout.png"
                  alt="order"
                  className="h-14 w-14 mt-1 mb-1"
                />
                <div>
                  <p className="ml-3 mt-3 text-lg text-left"> Log Out</p>
                  <p className="ml-3 text-sm"> simply logout your account </p>
                </div>
              </div>
            </button>
          </div>
          <div className="md:flex gap-8 md:mt-5">
            {userRole === "user" && <PopUpModal />}
            {userRole && userRole !== "user" && (
              <Link href="/outdoorAd/createPoster" className="w-[285px]">
                <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3   hover:bg-slate-200 active:bg-white">
                  <img
                    src="/billboard.png"
                    alt="order"
                    className="h-14 w-14 mt-1 mb-1"
                  />
                  <div>
                    <p className="ml-3 mt-3 text-lg"> Create Poster</p>
                    <p className="ml-3 text-sm">make your own poster</p>
                  </div>
                </div>
              </Link>
            )}
            {userRole === "admin" && (
              <Link href="/outdoorAd/admin" className="w-[285px]">
                <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3 hover:bg-slate-200 active:bg-white">
                  <img
                    src="/dashboard.png"
                    alt="order"
                    className="h-14 w-12 mt-1 mb-1"
                  />
                  <div>
                    <p className="ml-3 mt-3 text-lg"> Dashboard</p>
                    <p className="ml-3 text-sm"> analysis, users controls</p>
                  </div>
                </div>
              </Link>
            )}
            {userRole === "member" && (
              <Link href="/outdoorAd/dashboard" className="w-[285px]">
                <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3 hover:bg-slate-200 active:bg-white">
                  <img
                    src="/dashboard.png"
                    alt="order"
                    className="h-14 w-12 mt-1 mb-1"
                  />
                  <div>
                    <p className="ml-3 mt-3 text-lg"> Dashboard</p>
                    <p className="ml-3 text-sm"> analysis, users controls</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
