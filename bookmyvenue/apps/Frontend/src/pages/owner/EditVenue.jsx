import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loading from "../../components/common/Loading";

import VenueForm from "../../components/venue/form/VenueForm";

import { useAuth } from "../../context/AuthContext";

import {
  getVenueById,
  updateVenue,
} from "../../api/venues";

import { getCategories } from "../../api/categories";

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [venue, setVenue] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] =useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [venueData, categoryData] = await Promise.all([
          getVenueById(id),
          getCategories(),
        ]);

        setVenue({
          ...venueData,
          amenities: venueData.amenities
            ? venueData.amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          image_urls: venueData.image_urls || [],
        });

        setCategories(categoryData);
      } catch (err) {
        console.error(err);
        setError("Unable to load venue.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleUpdate(formData) {
    try {
      setSaving(true);

      await updateVenue(id, formData, token);

      navigate("/owner/dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Unable to update venue."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Loading message="Loading venue..." />
    );
  }

  if (!venue) {
    return (
      <>
        <Header />

        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-lg bg-red-50 p-6 text-red-600">
            Venue not found.
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-6xl px-4 py-10">

          <div className="mb-10">

            <h1 className="text-4xl font-bold">
              Edit Venue
            </h1>

            <p className="mt-2 text-gray-500">
              Update your venue information.
            </p>

          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <VenueForm
            mode="edit"
            initialData={venue}
            categories={categories}
            loading={saving}
            onSubmit={handleUpdate}
          />

        </div>

      </main>

      <Footer />
    </>
  );
}

export default EditVenue;