import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginIn, logout } from '../store/auth-slice';
import { decode } from 'jsonwebtoken';
import fetchUser from '../utils/http';
import { FaUserLarge } from 'react-icons/fa6';
import { useRouter } from 'next/router';

const NavBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const {
    userId,
    userName,
    isLoggedIn,
    userRole,
  }: {
    userId: string | null;
    userName: string | null;
    isLoggedIn: boolean;
    userRole: string | null;
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // document.cookie =
    //   'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/poster;';
    // document.cookie =
    //   'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/resetPassword;';
    // document.cookie =
    //   'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/account;';
    // dispatch(logout());

    const jwtCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='));

    if (jwtCookie) {
      const token = jwtCookie.split('=')[1];
      const decodedToken = decode(token) as { id: string };
      if (decodedToken) {
        const fetchUserFunc = async () => {
          const userName = await fetchUser(decodedToken.id);
          dispatch(loginIn(userName));
        };
        fetchUserFunc();
      }
    }
  }, []);

  const handleLogout = async () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    dispatch(logout());
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  function handleAccountPage() {
    router.push('/account');
  }

  return (
    <>
      <nav className="flex justify-between items-center px-4 pb-2 tracking-wide border-b-[1px]">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full md:w-[130px] h-[60px]"
            />

            <span className=" w-full px-3 mr-5 font-bold md:text-xl text-blue-950">
              OutdoorAdvertise
            </span>
          </Link>
        </div>
        <div
          className="md:hidden flex cursor-pointer max-w-sm"
          onClick={handleMobileMenuToggle}
        >
          {isLoggedIn && userId && (
            <div className="  sm:flex mr-4 md:hidden items-center font-semibold space-x-4">
              <div className='flex flex-col items-center justify-center w-full"'>
                <Link href="/">
                  <img
                    src="/shopping-cart.png"
                    alt="Logo"
                    className=" h-[35px]"
                  />
                </Link>
              </div>
            </div>
          )}
          <div className="flex-1 ml-auto">
            <span className="text-black text-4xl">&#9776;</span>
          </div>
        </div>
        <div className="container hidden mx-auto md:flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex pt-1 font-thin text-lg space-x-4">
              <Link href="/">
                <span className="text-black">Home</span>
              </Link>
              <Link href="/about">
                <span className="text-black">About</span>
              </Link>
              <Link href="/services">
                <span className="text-black">Services</span>
              </Link>
              <Link href="/contact">
                <span className="text-black">Contact</span>
              </Link>
            </div>
          </div>
          {!isLoggedIn && (
            <div className="md:flex hidden items-center font-semibold space-x-4">
              <Link href="/login">
                <button className="text-black  border-2 border-black hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-3xl">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="text-black  border-2 border-black hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-3xl">
                  Register
                </button>
              </Link>
            </div>
          )}
          {isLoggedIn && userId && (
            <div className="md:flex hidden items-center font-semibold space-x-2">
              <Link href="/cart">
                <button className="btn bg-transparent">
                  <img
                    src="/shopping-cart.png"
                    alt="Logo"
                    className=" h-[35px]"
                  />
                </button>
              </Link>
              {/* profile dropdown */}
              <div className=" dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex ">
                  <div className="flex items-center mt-2 border-2 p-2 hover:bg-gray-200 rounded-xl">
                    <div className=" items-center">
                      <p className="text-lg p-1">
                        {userName.substring(0, 1).toUpperCase() +
                          userName.substring(1)}
                      </p>
                    </div>
                    <div className="p-1">
                      <FaUserLarge size={25} />
                    </div>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box "
                >
                  <li className=" items-center">
                    <button onClick={handleAccountPage}>Account</button>
                  </li>
                  <li className=" items-center">
                    <Link href="/">
                      <button onClick={handleLogout}>Logout</button>
                    </Link>
                  </li>
                  {userRole && userRole !== 'user' && (
                    <li className=" items-center">
                      <Link href="/createPoster">Create Poster</Link>
                    </li>
                  )}
                  <li className=" items-center">
                    <Link href="/updatePassword">UpdatePassword</Link>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Mobile Navigation Dropdown */}
        </div>

        {isMobileMenuOpen && (
          <>
            <div className="md:hidden z-10 absolute rounded-sm opacity-95 shadow-sm shadow-slate-800 top-16 px-4 right-4 left-auto bg-[#ffffff]">
              <div className="px-4 py-2 space-y-2 text-base font-semibold">
                <Link href="/">
                  <span className="block my-2 text-black cursor-pointer">
                    Home
                  </span>
                </Link>
                {!isLoggedIn && (
                  <>
                    <Link href="/register">
                      <span className="block my-2 text-black cursor-pointer">
                        Register
                      </span>
                    </Link>
                    <Link href="/login">
                      <button className="block my-2 text-black cursor-pointer">
                        Login
                      </button>
                    </Link>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <Link href="/">
                      <button
                        onClick={handleLogout}
                        className="block my-2 text-black cursor-pointer"
                      >
                        LogOut
                      </button>
                    </Link>
                    <Link href="/account">
                      <button className="block my-2 text-black cursor-pointer">
                        Account
                      </button>
                    </Link>
                    <Link href="/updatePassword">
                      <button className="block my-2 text-black cursor-pointer">
                        Update Password
                      </button>
                    </Link>
                    {userRole && userRole !== 'user' && (
                      <Link href="/createPoster">
                        <button className="block my-2 text-black cursor-pointer">
                          Create Poster
                        </button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default NavBar;
