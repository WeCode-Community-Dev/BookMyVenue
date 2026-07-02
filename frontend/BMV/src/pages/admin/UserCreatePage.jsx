import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../modules/admin/services/adminService";
import {
  AdminFormLayout,
  FormActions,
  FormField,
  inputCls,
} from "../../components/admin/AdminForm";

function UserCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminService.createUser(form);
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormLayout
      title="Create User"
      subtitle="Register a new platform account"
      backTo="/admin/users"
      backLabel="All users"
      error={error}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Full name">
            <input name="name" value={form.name} onChange={handleChange} className={inputCls} required />
          </FormField>
          <FormField label="Phone number">
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </FormField>
        </div>

        <FormField label="Email address">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputCls}
            required
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Password" hint="Minimum 8 characters">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={inputCls}
              minLength={8}
              required
            />
          </FormField>
          <FormField label="Role">
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              <option value="user">User</option>
              <option value="host">Host</option>
            </select>
          </FormField>
        </div>

        <FormActions saving={saving} cancelTo="/admin/users" saveLabel="Create user" />
      </form>
    </AdminFormLayout>
  );
}

export default UserCreatePage;
