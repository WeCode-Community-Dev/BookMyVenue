import { useState } from "react";

export const useForm = <T>(initialData: T, onSubmit: (data: T) => Promise<any>) => {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors(null);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await onSubmit(formData);
            setResult(response);
        } catch (error) {
            setErrors((error as Error).message || "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }
    return { formData, errors, isSubmitting, handleChange, handleSubmit, result };
}