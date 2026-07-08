import { PageShell } from '@/app/layout/page-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { GuestRoute } from '@/features/auth/components/guest-route';
import { LoginForm } from '@/features/auth/components/login-form';

export function LoginRoute() {
  return (
    <GuestRoute>
      <PageShell>
        <div className="mx-auto flex max-w-md justify-center py-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-brand-text">Welcome back</CardTitle>
              <CardDescription>Log in to book venues or manage your listings.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </GuestRoute>
  );
}

export default LoginRoute;
