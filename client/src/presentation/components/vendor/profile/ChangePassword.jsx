import { Input } from "@/components/ui/input";

const ChangePassword = ({ isEditing }) => {
  if (!isEditing) return null;

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Change Password
      </h2>

      <div className="grid gap-4">

        <Input
          type="password"
          placeholder="Current Password"
        />

        <Input
          type="password"
          placeholder="New Password"
        />

        <Input
          type="password"
          placeholder="Confirm New Password"
        />

      </div>

    </div>
  );
};

export default ChangePassword;