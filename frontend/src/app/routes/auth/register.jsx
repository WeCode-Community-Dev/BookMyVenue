import { PageShell } from '@/app/layout/page-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { GuestRoute } from '@/features/auth/components/guest-route';
import { RegisterForm } from '@/features/auth/components/register-form';

export function RegisterRoute() {
  return (
    <GuestRoute>
      <PageShell>
        <div className="mx-auto flex max-w-md justify-center py-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-brand-text">Create your account</CardTitle>
              <CardDescription>Join as a customer to book, or as an owner to list venues.</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </GuestRoute>
  );
}

export default RegisterRoute;
