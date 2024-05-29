import toastFunction from "@/components/reactToast/toast";
import { updatePosterStatus } from "@/utils/http";
import { useRouter } from "next/navigation";

interface ButtonsProp {
  id: string;
}
const ManageButtons: React.FC<ButtonsProp> = (props) => {
  const router = useRouter();

  async function handlebtnClick(status: string) {
    try {
      await updatePosterStatus(props.id, status);
      router.push("/outdoorAd/admin/managePoster");
    } catch (error: any) {
      toastFunction("error", error);
    }
  }
  return (
    <div className="flex items-center rounded-md shadow-sm font-poppins justify-center p-3 gap-8 ">
      <button
        onClick={() => handlebtnClick("approved")}
        className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
      >
        Approve
      </button>

      <button
        onClick={() => handlebtnClick("rejected")}
        className="rounded-lg px-4 py-2 bg-yellow-500 text-yellow-100 hover:bg-yellow-600 duration-300"
      >
        Rejected
      </button>
    </div>
  );
};

export default ManageButtons;
