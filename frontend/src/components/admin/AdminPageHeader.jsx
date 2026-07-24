const AdminPageHeader = ({ title, description, children }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.65rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
    {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
  </div>
);

export default AdminPageHeader;
