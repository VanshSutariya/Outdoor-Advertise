import React, { useEffect, useState } from "react";
import Link from "next/link";
import { decode } from "jsonwebtoken";
import fetchUser from "../utils/http";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const jwtCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="));

    if (jwtCookie) {
      const token = jwtCookie.split("=")[1];
      const decodedToken = decode(token) as { id: string };
      console.log(decodedToken);
      if (decodedToken) {
        const fetchUserFunc = async () => {
          const user = await fetchUser(decodedToken.id);
          console.log(user);
          setUserName(user);
        };
        fetchUserFunc();
        setLoggedIn(true);
      }
    }
  }, []);

  const handleLogout = async () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLoggedIn(false);
    setUserName(null);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="flex font-inter justify-between items-center px-4 bg-black tracking-wide">
        <div className='flex mr-9 flex-col items-center justify-center w-full"'>
          <Link href="/">
            <span className="sm:w-[7rem] w-[5rem] text-white text-lg font-bold flex items-center">
              <img src="/logo.png" alt="Logo" className="mr-2 h-[60px]" />
            </span>
          </Link>
        </div>
        <div
          className="md:hidden flex cursor-pointer max-w-sm"
          onClick={handleMobileMenuToggle}
        >
          <div className="flex-1 ml-auto">
            <span className="text-white text-4xl">&#9776;</span>
          </div>
        </div>
        <div className="container hidden mx-auto md:flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex font-semibold space-x-4">
              <Link href="/">
                <span className="text-white">Home</span>
              </Link>
              <Link href="/about">
                <span className="text-white">About</span>
              </Link>
              <Link href="/services">
                <span className="text-white">Services</span>
              </Link>
              <Link href="/contact">
                <span className="text-white">Contact</span>
              </Link>
            </div>
          </div>
          {!loggedIn && (
            <div className="md:flex hidden items-center font-semibold space-x-4">
              <button className="text-white bg-gray-600 hover:bg-gray-700 active:bg-gray-900 px-4 py-1 rounded">
                <Link href="/login">Login</Link>
              </button>
              <button className="text-white bg-gray-600 hover:bg-gray-700 active:bg-gray-900 px-4 py-1 rounded">
                <Link href="/register">Register</Link>
              </button>
            </div>
          )}
          {loggedIn && userName && (
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
              <p className="text-xl text-white">{userName}</p>
              <button
                onClick={handleLogout}
                className="text-white bg-gray-600 hover:bg-gray-700 active:bg-gray-900 px-4 py-1 rounded"
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
                {!loggedIn && (
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
                {loggedIn && (
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
        {loggedIn && userName && (
          <div className="  sm:flex md:hidden items-center font-semibold space-x-4">
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
      </nav>
    </>
  );
};

export default NavBar;
