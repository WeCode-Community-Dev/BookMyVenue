import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import ChangePasswordForm from "@/presentation/components/user/ChangePasswordForm";
import PasswordRequirements from "@/presentation/components/user/PasswordRequirements";

const ChangePassword = () => {
  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="bg-white rounded-3xl shadow-md p-8">

            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Change Password
              </h1>

              <p className="text-gray-500 mt-2">
                Update your password to keep your account secure.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2">
                <ChangePasswordForm />
              </div>

              <PasswordRequirements />

            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default ChangePassword;