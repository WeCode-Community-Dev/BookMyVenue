const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;