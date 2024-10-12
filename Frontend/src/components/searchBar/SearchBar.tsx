"use client";
import { FaSearch } from "react-icons/fa";
import Input from "./inputBtn";
import { useEffect, useState } from "react";
import PosterGrid from "../Poster/poster-grid";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import ToggleBtn from "./toggleBtn";

const SearchBar: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";
  const address = params.get("address") || "";
  const state = params.get("state") || "";
  const city = params.get("city") || "";
  const isPopularClicked = params.get("isPopularClicked") === "true";
  const [showbtn, setShowBtn] = useState(false);
  const [isPopular, setIsPopular] = useState(isPopularClicked);
  const [formValues, setFormValues] = useState({
    location: address,
    state: state,
    city: city,
    mediatype: category,
  });
  const [search, setSearch] = useState({
    location: "",
    state: "",
    city: "",
    mediatype: "",
  });

  useEffect(() => {
    const paramsObj = qs.parse(params.toString());
    const hasParams = Object.keys(paramsObj).some((key) =>
      ["address", "state", "city", "popular"].includes(key)
    );
    setShowBtn(hasParams);
  }, [params]);

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    setSearch({ ...formValues });
    setShowBtn(true);
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const udpatedQuery: any = {
      ...currentQuery,
      city: formValues?.city,
      state: formValues?.state,
      address: formValues?.location,
      category: formValues?.mediatype,
      isPopularClicked: isPopular.toString(),
    };

    const url = qs.stringifyUrl(
      {
        url: "/outdoorAd/",
        query: udpatedQuery,
      },
      { skipNull: true }
    );
    window.history.replaceState({}, document.title, "/");
    router.push(url);
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
  };

  function handleClearBtn() {
    setIsPopular(false);
    window.history.replaceState({}, document.title, "/outdoorAd");
    router.replace("/outdoorAd", undefined);
    setFormValues({
      location: "",
      state: "",
      city: "",
      mediatype: "",
    });
    setSearch({
      location: "",
      state: "",
      city: "",
      mediatype: "",
    });
    setShowBtn(false);
  }

  const handleToggle = () => {
    const newIsPopular = !isPopular;
    setIsPopular(newIsPopular);

    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      isPopularClicked: newIsPopular ? "true" : "false",
    };

    const url = qs.stringifyUrl(
      {
        url: "/outdoorAd/",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  };

  return (
    <>
      <div className="md:flex justify-center" data-testid="SearchBar">
        <form
          onSubmit={handleFormSubmit}
          className=" md:flex justify-center items-center font-inter pt-5 md:mr-6"
        >
          <div className="bar w-700 md:border-[1px] bg-white shadow-md  md:rounded-full  md:flex justify-center md:text-sm ">
            <div className="md:w-1/3 flex-col items-center justify-center w-full  rounded-full px-6 py-2 transition-all duration-250 ease-in-out  hover:bg-gray-200">
              <p>Location</p>

              <Input
                name="location"
                placeholder="vesu cross road"
                value={formValues.location}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-1/4 items-center justify-center w-full rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-gray-200">
              <p>City</p>
              <Input
                name="city"
                placeholder="Surat"
                value={formValues.city}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-1/4 items-center justify-center w-full rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-gray-200">
              <p>State</p>
              <Input
                name="state"
                placeholder="Gujarat"
                value={formValues.state}
                onChange={handleChange}
              />
            </div>
            <div className=" md:w-1/4 items-center justify-center w-full relative rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-gray-200">
              <p>Popular</p>
              <ToggleBtn
                isPopularClicked={isPopularClicked}
                onToggle={handleToggle}
              />
            </div>
            <button
              type="submit"
              className="flex w-full md:w-[60px] mr-[4px] mt-[5px] md:h-14 h-[50px] items-center justify-center  text-white pt-2 bg-red-600 rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-red-500 active:bg-red-600"
            >
              <div>
                <FaSearch size={22} />
              </div>
            </button>
          </div>
        </form>

        <div className=" text-end mt-8 ">
          {showbtn && (
            <button
              onClick={handleClearBtn}
              className="rounded-full h-[55px] w-[55px] border-[2px] p-2 border-slate-100 hover:bg-gray-100 hover:scale-110 active:scale-95   text-white font-bold  "
            >
              <img src="/broom.png" alt="" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
