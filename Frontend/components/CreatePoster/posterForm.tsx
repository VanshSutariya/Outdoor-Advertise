import { useState } from "react";
import { UploadButton } from "../../utils/uploadthing";
import Input from "./elements/input";
import { useRouter } from "next/router";

const PosterForm: React.FC = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    companyName: "",
    title: "",
    mediatype: "Poles",
    lightingType: "FRONT-LIGHTING",
    landmark: "",
    facingFrom: "",
    address: "",
    state: "Gujarat",
    city: "",
    mindays: undefined,
    perDayPrice: undefined,
    height: undefined,
    width: undefined,
    minAutos: undefined,
    maxAutos: undefined,
  });
  const [imgUrl, setImgUrl] = useState<string | null>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const numericValue =
      name === "perDayPrice" ||
      name === "height" ||
      name === "width" ||
      name === "mindays" ||
      name === "minAutos" ||
      name === "maxAutos"
        ? parseFloat(value)
        : value;

    setFormValues({ ...formValues, [name]: numericValue });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formValues.facingFrom?.trim() === "") {
      delete formValues.facingFrom;
    }

    if (!formValues.maxAutos) delete formValues.maxAutos;
    if (!formValues.minAutos) delete formValues.minAutos;

    const data = { ...formValues, imgUrl };
    const {
      title,
      mediatype,
      lightingType,
      landmark,
      facingFrom,
      address,
      state,
      city,
      mindays: minimumDays,
      perDayPrice: price,
      height,
      width,
      imgUrl: image,
      minAutos,
      maxAutos,
    } = data;
    const size = `${height} X ${width}`;
    const sft = height * width;
    try {
      const resData = await fetch("http://localhost:4000/poster/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          mediatype,
          lightingType,
          landmark,
          facingFrom,
          address,
          state,
          city,
          minimumDays,
          price,
          image,
          size,
          sft,
          minAutos,
          maxAutos,
        }),
      });
      const response = await resData.json();

      if (!resData.ok) {
        throw new Error(response.message || "enter valid data");
      }
      // Try to alert first to check if it's working
      alert("Data Successfully submitted.");
      // Then try navigating
      router.push("/");
    } catch (error) {
      console.log(error.message);
    }

    console.log(data);
  };

  const renderAdditionalInputs = () => {
    if (formValues.mediatype === "Rickshaws") {
      return (
        <>
          <div className=" flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <Input
                name="minAutos"
                value={formValues.minAutos}
                onChange={handleChange}
                type="number"
                placeholder="1"
                label="Minimum Autos"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <Input
                name="maxAutos"
                value={formValues.maxAutos}
                onChange={handleChange}
                type="number"
                placeholder="10"
                label="Maximum Autos"
              />
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <main className="bg-gradient-to-r from-slate-900 to-slate-800 pb-5">
      <div className=" flex justify-center items-center mb-6">
        <form
          className="w-[800px] shadow-2xl bg-slate-800 rounded-xl md:p-4 md:mt-8"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center mr-[40px] p-5 ">
            <h1 className="text-4xl text-white tracking-widest font-serif ">
              Add Your Poster
            </h1>
          </div>
          {/*title & company_name ------------------------- */}
          <div className=" flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <Input
                name="companyName"
                value={formValues.companyName}
                onChange={handleChange}
                type="text"
                placeholder="pixel"
                label="Company Name"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <Input
                name="title"
                value={formValues.title}
                onChange={handleChange}
                type="text"
                placeholder="title"
                label="Title"
              />
            </div>
          </div>
          {/*mediatype & lightingtype ------------------------- */}
          <div className=" flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-white text-sm font-bold mb-2"
                htmlFor="mediatype"
              >
                MediaType
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-gray-700 text-white border border-gray-700 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-700"
                  id="mediatype"
                  name="mediatype"
                  value={formValues.mediatype}
                  onChange={handleChange}
                >
                  <option value="Poles">Poles</option>
                  <option value="Airports">Airports</option>
                  <option value="RailwayPlatforms">RailwayPlatforms</option>
                  <option value="Rickshaws">Rickshaws</option>
                  <option value="Billboard">Billboard</option>
                  <option value="BusStands">BusStands</option>
                  <option value="Footoverbridges">Footoverbridges</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-white text-sm font-bold mb-2"
                htmlFor="lightingType"
              >
                LightingType
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-gray-700 text-white border border-gray-700 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-700"
                  id="lightingType"
                  name="lightingType"
                  value={formValues.lightingType}
                  onChange={handleChange}
                >
                  <option value="FRONT-LIGHTING">FRONT-LIGHTING</option>
                  <option value="BACK-LIGHTING">BACK-LIGHTING</option>
                  <option value="LED-SCREEN">LED-SCREEN</option>
                  <option value="NO-LIGHTING">NO-LIGHTING</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional inputs for Rickshaws */}
          {renderAdditionalInputs()}

          {/*landmark & facingfrom ------------------------- */}
          <div className=" flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
              <Input
                name="landmark"
                value={formValues.landmark}
                onChange={handleChange}
                type="text"
                placeholder="vesu cross road"
                label="Landmark"
              />
            </div>
            <div className="w-full md:w-1/3 px-3">
              <Input
                name="facingFrom"
                value={formValues.facingFrom}
                onChange={handleChange}
                type="text"
                placeholder="phonewala"
                label="Facing Form"
              />
            </div>
          </div>

          {/* address-------------------------------------- */}

          <div className="flex flex-wrap -mx-3 mb-3">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-white text-sm font-bold mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-700 text-white border border-gray-700 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-700"
                id="address"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                placeholder="xy-201, near business, city"
              />
            </div>
          </div>
          {/* state & city & mindays--------------------------------------  */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-white text-sm font-bold mb-2"
                htmlFor="state"
              >
                State
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-gray-700 text-white border border-gray-700 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-700"
                  id="state"
                  name="state"
                  value={formValues.state}
                  onChange={handleChange}
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-white text-sm font-bold mb-2"
                htmlFor="city"
              >
                City
              </label>
              <input
                className="appearance-none block w-full bg-gray-700 text-white border border-gray-700 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-700"
                id="city"
                name="city"
                type="text"
                value={formValues.city}
                onChange={handleChange}
                placeholder="Albuquerque"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Input
                name="mindays"
                value={formValues.mindays}
                onChange={handleChange}
                type="number"
                placeholder="5"
                label="Min Days"
              />
            </div>
          </div>
          {/* price & size & sft --------------------------------------------------- */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Input
                name="perDayPrice"
                value={formValues.perDayPrice}
                onChange={handleChange}
                type="number"
                placeholder="5000"
                label="Per Day Price"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Input
                name="height"
                value={formValues.height}
                onChange={handleChange}
                type="number"
                placeholder="30"
                label="Height In Foot"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <Input
                name="width"
                value={formValues.width}
                onChange={handleChange}
                type="number"
                placeholder="30"
                label="Width In Foot"
              />
            </div>
          </div>
          {/* upload button  */}
          <div className="flex flex-wrap items-center justify-center  -mx-3 ">
            <div className="w-full md:w-3/4  mb-3 md:mb-0">
              <UploadButton
                className="mt-4 ut-button:bg-red-500 ut-readying:bg-red-100"
                endpoint="imageUploader"
                onClientUploadComplete={(res: { url: string }[]) => {
                  setImgUrl(res[0].url);
                  console.log("Files: ", res);
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            <div className="w-full md:w-1/4 flex justify-end pr-10 mb-3 md:mb-0">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PosterForm;
