import { useEffect, useState } from 'react';
import { CiBellOn } from 'react-icons/ci';
import { fetchAllRoleChanges } from '../../utils/http';
const NotificationPopUp: React.FC = () => {
  const [notification, setNotification] = useState<boolean>(false);

  useEffect(() => {
    try {
      const data = async () => {
        const alerts = await fetchAllRoleChanges();
        console.log(alerts);

        if (alerts > 0) {
          setNotification(true);
        }
      };
      data();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <button
        className="border-2 border-black rounded-lg hover:bg-gray-200 active:bg-transparent"
        onClick={() => {
          if (document) {
            (
              document.getElementById('my_modal_2') as HTMLFormElement
            ).showModal();
          }
        }}
      >
        {notification && (
          <div className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-red-600 p-[6px] text-xs"></div>
        )}

        <CiBellOn size={33} />
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold font-inter text-lg text-red-500">
            Requests!
          </h3>
          <p className="py-4 font-poppins text-xl ">
            Approve the users role Change requests.
          </p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
export default NotificationPopUp;
