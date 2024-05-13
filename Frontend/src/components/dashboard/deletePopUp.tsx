import { deletePosterById } from "@/utils/http";
import toastFunction from "../reactToast/toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface DeleteProps {
  id: string;
}
const DeletePopUp: React.FC<DeleteProps> = ({ id }) => {
  const router = useRouter();
  const { token }: { token: string } = useSelector(
    (state: RootState) => state.auth
  );

  async function handleDeleteBtn() {
    try {
      const response = await deletePosterById(id, token);

      const deleteSuccess = await response.json();
      toastFunction("success", "Poster Deleted Success.");
      setTimeout(() => {
        router.push("/outdoorAd/dashboard/posters");
      }, 800);
      if (!response.ok) throw new Error("Cant able to delete, try again.");
      console.log(deleteSuccess);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <button
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_3") as HTMLFormElement
            ).showModal();
          }
        }}
        className="text-slate-800 hover:text-blue-600 text-xl rounded-md bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </span>
        <span className="hidden md:inline-block">Delete</span>
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="  ">
            <div className="p-6 pt-0 text-center">
              <svg
                className="w-20 h-20 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                Are you sure you want to delete this poster?
              </h3>
              <button
                onClick={handleDeleteBtn}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default DeletePopUp;
