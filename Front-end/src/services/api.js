const API_BASE_URL = "http://localhost:8080";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const responseData = await response.json();
//   console.log("Backend response:", responseData);

  if (!response.ok) {
    throw new Error(responseData.errors?.[0] || responseData.message || JSON.stringify(responseData));
  }

  return responseData;
};

export const createVenue = async (venueData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/venues`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`   // JWT needed
    },
    body: JSON.stringify(venueData)
  });

  const responseData = await response.json();
  console.log("Create venue response:", responseData);

  if (!response.ok) {
    throw new Error(responseData.errors?.[0] || responseData.message || "Failed to create venue");
  }

  return responseData;
};


export const getAllVenues = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/venues`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.errors?.[0] || responseData.message || "Failed to load venues");
  }
  return responseData;
};

export const getAdminAllVenues = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/requests`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.errors?.[0] || responseData.message || "Failed to load venues");
  }
  return responseData;
};

export const getAllUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.errors?.[0] || responseData.message || "Failed to load venues");
  }
  return responseData;
};

export const approveRequest = async (token, venueId, remarks) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/requests/${venueId}/approve?remarks=${encodeURIComponent(remarks)}`,
    {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.errors?.[0] || responseData.message || "Approve failed");
  }
  return responseData;
};