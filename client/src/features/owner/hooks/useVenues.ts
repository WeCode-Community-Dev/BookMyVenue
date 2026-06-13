// src/app/features/owner/hooks/useVenues.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { Venue, CreateVenuePayload, VenueStats } from "../type";
import {
  fetchOwnerVenues,
  createVenue,
  deleteVenue,
  toggleVenueStatus,
} from "../services/venueService";

export function useVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOwnerVenues();
      setVenues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addVenue = useCallback(async (payload: CreateVenuePayload) => {
    setSubmitting(true);
    try {
      const created = await createVenue(payload);
      setVenues((prev) => [created, ...prev]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create venue",
      };
    } finally {
      setSubmitting(false);
    }
  }, []);

  const removeVenue = useCallback(async (id: string) => {
    try {
      await deleteVenue(id);
      setVenues((prev) => prev.filter((v) => v.id !== id));
      return { success: true };
    } catch {
      return { success: false, error: "Failed to delete venue" };
    }
  }, []);

  const toggleStatus = useCallback(
    async (id: string, current: "active" | "inactive") => {
      const next = current === "active" ? "inactive" : "active";
      try {
        const updated = await toggleVenueStatus(id, next);
        setVenues((prev) => prev.map((v) => (v.id === id ? updated : v)));
        return { success: true };
      } catch {
        return { success: false, error: "Failed to update status" };
      }
    },
    []
  );

  const stats: VenueStats = {
    total: venues.length,
    active: venues.filter((v) => v.status === "active").length,
    pending: venues.filter((v) => v.status === "pending").length,
    inactive: venues.filter((v) => v.status === "inactive").length,
  };

  return {
    venues,
    loading,
    error,
    submitting,
    stats,
    refresh: load,
    addVenue,
    removeVenue,
    toggleStatus,
  };
}