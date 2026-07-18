import api from "./axios";

export async function getCategories() {
    const response = await api.get("/api/categories");

    return response.data;
}