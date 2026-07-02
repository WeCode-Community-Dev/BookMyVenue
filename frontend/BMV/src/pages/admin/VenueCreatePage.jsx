import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../modules/admin/services/adminService";
import {
  AdminFormLayout,
  AdminLoading,
  FormActions,
  FormField,
  inputCls,
} from "../../components/admin/AdminForm";

function VenueCreatePage() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    owner_id: "",
    name: "",
    location: "",
    price_per_day: "",
    description: "",
    approval_status: "pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService
      .getUsers({ role: "host" })
      .then(setOwners)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminService.createVenue({
        owner_id: Number(form.owner_id),
        name: form.name,
        location: form.location,
        price_per_day: Number(form.price_per_day),
        description: form.description || null,
        approval_status: form.approval_status,
      });
      navigate("/admin/venues");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <AdminFormLayout
      title="Create Venue"
      subtitle="Add a new venue and assign a host owner"
      backTo="/admin/venues"
      backLabel="All venues"
      error={error}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Owner (host)" hint="Only host accounts can own venues">
          <select name="owner_id" value={form.owner_id} onChange={handleChange} className={inputCls} required>
            <option value="">Select owner</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name || o.email} ({o.email})
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Venue name">
            <input name="name" value={form.name} onChange={handleChange} className={inputCls} required />
          </FormField>
          <FormField label="Location">
            <input name="location" value={form.location} onChange={handleChange} className={inputCls} required />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Price per day (INR)">
            <input
              name="price_per_day"
              type="number"
              min="0"
              value={form.price_per_day}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </FormField>
          <FormField label="Approval status">
            <select name="approval_status" value={form.approval_status} onChange={handleChange} className={inputCls}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </FormField>
        </div>

        <FormField label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} className={inputCls} rows={4} />
        </FormField>

        <FormActions saving={saving} cancelTo="/admin/venues" saveLabel="Create venue" />
      </form>
    </AdminFormLayout>
  );
}

export default VenueCreatePage;
