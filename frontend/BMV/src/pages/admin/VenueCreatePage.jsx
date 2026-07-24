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
  const [venueTypes, setVenueTypes] = useState([]);
  const [form, setForm] = useState({
    owner_id: "",
    name: "",
    location: "",
    price_per_day: "",
    venue_type_id: "",
    capacity: "",
    image_url: "",
    google_maps_url: "",
    google_review_url: "",
    description: "",
    approval_status: "pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      adminService.getUsers({ role: "host", limit: 100 }),
      adminService.getVenueTypes(),
    ])
      .then(([ownerList, types]) => {
        setOwners(ownerList);
        setVenueTypes(types);
        if (types?.length) {
          setForm((prev) => ({ ...prev, venue_type_id: String(types[0].id) }));
        }
      })
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
        venue_type_id: Number(form.venue_type_id),
        capacity: form.capacity ? Number(form.capacity) : null,
        image_url: form.image_url || null,
        google_maps_url: form.google_maps_url || null,
        google_review_url: form.google_review_url || null,
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
        <FormField label="Owner (host)" hint="Only host/owner accounts can own venues">
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
          <FormField label="Venue type">
            <select
              name="venue_type_id"
              value={form.venue_type_id}
              onChange={handleChange}
              className={inputCls}
              required
            >
              <option value="">Select type</option>
              {venueTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Capacity">
            <input
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              className={inputCls}
              placeholder="Optional"
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

        <FormField label="Image URL">
          <input name="image_url" value={form.image_url} onChange={handleChange} className={inputCls} />
        </FormField>

        <FormField label="Google Maps URL">
          <input name="google_maps_url" value={form.google_maps_url} onChange={handleChange} className={inputCls} />
        </FormField>

        <FormField label="Google Review URL">
          <input
            name="google_review_url"
            value={form.google_review_url}
            onChange={handleChange}
            className={inputCls}
            placeholder="https://g.page/r/.../review"
          />
        </FormField>

        <FormField label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} className={inputCls} rows={4} />
        </FormField>

        <FormActions saving={saving} cancelTo="/admin/venues" saveLabel="Create venue" />
      </form>
    </AdminFormLayout>
  );
}

export default VenueCreatePage;