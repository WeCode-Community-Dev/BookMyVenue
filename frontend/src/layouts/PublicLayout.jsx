import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const PublicLayout = () => {
  return (
    <div className="overflow-x-clip">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;