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

function toHostRole(role, isVenueOwner) {
  if (role === "host" || role === "owner" || isVenueOwner) return "host";
  return "user";
}

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
    business_name: "",
    business_address: "",
    business_type: "",
    business_phone: "",
    business_email: "",
    gst_number: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isHost = form.role === "host";

  useEffect(() => {
    adminService
      .getUser(id)
      .then((user) => {
        setUserRole(user.role);
        setForm({
          name: user.name || "",
          email: user.email,
          phone_number: user.phone_number || "",
          role: toHostRole(user.role, user.is_venue_owner),
          password: "",
          is_active: user.is_active,
          business_name: user.business_name || "",
          business_address: user.business_address || "",
          business_type: user.business_type || "",
          business_phone: user.business_phone || "",
          business_email: user.business_email || "",
          gst_number: user.gst_number || "",
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
      if (isHost) {
        payload.business_name = form.business_name || form.name;
        payload.business_address = form.business_address || "Address pending";
        payload.business_type = form.business_type || null;
        payload.business_phone = form.business_phone || form.phone_number;
        payload.business_email = form.business_email || form.email;
        payload.gst_number = form.gst_number || null;
      }
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
      title="Edit Account"
      subtitle={`Account #${id}`}
      backTo="/admin/users"
      backLabel="All users"
      error={error}
    >
      <div className="flex gap-2 mb-5">
        <StatusBadge status={form.role === "host" ? "host" : form.role} />
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
              <option value="user">User (customer)</option>
              <option value="host">Host (venue owner)</option>
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

        {isHost && (
          <div className="space-y-5 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-700">Owner business profile</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Business name">
                <input
                  name="business_name"
                  value={form.business_name}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
              <FormField label="Business type">
                <input
                  name="business_type"
                  value={form.business_type}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
            </div>
            <FormField label="Business address">
              <input
                name="business_address"
                value={form.business_address}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Business phone">
                <input
                  name="business_phone"
                  value={form.business_phone}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
              <FormField label="Business email">
                <input
                  name="business_email"
                  type="email"
                  value={form.business_email}
                  onChange={handleChange}
                  className={inputCls}
                />
              </FormField>
            </div>
            <FormField label="GST number">
              <input name="gst_number" value={form.gst_number} onChange={handleChange} className={inputCls} />
            </FormField>
          </div>
        )}

        <ToggleField
          label="Active account"
          hint="Deactivated users cannot log in"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />

        <FormActions saving={saving} cancelTo="/admin/users" saveLabel="Save account" />
      </form>
    </AdminFormLayout>
  );
}

export default UserEditPage;
