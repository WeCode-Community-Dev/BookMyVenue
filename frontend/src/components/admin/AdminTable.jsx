const AdminTable = ({ children, className = "" }) => (
  <div
    className={`overflow-hidden rounded-xl border border-gray-200/80 bg-white ring-1 ring-gray-100/80 ${className}`}
  >
    {children}
  </div>
);

export default AdminTable;
