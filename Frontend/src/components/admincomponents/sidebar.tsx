import Link from "next/link";
import { RootState } from "../../store";
import { FiUsers } from "react-icons/fi";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { MdOutlineSettings, MdOutlineAnalytics } from "react-icons/md";
import { LuLayoutDashboard, LuShoppingCart } from "react-icons/lu";

const Sidebar = ({ children }: any) => {
  const {
    userRole,
  }: {
    userRole: string | null;
  } = useSelector((state: RootState) => state.auth);

  const pathname = usePathname();
  return (
    <>
      <aside
        id="default-sidebar"
        className="w-30 md:w-64 border-r-[2px] border-black fixed h-full overflow-y-auto"
      >
        <div className=" py-6">
          <div className="text-xl flex font-semibold text-center font-inter ">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full md:w-[60px] h-[60px] -mt-4 mr-2"
            />
            <p className="hidden md:block">OutdoorAdvertise</p>
          </div>

          <ul className="mt-6 md:px-4 ">
            {/* Navigation links */}
            <li
              className={`px-4 flex   items-center justify-center py-2 text-lg font-poppins rounded-lg active:scale-95 hover:bg-black hover:text-white  hover:scale-105 duration-100 mb-3 ${
                pathname === "/outdoorAd/admin" ||
                pathname === "/outdoorAd/dashboard"
                  ? "bg-black text-white"
                  : ""
              } `}
            >
              <Link
                href={`${
                  userRole === "member"
                    ? "/outdoorAd/dashboard/"
                    : "/outdoorAd/admin"
                }`}
                className={`flex active:bg-black active:text-white aria-pressed:bg-black w-full md:ml-3 `}
              >
                <LuLayoutDashboard size={22} className=" mr-2 mt-[2px] " />

                <p className="hidden md:block">Dashboard</p>
              </Link>
            </li>

            {userRole === "member" && (
              <>
                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins rounded-lg active:scale-95  hover:bg-black hover:text-white  hover:scale-105 duration-100 mb-3 ${
                    pathname.includes("/posters") ? "bg-black text-white" : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/dashboard/posters"
                    className=" flex items-center active:bg-black active:text-white w-full md:ml-3"
                  >
                    <MdOutlineAnalytics size={22} className=" mr-2 " />
                    <p className="hidden md:block">My Posters</p>
                  </Link>
                </li>

                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins rounded-lg active:scale-95  hover:bg-black hover:text-white  hover:scale-105 duration-100 mb-3 ${
                    pathname.includes("/posterStatus")
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/dashboard/posterStatus"
                    className=" flex items-center active:bg-black active:text-white w-full md:ml-3"
                  >
                    <MdOutlineSettings size={22} className=" mr-2 " />
                    <p className="hidden md:block">Poster Status</p>
                  </Link>
                </li>
              </>
            )}

            {userRole === "admin" && (
              <>
                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins rounded-lg active:scale-95  hover:bg-black hover:text-white  hover:scale-105 duration-100 mb-3 ${
                    pathname.includes("/users") ? "bg-black text-white" : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/admin/users"
                    className=" flex items-center active:bg-black active:text-white w-full md:ml-3"
                  >
                    <FiUsers size={22} className=" mr-2 " />
                    <p className="hidden md:block"> Users</p>
                  </Link>
                </li>
                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins rounded-lg active:scale-95 hover:bg-black hover:text-white hover:scale-105 duration-100  mb-3 ${
                    pathname.includes("/posters") ? "bg-black text-white" : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/admin/posters"
                    className=" flex items-center active:bg-black active:text-white w-full md:ml-3"
                  >
                    <MdOutlineAnalytics size={22} className=" mr-2 " />
                    <p className="hidden md:block">My Posters</p>
                  </Link>
                </li>
                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins rounded-lg active:scale-95 hover:bg-black hover:text-white hover:scale-105 duration-100 mb-3 ${
                    pathname.includes("/orders") ? "bg-black text-white" : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/admin/orders"
                    className=" flex items-center w-full md:ml-3 "
                  >
                    <LuShoppingCart size={22} className="mr-2 " />
                    <p className="hidden md:block"> Orders</p>
                  </Link>
                </li>
                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins rounded-lg active:scale-95  hover:bg-black hover:text-white hover:scale-105 duration-100 mb-3 ${
                    pathname.includes("/roleManage")
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/admin/roleManage"
                    className=" flex items-center w-full md:ml-3"
                  >
                    <MdOutlineSettings size={22} className=" mr-2 " />
                    <p className="hidden md:block">Manage Roles</p>
                  </Link>
                </li>
                <li
                  className={`px-4 py-2 flex  items-center justify-center text-lg font-poppins  hover:bg-black hover:text-white active:scale-95  rounded-lg  hover:scale-105 duration-100 mb-3 ${
                    pathname.includes("/managePoster")
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  <Link
                    href="/outdoorAd/admin/managePoster"
                    className=" flex items-center w-full md:ml-3"
                  >
                    <MdOutlineAnalytics size={22} className=" mr-2 " />
                    <p className="hidden md:block">Manage Posters</p>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-20 md:ml-64 p-8 ">{children}</div>
    </>
  );
};

export default Sidebar;
