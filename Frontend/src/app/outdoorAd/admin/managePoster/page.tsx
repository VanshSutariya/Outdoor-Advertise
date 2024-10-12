"use client";
import Sidebar from "../../../../components/admincomponents/sidebar";
import ProfileDropDown from "../../../../components/admincomponents/profileDropDown";
import ManagePosterGrid from "@/components/admincomponents/managePoster/managePosterGrid";

export default function ManagePostersHomePage() {
  return (
    <>
      <Sidebar>
        <div className="flex items-center">
          <div className="w-full text-4xl md:ml-6 mt-3 font-medium font-poppins">
            Manage Posters
          </div>
          <div className="flex  justify-end  w-full mr-6 items-center">
            <ProfileDropDown />
          </div>
        </div>

        <ManagePosterGrid />
      </Sidebar>
    </>
  );
}
