const EmptyState = ({ title, description }) => {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-8 py-20 text-center">
      <p className="text-lg font-semibold tracking-tight text-gray-900">
        {title}
      </p>
      {description && (
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
