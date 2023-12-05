interface ErrorToastProps {
  message: string;
  type: 'error' | 'success';
}

const ErrorToast = ({ message, type }: ErrorToastProps) => {
  return (
    <div
      className={`px-6 py-2 mx-2 my-4 rounded-md text-lg flex items-center mx-auto ${
        type === 'error' ? 'bg-red-200' : 'bg-green-200'
      }`}
    >
      <span
        className={`text-center ${
          type === 'error' ? 'text-red-800' : 'text-green-800'
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default ErrorToast;
