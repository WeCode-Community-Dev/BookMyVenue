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
    business_name: "",
    business_address: "",
    business_type: "",
    business_phone: "",
    business_email: "",
    gst_number: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isHost = form.role === "host";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        password: form.password,
        role: form.role,
      };
      if (isHost) {
        payload.business_name = form.business_name || form.name;
        payload.business_address = form.business_address || "Address pending";
        payload.business_type = form.business_type || null;
        payload.business_phone = form.business_phone || form.phone_number;
        payload.business_email = form.business_email || form.email;
        payload.gst_number = form.gst_number || null;
      }
      await adminService.createUser(payload);
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormLayout
      title="Create Account"
      subtitle="Register a customer or venue owner (host)"
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
          <FormField label="Role" hint="Host creates an owner account with business profile">
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              <option value="user">User (customer)</option>
              <option value="host">Host (venue owner)</option>
            </select>
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
                  placeholder={form.name || "Business name"}
                />
              </FormField>
              <FormField label="Business type">
                <input
                  name="business_type"
                  value={form.business_type}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="e.g. Banquet hall"
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

        <FormActions saving={saving} cancelTo="/admin/users" saveLabel="Create account" />
      </form>
    </AdminFormLayout>
  );
}

export default UserCreatePage;
