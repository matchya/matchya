interface FormInputProps {
  label?: string;
  placeholder?: string;
  id: string;
  type: string;
  className?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  label,
  placeholder,
  id,
  type,
  className,
  value,
  onChange,
}: FormInputProps) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}:
        </label>
      )}
      <input
        type={type}
        autoFocus
        id={id}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-300 focus:border-lime-300"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
