import Link from "next/link";

interface PosterItemProps {
  title: string;
  image: string;
  price: number;
  lightingType: string;
  _id: string;
}

const PosterItem: React.FC<PosterItemProps> = ({
  title,
  lightingType,
  image,
  price,
  _id,
}) => {
  return (
    <Link href={`/poster/${_id}`}>
      <div className=" bg-white rounded-lg overflow-hidden w-[300px]">
        <div className="relative ">
          <img
            className="w-full md:h-[290px] h-[200px] rounded-lg"
            src={image}
            alt={title}
          />
          {/* <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
            Popular
          </div> */}
        </div>
        <div className="px-2 ">
          <h3 className="pt-2 text-md font-medium  ">{title}</h3>
          <p>{lightingType.toLocaleLowerCase()}</p>
          <div className="flex items-center justify-between pt-1 pb-2 ">
            <span className="">
              <span className="font-semibold md:text-md">₹{price}/</span>{" "}
              <span>perDay</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PosterItem;
