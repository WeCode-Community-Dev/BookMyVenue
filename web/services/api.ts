const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const  apiFetch = async (url: string, options: RequestInit) => {

    try {
        const response = await fetch(`${API_URL}${url}`, options);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}