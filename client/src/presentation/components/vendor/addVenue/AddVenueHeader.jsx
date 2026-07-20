const AddVenueHeader = ({
  title = "Add New Venue",
  subtitle = "Fill in the details to list your venue",
}) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-slate-500 mt-2">{subtitle}</p>
    <hr className="mt-4 border-slate-200" />
  </div>
);

export default AddVenueHeader;
