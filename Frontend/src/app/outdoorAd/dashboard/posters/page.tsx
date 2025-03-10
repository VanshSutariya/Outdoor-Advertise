"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import Sidebar from "../../../../components/admincomponents/sidebar";
import PosterGrid from "../../../../components/Poster/poster-grid";
import ProfileDropDown from "../../../../components/admincomponents/profileDropDown";

export default function PosterDetails() {
  const {
    userId,
  }: {
    userId: string | null;
  } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Sidebar>
        <div className="flex items-center">
          <div className="w-full text-4xl md:ml-6 mt-3 font-medium font-poppins">
            Your Owned Posters{" "}
          </div>
          <div className="flex  justify-end  w-full mr-6 items-center">
            <ProfileDropDown />
          </div>
        </div>

        <PosterGrid id={userId} />
      </Sidebar>
    </>
  );
}
