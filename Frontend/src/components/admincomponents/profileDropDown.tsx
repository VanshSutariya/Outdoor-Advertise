import { FaUserLarge } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { logout } from "@/store/auth-slice";
const ProfileDropDown: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    userName,
    userRole,
  }: {
    userName: string | null;
    userRole: string | null;
  } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    dispatch(logout());
    router.push("/outdoorAd/login");
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  function handleAccountPage() {
    router.push("/outdoorAd/account");
  }
  return (
    <>
      <div className=" dropdown dropdown-end ">
        <div tabIndex={0} role="button" className="flex ">
          <div className="flex items-center mb-1  border-2 p-2 hover:bg-gray-200 rounded-xl">
            <div className=" items-center">
              <p className="text-lg p-1">{userName ? userName : "..."}</p>
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
          <li className="items-center">
            <Link href="/outdoorAd/">
              <button onClick={handleLogout}>Logout</button>
            </Link>
          </li>
          {userRole && userRole !== "user" && (
            <li className=" items-center">
              <Link href="/outdoorAd/createPoster">Create Poster</Link>
            </li>
          )}
          <li className=" items-center">
            <Link href="/outdoorAd/updatePassword">UpdatePassword</Link>
          </li>
        </ul>
      </div>
    </>
  );
};
export default ProfileDropDown;
