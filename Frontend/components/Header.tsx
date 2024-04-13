import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { loginIn, logout } from "../store/auth-slice";
import { decode } from "jsonwebtoken";
import fetchUser from "../utils/http";
const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { user, isLoggedIn }: { user: string | null; isLoggedIn: boolean } =
    useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const jwtCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="));

    if (jwtCookie) {
      const token = jwtCookie.split("=")[1];
      const decodedToken = decode(token) as { id: string };
      if (decodedToken) {
        const fetchUserFunc = async () => {
          const userName = await fetchUser(decodedToken.id);
          dispatch(loginIn(userName));
        };
        fetchUserFunc();
      }
    }
  }, [dispatch]);

  const handleLogout = async () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logout());
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 pb-2 tracking-wide border-b-[1px]">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="w-full text-black text-lg font-bold  items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full md:w-[120px] h-[70px]"
              />
            </span>
            <span className=" w-full px-3 mr-5 font-bold md:text-xl text-blue-950">
              OutdoorAdvertise
            </span>
          </Link>
        </div>
        <div
          className="md:hidden flex cursor-pointer max-w-sm"
          onClick={handleMobileMenuToggle}
        >
          {isLoggedIn && user && (
            <div className="  sm:flex mr-4 md:hidden items-center font-semibold space-x-4">
              <div className='flex flex-col items-center justify-center w-full"'>
                <Link href="/">
                  <img
                    src="/shopping-cart.png"
                    alt="Logo"
                    className=" h-[50px]"
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
              <button className="text-black  border-2 border-black hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-3xl">
                <Link href="/login">Login</Link>
              </button>
              <button className="text-black  border-2 border-black hover:bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-3xl">
                <Link href="/register">Register</Link>
              </button>
            </div>
          )}
          {isLoggedIn && user && (
            <div className="md:flex hidden items-center font-semibold space-x-4">
              <div className='flex flex-col items-center justify-center w-full"'>
                <Link href="/">
                  <img
                    src="/shopping-cart.png"
                    alt="Logo"
                    className=" h-[50px]"
                  />
                </Link>
              </div>
              <p className="text-xl text-black">{user}</p>
              <button
                onClick={handleLogout}
                className="text-white bg-black hover:bg-gray-700 active:bg-gray-900 px-4 py-2 rounded-3xl"
              >
                <Link href="/">LogOut</Link>
              </button>
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
                <Link href="/about">
                  <span className="block my-2 text-black cursor-pointer">
                    About
                  </span>
                </Link>
                <Link href="/services">
                  <span className="block my-2 text-black cursor-pointer">
                    Services
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
                      <button className="block my-2 text-black cursor-pointer">
                        LogOut
                      </button>
                    </Link>
                    <Link href="/">
                      <button className="block my-2 text-black cursor-pointer">
                        Your Cart
                      </button>
                    </Link>
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
