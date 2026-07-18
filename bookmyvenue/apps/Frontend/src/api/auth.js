import api from "./axios";

/**
 * Register a new user
 */
export async function registerUser(userData) {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
}

/**
 * Login using FastAPI OAuth2PasswordRequestForm
 */
export async function loginUser(email, password) {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post(
        "/api/auth/login",
        formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
}