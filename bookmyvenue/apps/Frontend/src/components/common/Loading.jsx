function Loading({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600">{message}</p>
      )}
    </div>
  );
}

export default Loading;
