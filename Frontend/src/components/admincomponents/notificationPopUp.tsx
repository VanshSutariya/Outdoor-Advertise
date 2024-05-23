import { useEffect, useState } from "react";
import { CiBellOn } from "react-icons/ci";
import { ManagePoster, fetchAllRoleChanges } from "../../utils/http";
import { io, Socket } from "socket.io-client";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import toastFunction from "../reactToast/toast";

const NotificationPopUp: React.FC = () => {
  const [roleNotification, setRoleNotification] = useState<boolean>(false);
  const [postereNotification, setPosterNotification] = useState<boolean>(false);
  const {
    token,
  }: {
    token: string;
  } = useSelector((state: RootState) => state.auth);

  const socket = io("http://localhost:4040");

  useEffect(() => {
    socket.on("roleReq", (val) => {
      setRoleNotification(true);
    });

    return () => {
      socket.off("connection");
      socket.off("roleReq");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.on("posterReq", (val) => {
      setPosterNotification(true);
    });

    return () => {
      socket.off("connection");
      socket.off("roleReq");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const data = async () => {
      try {
        const alerts = await fetchAllRoleChanges(token);
        const status = "pending";
        const resData = await ManagePoster(status);

        if (resData !== undefined && resData.totalLength > 0) {
          setPosterNotification(true);
        }

        if (alerts > 0) {
          setRoleNotification(true);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    data();
  }, [token]);

  return (
    <>
      <button
        className="border-2 border-black rounded-lg hover:bg-gray-200 active:bg-transparent"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_2") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        {(roleNotification || postereNotification) && (
          <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-red-600 p-[6px] text-xs"></div>
        )}
        <CiBellOn size={33} />
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold font-inter text-lg text-red-500">
            Requests!
          </h3>
          {!roleNotification && !postereNotification && (
            <p className="py-4 font-poppins text-xl ">
              Currently there are no request.
            </p>
          )}
          {roleNotification && (
            <p className="py-4 font-poppins text-xl ">
              Approve the users role Change requests.
            </p>
          )}
          {postereNotification && (
            <p className="py-4 font-poppins text-xl ">Approve the Posters.</p>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
export default NotificationPopUp;
