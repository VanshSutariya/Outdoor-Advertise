import Link from 'next/link';
import { useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { LuLayoutDashboard, LuShoppingCart } from 'react-icons/lu';
import { MdOutlineSettings } from 'react-icons/md';

const Sidebar = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className="w-20 md:w-64 border-r-[2px] border-black fixed h-full overflow-y-auto"
      >
        <div className=" py-6">
          <div className="text-xl flex font-semibold border-b-[1px] border-black text-center font-inter ">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full md:w-[60px] h-[60px] -mt-4 mr-2"
            />
            OutdoorAdvertise
          </div>
          <ul className="mt-6 md:px-4 ">
            {/* Navigation links */}
            <li className="px-4 flex   items-center justify-center py-2 text-lg font-poppins  hover:bg-slate-200 rounded-lg active:bg-black active:text-white hover:scale-105 duration-100  ">
              <Link
                href="/admin"
                className="flex active:bg-black active:text-white aria-pressed:bg-black w-full md:ml-3"
              >
                <LuLayoutDashboard size={22} className=" mr-2 mt-[2px] " />
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="px-4 py-2 flex  items-center justify-center text-lg font-poppins  hover:bg-slate-200 rounded-lg active:bg-black active:text-white hover:scale-105 duration-100">
              <Link
                href="/admin/users"
                className=" flex items-center active:bg-black active:text-white w-full md:ml-3"
              >
                <FiUsers size={22} className=" mr-2 " />
                <p> Users</p>
              </Link>
            </li>
            <li className="px-4 py-2 flex  items-center justify-center text-lg font-poppins  hover:bg-slate-200 rounded-lg active:bg-black active:text-white hover:scale-105 duration-100 ">
              <Link
                href="/admin/orders"
                className=" flex items-center w-full md:ml-3 "
              >
                <LuShoppingCart size={22} className="mr-2 " />
                <p> Orders</p>
              </Link>
            </li>
            <li className="px-4 py-2 flex  items-center justify-center text-lg font-poppins  hover:bg-slate-200 rounded-lg active:bg-black active:text-white hover:scale-105 duration-100 ">
              <Link
                href="/admin/roleManage"
                className=" flex items-center w-full md:ml-3"
              >
                <MdOutlineSettings size={22} className=" mr-2 " />
                <p>Manage Roles</p>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-20 md:ml-64 p-8 ">{children}</div>
    </>
  );
};

export default Sidebar;
