import { Formik, Form } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router';
import { HiOutlineUser, HiOutlineMail } from 'react-icons/hi';
import AuthLayout from '@/layout/AuthLayout';
import { signupSchema } from './validation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/toast';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';

const RegisterPage = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');

  const loginLink = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : '/login';

  return (
    <AuthLayout
      title="Create Account ✨"
      subtitle="Join thousands of people discovering the perfect venue for every occasion."
      footer={
        <>
          Already have an account?
          <Link
            to={loginLink}
            className="ml-2 font-semibold text-[var(--text-primary)] hover:underline"
          >
            Sign In
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={signupSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await register(values.name, values.email, values.password);

            toast.success('Account created successfully! Redirecting to login...');

            resetForm();

            setTimeout(() => {
              navigate(loginLink);
            }, 2000);
          } catch (err: unknown) {
            toast.error(extractErrorMessage(err) || 'Registration failed. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <AuthInput
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                icon={<HiOutlineUser />}
              />

              <AuthInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="john@example.com"
                icon={<HiOutlineMail />}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                placeholder="Create password"
                withHint
                value={values.password}
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm password"
              />
            </div>

            <AuthSubmitButton
              isSubmitting={isSubmitting}
              text="Create Account"
              loadingText="Creating Account..."
            />
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default RegisterPage;
