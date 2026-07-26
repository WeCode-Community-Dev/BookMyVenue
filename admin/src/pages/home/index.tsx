import bmvLogo from "@/assets/bmv-logo.png";

const HomePage = () => {
  return (
    <div className="flex items-center gap-4 p-6">
      <img src={bmvLogo} alt="BookMyVenue" className="h-10 w-auto" />
      <span className="text-2xl font-bold">Admin Dashboard</span>
    </div>
  );
};

export default HomePage;
