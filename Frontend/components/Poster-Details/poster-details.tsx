import { fetchOnePoster } from "../../utils/http";
import { useEffect, useState } from "react";
import DatePicker from "./date-range-picker";

interface PosterData {
  image: string;
  title: string;
  price: number;
  size: string;
  sft: number;
  lightingType: string;
  address: string;
  facingFrom: string;
  minimumDays: number;
}

interface PosterDetailsProps {
  id: string;
}

const PosterDetails: React.FC<PosterDetailsProps> = ({ id }) => {
  const [posterData, setPosterData] = useState<PosterData>({
    image: "",
    title: "",
    price: 0,
    size: "",
    sft: 0,
    lightingType: "",
    address: "",
    facingFrom: "",
    minimumDays: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData: PosterData = await fetchOnePoster(id);
        setPosterData(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const lat: number = 23.02436884189762;
  const lng: number = 72.53198504447938;
  const url: string = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <>
      <div className="md:flex items-center bg-gradient-to-r from-violet-300 to-purple-500">
        <div className="pt-8 hover:scale-105 rounded-lg md:ml-[100px] md:mr-12 mb-9">
          <img
            className="rounded-2xl sm:h-[200px] md:h-[300px] w-full"
            src={posterData.image}
            alt="poster1-image"
          />
        </div>
        <div className="sm:w-full md:w-1/2 rounded-lg md:ml-[50px]">
          <h1 className="mt-4 text-4xl text-gray-800 font-bold tracking-wider font-serif">
            {posterData.title}
          </h1>
          <table className="border-spacing-3 black w-full table-fixed text-2xl mt-5 mb-5 tracking-wide font-mono">
            <tbody className="rounded-lg">
              <tr className="bg-violet-200 rounded-b-md">
                <td>Price</td>
                <td>{posterData.price}</td>
              </tr>
              <tr className="bg-violet-300 rounded-lg">
                <td>Size</td>
                <td>{posterData.size}</td>
              </tr>
              <tr className="bg-violet-200 rounded-lg">
                <td>SFT</td>
                <td>{posterData.sft}</td>
              </tr>
              <tr className="bg-violet-300 rounded-lg">
                <td>Lighting Type</td>
                <td>{posterData.lightingType}</td>
              </tr>
              <tr className="bg-violet-200 rounded-lg">
                <td>Address</td>
                <td>{posterData.address}</td>
              </tr>
              <tr className="bg-violet-300 rounded-lg">
                <td>Facing From</td>
                <td>{posterData.facingFrom}</td>
              </tr>
              <tr className="bg-violet-200 rounded-lg">
                <td>Minmun Booking Days</td>
                <td className="pl-5">{posterData.minimumDays}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg pb-10 w-full flex bg-gradient-to-r from-purple-500 to-violet-300">
        <iframe
          title="Google Maps"
          width="100%"
          height="300"
          src={url}
        ></iframe>
      </div>
      <div className="justify-center flex bg-gradient-to-r from-purple-500 to-violet-300">
        <DatePicker price={posterData.price} minDays={posterData.minimumDays} />
      </div>
    </>
  );
};

export default PosterDetails;
