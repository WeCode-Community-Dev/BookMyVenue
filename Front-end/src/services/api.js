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