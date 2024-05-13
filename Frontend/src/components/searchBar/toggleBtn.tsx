const ToggleBtn = ({ isPopularClicked, onToggle }: any) => {
  const handleChange = () => {
    onToggle(!isPopularClicked);
  };

  return (
    <div className="md:mt-9 md:mb-3 md:mr-4 flex p-2 shadow-sm rounded-3xl border-2 border-gray-100">
      <p className="text-lg mr-1 font-poppins text-red-400 font-medium">
        Popular
      </p>
      <div className="pt-[3px]">
        <input
          type="checkbox"
          className="peer sr-only opacity-0"
          id="toggle"
          checked={isPopularClicked}
          onChange={handleChange}
        />
        <label
          htmlFor="toggle"
          className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-green-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-green-500"
        >
          <span className="sr-only">Enable</span>
        </label>
      </div>
    </div>
  );
};

export default ToggleBtn;
