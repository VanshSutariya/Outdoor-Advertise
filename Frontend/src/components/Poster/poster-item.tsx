import Link from "next/link";

interface PosterItemProps {
  title: string;
  image: string;
  price: number;
  lightingType: string;
  _id: string;
  id?: string;
  totalBooking?: number;
  avgBooking: number;
  mediatype: string;
}

const PosterItem: React.FC<PosterItemProps> = (props) => {
  const capitalizedTitle = props.title
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
  return (
    <Link
      href={
        props.id ? `posters/${props._id}` : `/outdoorAd/poster/${props._id}`
      }
    >
      <div className="bg-white rounded-lg w-100">
        <div className="relative md:h-[290px] h-[200px] rounded-lg overflow-hidden">
          <img
            className="w-[415px] h-full rounded-lg hover:scale-125 hover:w-[415px] hover:rounded-lg transition-transform duration-400"
            src={props.image}
            alt={props.title}
          />
          {props.totalBooking !== undefined &&
            props.avgBooking !== undefined &&
            props.totalBooking > props.avgBooking * 3 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
                Popular
              </div>
            )}
        </div>
        <div className="px-1">
          <h3 className="pt-2 text-[19px] font-inter">{capitalizedTitle}</h3>
          <p className="font-poppins">
            {props.lightingType.toLocaleLowerCase()}
          </p>
          <div className="flex items-center justify-between pt-1 pb-2">
            <span>
              <span className="font-semibold font-inter md:text-md">
                ₹{props.price}/
              </span>
              <span className="font-poppins">
                {props.mediatype === "Buses"
                  ? "bus"
                  : props.mediatype === "Poles"
                  ? "pole"
                  : props.mediatype === "Rickshaws"
                  ? "auto"
                  : "day"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PosterItem;
