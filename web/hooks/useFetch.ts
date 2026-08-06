"use client";
import { useEffect, useState } from "react";
export const useFetch = <T>(onFetch: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await onFetch();
                setData(data);
            }
            catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);
    return { data, error, isLoading };
}