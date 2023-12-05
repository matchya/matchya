const ErrorToast = ({ message }: { message: string }) => {
  return (
    <div className="bg-red-200 px-6 py-2 mx-2 my-4 rounded-md text-lg flex items-center mx-auto">
      <span className="text-red-800 text-center">{message}</span>
    </div>
  );
};

export default ErrorToast;
