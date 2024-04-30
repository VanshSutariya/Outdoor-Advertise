import Link from 'next/link';
import { useRouter } from 'next/router';
import { RootState } from '../../store';
import fetchUser from '../../utils/http';
import { FaRegEdit } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import NavBar from '../../components/Header';
import { logout } from '../../store/auth-slice';
import { useDispatch, useSelector } from 'react-redux';
import { UploadButton } from '../../utils/uploadthing';
import React from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PopUpModal from '../../components/account/popupModal';

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [editImg, setEditImg] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState(null);
  const {
    userId,
    userRole,
  }: { userId: string | null; userRole: string | null } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const user = async () => {
      try {
        if (userId) {
          const newUser = await fetchUser(userId);
          if (!newUser) throw new Error('User Not login.');
          setUserDetails(newUser);
        }
      } catch (error) {
        console.log(error);
      }
    };
    user();
  }, [userId]);

  useEffect(() => {
    if (imgUrl) {
      const imgUpload = async () => {
        console.log('imageurl', imgUrl);

        const image = imgUrl;
        const rsdata = await fetch(`http://localhost:4000/auth/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        });
        const data = await rsdata.json();
        if (!rsdata.ok) {
          console.log(data.message, data, rsdata);
        }
        console.log(data);

        setImage(data.image);
      };
      imgUpload();
    }
  }, [imgUrl]);
  if (!userDetails || !userId) {
    return (
      <>
        <NavBar />
        <div className=" mt-24 text-lg font-bold flex justify-center">
          Loading....
        </div>
      </>
    );
  }
  const handleLogout = async () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    dispatch(logout());
    router.push('/');
  };
  const handlEditImage = () => {
    setEditImg((prev) => !prev);
  };
  const notify = () =>
    toast.success('New image Uploaded.', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
    });
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
                <UploadButton
                  className="mt-4 ut-button:bg-red-500 ut-readying:bg-red-100"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    setImgUrl(res[0].url);
                    notify();
                    setEditImg(false);
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
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
            <Link href="/account/orders" className="w-[285px]">
              <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3 w-full  hover:bg-slate-200 active:bg-white">
                <img src="/order.png" alt="order" />
                <div>
                  <p className="ml-3 mt-3 text-lg"> Your Orders</p>
                  <p className="ml-3 text-sm"> track, return or buy things </p>
                </div>
              </div>
            </Link>
            <Link href="/updatePassword" className="w-[285px]">
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
            {userRole === 'user' && <PopUpModal />}
            {userRole && userRole !== 'user' && (
              <Link href="/createPoster" className="w-[285px]">
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
            {userRole === 'admin' && (
              <Link href="/admin" className="w-[285px]">
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
