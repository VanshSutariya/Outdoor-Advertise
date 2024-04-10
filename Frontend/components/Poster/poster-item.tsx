import Link from "next/link";

interface PosterItemProps {
  title: string;
  image: string;
  price: number;
  _id: string;
}

const PosterItem: React.FC<PosterItemProps> = ({
  title,
  image,
  price,
  _id,
}) => {
  return (
    <div className=" bg-white rounded-md overflow-hidden sm:w-[350px] md:w-[400px]">
      <div className="relative">
        <img
          className="w-full h-[150px] md:h-[210px]"
          src={image}
          alt={title}
        />
        {/* <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
          Popular
        </div> */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium pb-7 ">{title}</h3>

        <div className="flex items-center justify-between ">
          <span className="font-semibold md:text-lg">₹{price}/perDay</span>
          <Link
            href={`/poster/${_id}`}
            className="bg-blue-500 hover:bg-blue-700 active:bg-indigo-800 text-white font-bold sm:px-3 md:py-2 md:px-4 rounded"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PosterItem;
