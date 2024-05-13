import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { io, Socket } from "socket.io-client";
import { UserRoleChangeStatus, sendRoleChangeRequest } from "@/utils/http";
import { changeRole } from "@/store/auth-slice";

const PopUpModal: React.FC = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<string | null>(null);

  // const [socket, setSocket] = useState<Socket>();

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
    const data = async () => {
      const statusRes = await UserRoleChangeStatus(userId);
      if (statusRes[0]) {
        setStatus(statusRes[0].status);
      }
    };
    data();
  }, []);

  async function handleRoleChangeReq() {
    if (userId) {
      const _id = userId;
      const roleChangeRes = await sendRoleChangeRequest(_id);
      setStatus(roleChangeRes.status);
    }
  }
  const socket = io("http://localhost:4040");

  useEffect(() => {
    socket.on("roleChange", (val) => {
      console.log("call data", val);
      setStatus(val.status);
      if (val.status === "approved") {
        dispatch(changeRole());
      }
    });

    return () => {
      socket.off("connection");
      socket.off("roleChange");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      <button
        className="w-[285px]"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_4") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        <div className="flex border-[2px] border-slate-200 mt-3 shadow-md rounded-md p-3 w-full  hover:bg-slate-200 active:bg-white">
          <img
            src="/roleUpdate.png"
            alt="order"
            className="h-14 w-14 mt-1 mb-1"
          />
          <div>
            <p className="ml-3 mt-3 text-lg">Change Role</p>
            <p className="ml-3 text-sm">Become member </p>
          </div>
        </div>
      </button>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-inter text-3xl tracking-wider mb-2">
            Change Role
          </h3>
          <div className=" items-center flex ">
            {(!status || status === "rejected") && (
              <button
                onClick={handleRoleChangeReq}
                className="md:mt-3 p-3 rounded-xl text-white bg-blue-500 font-poppins font-medium hover:bg-blue-700 active:bg-blue-500"
              >
                Become a member
              </button>
            )}
            {status && (
              <div className="flex ml-10  font-poppins  pt-4">
                <p className=" text-2xl pt-[2px]  ">Status : </p>
                <p
                  className={`${
                    status === "pending"
                      ? "bg-yellow-500"
                      : status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }  p-2 ml-2 text-sm text-white font-semibold `}
                >
                  {status}
                </p>
              </div>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default PopUpModal;
