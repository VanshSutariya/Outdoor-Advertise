import { FaSearch } from 'react-icons/fa';
const SearchBar: React.FC = (props) => {
  return (
    <form className="px-12 md:flex justify-center items-center font-inter pt-5 ">
      <div className="bar w-700 md:border-[1px] bg-white shadow-md  md:rounded-full  md:flex justify-center md:text-sm ">
        <div className="md:w-1/3 items-center justify-center w-full  rounded-full px-6 py-2 transition-all duration-250 ease-in-out  hover:bg-gray-200">
          <p>Location</p>
          <input
            type="text"
            placeholder="vesu cross road"
            className="items-center  focus:outline-none bg-transparent border-none pt-2"
          />
        </div>
        <div className="md:w-1/4 items-center justify-center w-full rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-gray-200">
          <p>City</p>
          <input
            type="text"
            placeholder="Surat"
            className="bg-transparent bg-none focus:outline-none border-none pt-2 "
          />
        </div>
        <div className="md:w-1/4 items-center justify-center w-full rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-gray-200">
          <p>State</p>
          <input
            type="text"
            placeholder="Gujarat"
            className="bg-transparent focus:outline-none border-none pt-2"
          />
        </div>
        <div className=" md:w-1/4 items-center justify-center w-full relative rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-gray-200">
          <p>Media Plans</p>
          <select
            id="month"
            className="bg-transparent focus:outline-none border-none pt-2"
          >
            <option value="" disabled>
              ---Select Media Type--
            </option>
            <option value=""> BillBoard Hoarding</option>
            <option value=""> Bus Stands</option>
            <option value=""> Airports/Railways</option>
          </select>
        </div>
        <div className="flex w-full md:w-[60px] mr-[4px] mt-[4px] md:h-14 h-[50px] items-center justify-center  text-white pt-2 bg-red-600 rounded-full px-6 py-2 transition-all duration-250 ease-in-out hover:bg-red-500 active:bg-red-600">
          <button>
            <FaSearch size={26} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
