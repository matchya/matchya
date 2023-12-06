interface ButtonProps {
  text: string;
  color?: string;
  border?: boolean;
  hover?: boolean;
  outline?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e?: React.MouseEvent) => void;
}

const Button = ({
  text = 'Click',
  color = 'green',
  border = true,
  hover = true,
  outline = true,
  className = '',
  type = 'button',
  onClick = () => {},
}: ButtonProps) => {
  if (!outline) {
    return (
      <DefaultButton
        text={text}
        color={color}
        className={className}
        onClick={onClick}
      />
    );
  }

  return (
    <button
      type={type}
      className={`text-${color}-700
                ${
                  border
                    ? `border border-${color}-700 dark:focus:ring-${color}-800 dark:border-${color}-500 focus:ring-${color}-300`
                    : ``
                }
                ${
                  hover
                    ? `hover:text-gray-300 hover:bg-${color}-800 dark:hover:gray-300 dark:hover:bg-${color}-600`
                    : `hover:text-black`
                }
                focus:outline-none
                font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
                dark:text-${color}-500
                ${className}`}
      onClick={onClick ? e => onClick(e) : () => {}}
    >
      {text}
    </button>
  );
};

export default Button;

const DefaultButton = ({ text, color, className, onClick }: ButtonProps) => {
  return (
    <button
      className={`focus:outline-none text-white bg-${color}-500
                hover:bg-${color}-600  font-medium
                rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};


const Loading = () => {
  return (
    <button className="">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
      </div>
    </button>
  );
}

export { Loading };