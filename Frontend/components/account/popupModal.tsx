import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserRoleChangeStatus, sendRoleChangeRequest } from '../../utils/http';
import { useEffect, useState } from 'react';

const PopUpModal: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const { userId, userRole }: { userId: string | null; userRole: string } =
    useSelector((state: RootState) => state.auth);

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
    const _id = userId;
    const roleChangeRes = await sendRoleChangeRequest(_id);
    setStatus(roleChangeRes.status);
  }

  return (
    <>
      <button
        className="w-[285px]"
        onClick={() => {
          if (document) {
            (
              document.getElementById('my_modal_4') as HTMLFormElement
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
          {(!status || status === 'rejected') && (
            <div className=" items-center">
              <button
                onClick={handleRoleChangeReq}
                className="md:mt-3 p-3 rounded-xl text-white bg-blue-500 font-poppins font-medium hover:bg-blue-700 active:bg-blue-500"
              >
                Become a member
              </button>
            </div>
          )}
          {status && (
            <div className="flex font-poppins  pt-4">
              <p className=" text-2xl pt-[2px]  ">Status : </p>
              <p
                className={`${
                  status === 'pending'
                    ? 'bg-yellow-500'
                    : status === 'approved'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }  p-2 ml-2 text-sm text-white font-semibold `}
              >
                {status}
              </p>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default PopUpModal;
