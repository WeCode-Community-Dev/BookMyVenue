const AdminDetailRow = ({ label, value, align = "center" }) => (
  <div
    className={`flex gap-4 ${
      align === "start" ? "items-start" : "items-center"
    } justify-between`}
  >
    <dt className="text-gray-500">{label}</dt>
    <dd className="text-right font-medium text-gray-900">{value}</dd>
  </div>
);

export default AdminDetailRow;
