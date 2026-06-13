// src/app/features/owner/services/venueService.ts

import { CreateVenuePayload, Venue } from "../type";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getAuthHeaders(): HeadersInit {
  // Adjust token key to match your auth setup
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchOwnerVenues(): Promise<Venue[]> {
  const res = await fetch(`${BASE_URL}/owner/venues`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch venues");
  return res.json();
}

export async function createVenue(payload: CreateVenuePayload): Promise<Venue> {
  const res = await fetch(`${BASE_URL}/owner/venues`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to create venue");
  }
  return res.json();
}

export async function updateVenue(
  id: string,
  payload: Partial<CreateVenuePayload>
): Promise<Venue> {
  const res = await fetch(`${BASE_URL}/owner/venues/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update venue");
  return res.json();
}

export async function deleteVenue(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/owner/venues/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete venue");
}

export async function toggleVenueStatus(
  id: string,
  status: "active" | "inactive"
): Promise<Venue> {
  const res = await fetch(`${BASE_URL}/owner/venues/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}