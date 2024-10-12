interface InputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input: React.FC<InputProps> = (props) => {
  return (
    <>
      <input
        type="text"
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        className="items-center  focus:outline-none bg-transparent border-none pt-2"
      />
    </>
  );
};

export default Input;
