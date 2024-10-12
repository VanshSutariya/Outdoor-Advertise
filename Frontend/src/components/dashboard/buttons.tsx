import Link from "next/link";
import DeletePopUp from "./deletePopUp";

interface ButtonsProps {
  id: string;
}
const Buttons: React.FC<ButtonsProps> = ({ id }) => {
  return (
    <div className="flex items-center rounded-md shadow-sm justify-center p-3 ">
      <Link href={`edit/${id}`}>
        <button className="text-slate-800 hover:text-blue-600 text-xl mr-3 rounded-md bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </span>
          <span className="hidden md:inline-block">Edit</span>
        </button>
      </Link>

      <DeletePopUp id={id} />
    </div>
  );
};

export default Buttons;
