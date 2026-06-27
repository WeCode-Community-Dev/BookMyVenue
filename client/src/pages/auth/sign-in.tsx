import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/validator/auth-schema";
import { useLogin } from "@/hooks/use-auth";
import { AUTH_ROUTES, getRoleLandingPath } from "@/routes/common/route-path";

const SignIn = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: (user) => navigate(getRoleLandingPath(user.role)),
    });
  };

  const serverError = isAxiosError(login.error)
    ? (login.error.response?.data?.message ?? "Login failed. Please try again.")
    : null;

  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="max-w-lg px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Welcome to BookMyVenue
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-normal">
                Login to your account now
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="gap-6">
                <div className="flex flex-col gap-4">
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
                      {...register("email")}
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
                      placeholder="Enter your password"
                      className="dark:bg-background h-9 shadow-xs"
                      aria-invalid={!!errors.password}
                      {...register("password")}
                    />
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                  </Field>
                </div>

                {serverError && (
                  <p className="text-sm text-destructive text-center">{serverError}</p>
                )}

                <Field className="gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={login.isPending}
                    className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer">
                    {login.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      to={AUTH_ROUTES.SIGN_UP}
                      className="font-medium text-card-foreground no-underline!">
                      Create an account
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

export default SignIn;
