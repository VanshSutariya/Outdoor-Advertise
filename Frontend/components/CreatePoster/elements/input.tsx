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
        className="block uppercase tracking-wide font-sans text-white text-sm font-bold mb-2"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <input
        className="appearance-none block w-full bg-gray-700 text-white border border-gray-700 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-700"
        id={props.name}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onWheel={(e) => e.target.blur()}
      />
    </>
  );
};

export default Input;
