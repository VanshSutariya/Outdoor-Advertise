interface TextAreaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  value,
  onChange,
  placeholder,
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
      <textarea
        className="appearance-none font-poppins block w-full hover:bg-slate-200 bg-slate-100 border border-gray-100 rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-slate-100 focus:border-gray-100"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
};

export default TextArea;
