import Link from "next/link";
import { useEffect, useState } from "react";
import Input from "./elements/input";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import toastFunction from "../reactToast/toast";
import SelectInput from "./elements/selectInput";
import TextArea from "./elements/textArea";
import { RootState } from "@/store";
import { fetchOnePoster } from "@/utils/http";
import { UploadButton } from "@/utils/uploadthing";

interface PosterFormProps {
  id?: string; // Make id optional
}

const PosterForm: React.FC<PosterFormProps> = ({ id }) => {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState<string | null>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { userId }: { userId: string | null } = useSelector(
    (state: RootState) => state.auth
  );

  const [formValues, setFormValues] = useState({
    title: "",
    mediatype: "Poles",
    lightingType: "FRONT-LIGHTING",
    landmark: "",
    facingFrom: "",
    address: "",
    state: "Gujarat",
    city: "",
    mindays: 2,
    perDayPrice: 1,
    height: 1,
    width: 1,
    minQty: 1,
    maxQty: 1,
  });
  useEffect(() => {
    const fetchPosterDetails = async () => {
      try {
        const response = await fetchOnePoster(id);
        if (response) {
          setFormValues((prev) => {
            setImgUrl(response?.image);
            const newdata = { ...prev };
            newdata.title = response.title;
            newdata.mediatype = response.mediatype;
            newdata.lightingType = response.lightingType;
            newdata.landmark = response?.landmark;
            newdata.address = response.address;
            newdata.facingFrom = response?.facinfFrom;
            newdata.state = response.state;
            newdata.city = response.city;
            newdata.mindays = response.minimumDays;
            newdata.perDayPrice = response.price;
            newdata.minQty = response.minQty;
            newdata.maxQty = response.maxQty;
            const [heightStr, widthStr] = response?.size
              .split("X")
              .map((str: any) => str.trim());

            // Extract numbers from the strings
            const height = parseInt(heightStr);
            const width = parseInt(widthStr);
            newdata.height = height;
            newdata.width = width;
            return newdata;
          });
        }
      } catch (error) {
        console.error("Error fetching poster details:", error);
      }
    };

    if (id) {
      fetchPosterDetails();
    }
  }, [id]);

  const validateSchema = Yup.object().shape({
    title: Yup.string()
      .matches(/^[A-Za-z]/, "Title must start with a letter")
      .required("Title must be required")
      .max(100, "Title must be at most 30 characters"),
    landmark: Yup.string()
      .required("Landmark is required")
      .max(100, "Landmark must be at most 50 characters"),
    facingFrom: Yup.string().max(
      20,
      "FacingFrom must be at most 20 characters"
    ),
    address: Yup.string().required("Address should not empty."),
    city: Yup.string()
      .matches(/^[A-Za-z]+$/, "City must contain only letters")
      .required("City is required")
      .max(20, "City must be at most 20 characters"),
    mindays: Yup.number()
      .min(2, "Minimum days must be at least 2")
      .max(365, "Minimum days must be at most 365"),
    perDayPrice: Yup.number()
      .required("Price must be required")
      .min(1, "Price must be at least 1")
      .max(10000000, "Price must be at most 10,000,000"),
    height: Yup.number()
      .required("Height must be required")
      .min(1, "Height must be at least 1")
      .max(100000, "Height must be at most 100,000"),
    width: Yup.number()
      .required("Width must be required")
      .min(1, "Width must be at least 1")
      .max(100000, "Width must be at most 100,000"),
    minQty: Yup.number()
      .min(1, "Minimum Quantity must be at least 1")
      .max(1000000, "value must be at most 1,000,000"),
    maxQty: Yup.number()
      .min(1, "Maximum Quantity must be at least 1")
      .max(1000000, "Maximum Quantity must be at most 1,000,000"),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const numericValue = [
      "perDayPrice",
      "height",
      "width",
      "mindays",
      "minQty",
      "maxQty",
    ].includes(name)
      ? parseFloat(value)
      : value;
    setFormValues({ ...formValues, [name]: numericValue });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await validateSchema.validate(formValues, { abortEarly: false });

      if (formValues.facingFrom?.trim() === "") {
        delete formValues.facingFrom;
      }

      if (!formValues.minQty) delete formValues.maxQty;
      if (!formValues.maxQty) delete formValues.minQty;
      const { height, width, mindays, perDayPrice, ...formData } = formValues;
      const size = `${height}H X ${width}W`;
      const sft = height * width;
      const postdata = {
        ...formData,
        sft,
        size,
        minimumDays: mindays,
        price: perDayPrice,
        image: imgUrl,
        createdBy: userId,
      };

      if (id) {
        const resData = await fetch(`http://localhost:4000/poster/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postdata),
        });
        const response = await resData.json();
        if (!resData.ok) {
          throw new Error(response.message || "enter valid data");
        }
        toastFunction("success", "Poster Created Successfully!");
        router.push("/dashboard/posters");
      } else {
        const resData = await fetch("http://localhost:4000/poster/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postdata),
        });
        const response = await resData.json();

        if (!resData.ok) {
          throw new Error(response.message || "enter valid data");
        }

        toastFunction("success", "Poster Created Successfully!");

        router.push("/outdoorAd/account");
      }
    } catch (error: any) {
      if (error.inner) {
        const newErrors = {};

        error.inner.forEach((err: { path: string | number; message: any }) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({});
        const errorParts = error.message.split(",");
        let formattedMessage = "";
        for (const part of errorParts) {
          formattedMessage += part.trim() + "\n";
        }
        console.log(error.message);
        toastFunction("warning", formattedMessage);
      }
    }
  };

  const renderAdditionalInputs = () => {
    if (
      formValues.mediatype === "Rickshaws" ||
      formValues.mediatype === "Poles"
    ) {
      return (
        <>
          <div className=" flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <Input
                name="minQty"
                value={formValues.minQty}
                onChange={handleChange}
                type="number"
                placeholder="1"
                label={`Minimum ${formValues.mediatype}`}
              />
              {errors.minQty && (
                <span className="text-red-500 ml-2 text-sm">
                  {errors.minQty}
                </span>
              )}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <Input
                name="maxQty"
                value={formValues.maxQty}
                onChange={handleChange}
                type="number"
                placeholder="10"
                label={`Maximum ${formValues.mediatype}`}
              />
              {errors.maxQty && (
                <span className="text-red-500 ml-2 text-sm">
                  {errors.maxQty}
                </span>
              )}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <div>
        <Link
          href={id ? `../${id}` : "/outdoorAd/account"}
          className=" text-lg md:px-[60px] pt-3 flex text-blue-600 hover:text-blue-700 active:text-blue-500 "
        >
          <p className="hover:scale-110 active:scale-95 duration-150 flex">
            <IoIosArrowRoundBack size={30} /> Back
          </p>
        </Link>
      </div>
      <main className=" pb-5">
        <div className=" flex justify-center items-center mb-6">
          <form
            className="w-[800px] border-[2px] border-gray-100 shadow-xl rounded-xl md:p-4 "
            onSubmit={handleSubmit}
          >
            <div className="flex justify-center items-center pb-[5px] md:-mt-3 ">
              <h1 className="text-4xl mt-3 tracking-wide md:pl-5 font-inter text-center md:w-full ">
                {id ? "Edit Poster" : "Create Your Poster"}
              </h1>
              <div className=" flex  justify-end md:pr-12">
                <img src="/billboard.png" alt="" className="h-20 w-20   " />
              </div>
            </div>
            {/*title-------------------------------------------- */}
            <div className=" flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-2/5 px-3">
                <Input
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="shivranjini, ahmedabad"
                  label="Title"
                />
                {errors.title && (
                  <span className="text-red-500 ml-2 text-sm">
                    {errors.title}
                  </span>
                )}
              </div>
              {/* mediatype-------------------------------------------------- */}
              <div className="w-full md:w-[240px] px-3 mb-6 md:mb-0">
                <SelectInput
                  name="mediatype"
                  value={formValues.mediatype}
                  onChange={handleChange}
                  options={[
                    "Poles",
                    "Airports",
                    "RailwayPlatforms",
                    "Rickshaws",
                    "Billboard",
                    "BusStands",
                    "Footoverbridges",
                  ]}
                  label="MediaType"
                />
              </div>
              {/* lightingtype ------------------------- */}

              <div className="w-full md:w-[230px] px-3 mb-6 md:mb-0">
                <SelectInput
                  name="lightingType"
                  value={formValues.lightingType}
                  onChange={handleChange}
                  options={[
                    "FRONT-LIGHTING",
                    "BACK-LIGHTING",
                    "LED-SCREEN",
                    "NO-LIGHTING",
                  ]}
                  label="LightingType"
                />
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
                {errors.landmark && (
                  <span className="text-red-500 ml-2 text-sm">
                    {errors.landmark}
                  </span>
                )}
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
                {errors.facingFrom && (
                  <span className="text-red-500 ml-2 text-sm">
                    {errors.facingFrom}
                  </span>
                )}
              </div>
            </div>

            {/* address-------------------------------------- */}
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full px-3">
                <TextArea
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder="xy-201, near business, city"
                  label="Address"
                />
                {errors.address && (
                  <span className="text-red-500 ml-2 text-sm">
                    {errors.address}
                  </span>
                )}
              </div>
            </div>

            {/* state & city & mindays--------------------------------------  */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <SelectInput
                  name="state"
                  value={formValues.state}
                  onChange={handleChange}
                  options={["Gujarat", "Maharashtra", "Delhi"]}
                  label="State"
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                  name="city"
                  value={formValues.city}
                  onChange={handleChange}
                  type="text"
                  placeholder="Ahmedabad"
                  label="City"
                />
                {errors.city && (
                  <span className="text-red-500 ml-2 text-sm ">
                    {errors.city}
                  </span>
                )}
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
                {errors.mindays && (
                  <span className="text-red-500 ml-2 text-sm ">
                    {errors.mindays}
                  </span>
                )}
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
                {errors.perDayPrice && (
                  <span className="text-red-500 ml-2 text-sm ">
                    {errors.perDayPrice}
                  </span>
                )}
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
                {errors.height && (
                  <span className="text-red-500 ml-2 text-sm ">
                    {errors.height}
                  </span>
                )}
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
                {errors.width && (
                  <span className="text-red-500 ml-2 text-sm ">
                    {errors.width}
                  </span>
                )}
              </div>
            </div>
            {/* upload button  */}
            <div className="flex flex-wrap items-center justify-center  -mx-3 ">
              <div className="w-full md:w-3/4  mb-3 md:mb-0">
                <UploadButton
                  className="mt-4 ut-button:bg-red-500 ut-readying:bg-red-100 ut-upload-icon:"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    setImgUrl(res[0].url);
                    // console.log('Files: ', res);
                    toastFunction("success", "Image Uploaded Successfully!");
                  }}
                  onUploadError={(error: Error) => {
                    toastFunction("error", error.message);
                  }}
                />
                {imgUrl && (
                  <p className="md:ml-[170px] text-[18px] items-center font-poppins">
                    Image Uploaded Successfully
                  </p>
                )}
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
    </>
  );
};

export default PosterForm;
