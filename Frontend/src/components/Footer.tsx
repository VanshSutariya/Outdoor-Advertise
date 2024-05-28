import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="text-gray-600 body-font bg-white border-t-[2px] border-t-gray-200 ">
      <div className="container px-5 pt-20 -mt-10 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 md:pl-3 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <div className="flex title-font  items-center md:justify-start justify-center ">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-[60px] h-[60px] -mt-4 mr-2"
            />
            <p className=" title-font tracking-widest text-sm mb-2  font-bold ">
              Outdoor Advertise
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-500 ">
            Choose your Outdoor Media Plan for Advertisement
          </p>
        </div>
        <div className="flex-grow flex mxs:flex-wrap justify-center  md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-600 tracking-widest text-lg mb-1 mt-2">
              Features
            </h2>
            <nav className="list-none mb-10">
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Easy to access
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Get your suitable dates
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Easy booking
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Great earning oppurtinity
                </p>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-600 tracking-widest text-lg mb-1 mt-2">
              Media Plans
            </h2>
            <nav className="list-none mb-10">
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Billboard hoarding
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Supermarket / retail media
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  {" "}
                  Public Bus Stands
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Auto Rikshaws
                </p>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-600 tracking-widest text-lg mb-1 mt-2">
              Media Plans
            </h2>
            <nav className="list-none mb-10">
              <li>
                <p className="text-gray-600 hover:text-gray-800">Airports</p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">Railways</p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">
                  Public Foot OverBridges
                </p>
              </li>
              <li>
                <p className="text-gray-600 hover:text-gray-800">Buses</p>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 ">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2024 Outdoor Advertise —
            <a
              href="https://twitter.com/vanshsutariya"
              rel="noopener noreferrer"
              className="text-gray-600 ml-1"
              target="_blank"
            >
              @Vansh Sutariya
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <Link
              className="text-gray-500"
              href="https://facebook.com/vanshsutariya"
            >
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </Link>
            <Link
              className="ml-3 text-gray-500"
              href="https://twitter.com/vanshsutariya"
            >
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </Link>
            <Link
              className="ml-3 text-gray-500"
              href="https://www.instagram.com/"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </Link>
            {/* //linkdin */}
            <Link
              className="ml-3 text-gray-500"
              href="https://www.linkedin.com/in/vansh-sutariya/"
            >
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                ></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
