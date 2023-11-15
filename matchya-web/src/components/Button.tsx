interface Props {
    text: string;
    color?: string;
    border?: boolean;
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

const Button = ({ text, color, border = true, hover = true, className, onClick }: Props) => {
    return (
        <button 
            className={
                `text-${color}-700 
                ${border ? `border border-${color}-700 dark:focus:ring-${color}-800 dark:border-${color}-500 focus:ring-${color}-300` : ``}
                ${hover ? `hover:text-white hover:bg-${color}-800 dark:hover:text-white dark:hover:bg-${color}-600` : `hover:text-black`}
                focus:outline-none
                font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 
                dark:text-${color}-500   
                ${className}`
            }
            onClick={onClick}>
            {text}
        </button>
    );
}

export default Button;