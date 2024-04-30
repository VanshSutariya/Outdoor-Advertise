interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (props) => {
  return (
    <>
      <label
        className="block  tracking-wide font-poppins text-sm font-bold mb-2"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <input
        className="appearance-none font-poppins block w-full bg-slate-100  border border-gray-100 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-slate-200 focus:border-gray-100"
        id={props.name}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        min={1}
      />
    </>
  );
};

export default Input;
