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

function VenueEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    price_per_day: "",
    description: "",
    approval_status: "pending",
    is_active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService
      .getVenue(id)
      .then((v) => {
        setVenue(v);
        setForm({
          name: v.name,
          location: v.location,
          price_per_day: v.price_per_day,
          description: v.description || "",
          approval_status: v.approval_status,
          is_active: v.is_active,
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
      await adminService.updateVenue(id, {
        ...form,
        price_per_day: Number(form.price_per_day),
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
      title="Edit Venue"
      subtitle={venue ? `ID #${venue.id} · Owner: ${venue.owner_name || "—"}` : ""}
      backTo="/admin/venues"
      backLabel="All venues"
      error={error}
    >
      {venue && (
        <div className="flex gap-2 mb-5">
          <StatusBadge status={venue.approval_status} />
          <StatusBadge status={venue.is_active ? "active" : "inactive"} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <FormField label="Description" hint="Optional details shown to customers">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputCls}
            rows={4}
          />
        </FormField>

        <ToggleField
          label="Active on platform"
          hint="Blocked venues are hidden from public listings"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />

        <FormActions saving={saving} cancelTo="/admin/venues" saveLabel="Save venue" />
      </form>
    </AdminFormLayout>
  );
}

export default VenueEditPage;
