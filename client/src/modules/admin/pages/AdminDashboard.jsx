import MainLayout from "../../common/MainLayout";
import AdminVenuesPage from "./AdminVenuesPage";

const AdminDashboard = () => {
   return (
      <MainLayout>

         <div className="max-w-7xl mx-auto px-5 py-10 mt-20">

            <h1 className="text-3xl font-bold mb-8">
               Admin Dashboard
            </h1>

            <AdminVenuesPage />

         </div>

      </MainLayout>
   );
};

export default AdminDashboard;