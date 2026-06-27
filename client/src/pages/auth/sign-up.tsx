import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, type RegisterFormValues } from "@/validator/auth-schema";
import { useRegister } from "@/hooks/use-auth";
import { AUTH_ROUTES } from "@/routes/common/route-path";

const SignUp = () => {
  const navigate = useNavigate();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "CUSTOMER" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register.mutate(values, {
      onSuccess: () => navigate(AUTH_ROUTES.SIGN_IN),
    });
  };

  const serverError = isAxiosError(register.error)
    ? (register.error.response?.data?.message ?? "Sign up failed. Please try again.")
    : null;

  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Create your account
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Sign up to start booking venues
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="gap-6">
                <div className="flex flex-col gap-4">
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="name"
                      className="text-sm text-muted-foreground font-normal">
                      Name*
                    </FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="dark:bg-background h-9 shadow-xs"
                      aria-invalid={!!errors.name}
                      {...registerField("name")}
                    />
                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                  </Field>

                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="email"
                      className="text-sm text-muted-foreground font-normal">
                      Email*
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@bookmyvenue.com"
                      className="dark:bg-background h-9 shadow-xs"
                      aria-invalid={!!errors.email}
                      {...registerField("email")}
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                  </Field>

                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm text-muted-foreground font-normal">
                      Password*
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="dark:bg-background h-9 shadow-xs"
                      aria-invalid={!!errors.password}
                      {...registerField("password")}
                    />
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                  </Field>

                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="role"
                      className="text-sm text-muted-foreground font-normal">
                      I am a*
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="role"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            id="role"
                            className="dark:bg-background h-9 w-full shadow-xs">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CUSTOMER">Customer</SelectItem>
                            <SelectItem value="OWNER">Venue Owner</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && <FieldError>{errors.role.message}</FieldError>}
                  </Field>
                </div>

                {serverError && (
                  <p className="text-sm text-destructive text-center">{serverError}</p>
                )}

                <Field className="gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={register.isPending}
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer">
                    {register.isPending ? "Creating account..." : "Sign up"}
                  </Button>
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to={AUTH_ROUTES.SIGN_IN}
                      className="font-medium text-card-foreground no-underline!">
                      Sign in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignUp;
