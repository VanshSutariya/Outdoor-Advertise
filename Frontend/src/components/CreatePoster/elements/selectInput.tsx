interface SelectInputProps {
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  value,
  options,
  onChange,
  label,
}) => {
  return (
    <>
      <label
        className="block tracking-wide font-poppins text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <select
          className="appearance-none font-poppins block w-full bg-slate-100 border border-gray-100 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-slate-200 focus:border-gray-100"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
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
    </>
  );
};

export default SelectInput;
