import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../modules/admin/services/adminService";
import {
  AdminFormLayout,
  AdminLoading,
  FormActions,
  FormField,
  ToggleField,
  inputCls,
} from "../../components/admin/AdminForm";
import { StatusBadge } from "../../components/admin/AdminCard";

function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "user",
    password: "",
    is_active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService
      .getUser(id)
      .then((user) => {
        setUserRole(user.role);
        setForm({
          name: user.name || "",
          email: user.email,
          phone_number: user.phone_number || "",
          role: user.role === "host" ? "host" : "user",
          password: "",
          is_active: user.is_active,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        role: form.role,
        is_active: form.is_active,
      };
      if (form.password) payload.password = form.password;
      await adminService.updateUser(id, payload);
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  if (userRole === "admin") {
    return (
      <AdminFormLayout title="Edit User" backTo="/admin/users" backLabel="All users">
        <p className="text-rose-600 text-sm">Admin accounts cannot be edited here.</p>
        <Link to="/admin/users" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
          Back to users
        </Link>
      </AdminFormLayout>
    );
  }

  return (
    <AdminFormLayout
      title="Edit User"
      subtitle={`Account #${id}`}
      backTo="/admin/users"
      backLabel="All users"
      error={error}
    >
      <div className="flex gap-2 mb-5">
        <StatusBadge status={form.role} />
        <StatusBadge status={form.is_active ? "active" : "inactive"} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Full name">
            <input name="name" value={form.name} onChange={handleChange} className={inputCls} required />
          </FormField>
          <FormField label="Phone number">
            <input name="phone_number" value={form.phone_number} onChange={handleChange} className={inputCls} />
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
          <FormField label="Role">
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              <option value="user">User</option>
              <option value="host">Host</option>
            </select>
          </FormField>
          <FormField label="New password" hint="Leave blank to keep current password">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={inputCls}
              minLength={8}
              placeholder="••••••••"
            />
          </FormField>
        </div>

        <ToggleField
          label="Active account"
          hint="Deactivated users cannot log in"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />

        <FormActions saving={saving} cancelTo="/admin/users" saveLabel="Save user" />
      </form>
    </AdminFormLayout>
  );
}

export default UserEditPage;
