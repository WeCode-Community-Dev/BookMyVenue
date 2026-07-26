import { Formik, Form } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router';
import { HiOutlineMail } from 'react-icons/hi';
import AuthLayout from '@/layout/AuthLayout';
import { signinSchema } from './validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/toast';
import { getSafeRedirectUrl } from '@/utils/redirect';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');

  const registerLink = redirectParam
    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
    : '/register';

  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Sign in to continue discovering amazing venues for your next celebration."
      footer={
        <>
          Don't have an account?
          <Link
            to={registerLink}
            className="ml-2 font-semibold text-[var(--text-primary)] hover:underline"
          >
            Create Account
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={signinSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login(values.email, values.password);

            toast.success("Welcome back! You're now signed in.");

            const localRedirect = localStorage.getItem('redirectUrl');

            let finalRedirect = '/';

            if (redirectParam && localRedirect && redirectParam === localRedirect) {
              finalRedirect = getSafeRedirectUrl(redirectParam);
            } else if (redirectParam) {
              finalRedirect = getSafeRedirectUrl(redirectParam);
            } else if (localRedirect) {
              finalRedirect = getSafeRedirectUrl(localRedirect);
            }

            try {
              localStorage.removeItem('redirectUrl');
            } catch {
              // Ignore localStorage errors
            }

            navigate(finalRedirect);
          } catch (err: unknown) {
            toast.error(extractErrorMessage(err) || 'Invalid email or password');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <AuthInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="john@example.com"
              icon={<HiOutlineMail />}
            />

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              showForgotPassword
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--bg-grey)] text-[var(--text-primary)] focus:ring-[var(--text-primary)]"
                />
                Remember me
              </label>
            </div>

            <AuthSubmitButton
              isSubmitting={isSubmitting}
              text="Sign In"
              loadingText="Signing In..."
            />
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default LoginPage;
