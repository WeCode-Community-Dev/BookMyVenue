import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { apiErrorMessage } from "@/api/client";
import type { UserRole } from "@/lib/types";

interface AuthFormProps {
  mode: "login" | "signup";
}

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["user", "owner"]).optional(),
});

type FormData = z.infer<typeof schema>;

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (mode === "login") {
        await authApi.login(data.email, data.password);
      } else {
        await authApi.signup({
          email: data.email,
          password: data.password,
          name: data.name ?? "",
          role: (data.role as UserRole) ?? "user",
        });
      }
      // Cookie is set by the backend; fetch the authenticated user.
      return authApi.me();
    },
    onSuccess: (me) => {
      login(me);
      navigate("/");
    },
  });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "login"
            ? "Log in to manage your bookings."
            : "Sign up to discover and book venues."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="flex flex-col gap-4"
      >
        {mode === "signup" && (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {mode === "signup" && (
          <div>
            <Label htmlFor="role">Account type</Label>
            <select
              id="role"
              {...register("role")}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
            >
              <option value="user">I want to book venues</option>
              <option value="owner">I want to list my venue</option>
            </select>
          </div>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-600">{apiErrorMessage(mutation.error)}</p>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Sign up"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link to="/signup" className="text-brand-500 hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-brand-500 hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
