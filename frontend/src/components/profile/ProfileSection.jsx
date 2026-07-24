const ProfileSection = ({ title, children, className = "" }) => (
  <section
    className={`rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm ring-1 ring-gray-100/80 sm:p-5 ${className}`}
  >
    <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
    {children}
  </section>
);

export default ProfileSection;
