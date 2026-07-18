import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loading from "../../components/common/Loading";

import VenueForm from "../../components/venue/form/VenueForm";

import { useAuth } from "../../context/AuthContext";

import { createVenue } from "../../api/venues";
import { getCategories } from "../../api/categories";

function CreateVenue() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data =
          await getCategories();

        setCategories(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load categories."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  async function handleCreate(
    formData
  ) {
    try {
      setSaving(true);

            await createVenue(
        formData,
        token
      );

      navigate(
        "/owner/dashboard",
        { replace: true }
      );
        } catch (err) {
      console.error("Create venue error:", err);

      const message =
        err?.response?.data?.detail ||
        err?.message ||
        JSON.stringify(err);

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Loading message="Loading categories..." />
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-6xl px-4 py-10">

          <div className="mb-10">

            <h1 className="text-4xl font-bold">
              Create Venue
            </h1>

            <p className="mt-2 text-gray-500">
              Fill in the details below to
              publish your venue.
            </p>

          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <VenueForm
            mode="create"
            categories={categories}
            loading={saving}
            onSubmit={handleCreate}
          />

        </div>

      </main>

      <Footer />
    </>
  );
}

export default CreateVenue;