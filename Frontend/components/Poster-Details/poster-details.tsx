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
  mediatype: string;
  minAutos: number;
  maxAutos: number;
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
    mediatype: "",
    maxAutos: 0,
    minAutos: 0,
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

  const excludeFields = [
    "_id",
    "image",
    "__v",
    "latLng",
    "title",
    "createdAt",
    "updatedAt",
  ];
  const dataEntries = Object.entries(posterData).filter(
    ([key]) => !excludeFields.includes(key)
  );

  return (
    <>
      <div className="md:flex items-center">
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
              {dataEntries.map(([key, value], index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-violet-200 rounded-lg"
                      : "bg-violet-300 rounded-lg"
                  }
                >
                  <td>{key.toUpperCase()}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg pb-10 w-full flex ">
        <iframe
          title="Google Maps"
          width="100%"
          height="300"
          src={url}
        ></iframe>
      </div>
      <div className="justify-center flex pb-3">
        <DatePicker
          price={posterData.price}
          minDays={posterData.minimumDays}
          rickshaws={posterData.mediatype === "Rickshaws" ? true : false}
          minauto={posterData.minAutos}
          maxauto={posterData.maxAutos}
        />
      </div>
    </>
  );
};

export default PosterDetails;
