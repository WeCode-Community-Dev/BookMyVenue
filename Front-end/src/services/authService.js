const API_BASE_URL = "http://localhost:8080";

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.errors?.[0] ||
      "Login failed"
    );
  }

  return data;
};