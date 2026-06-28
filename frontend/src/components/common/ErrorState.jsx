const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="text-lg font-medium text-red-900">
        Something went wrong
      </p>

      <p className="mt-2 text-red-700">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
