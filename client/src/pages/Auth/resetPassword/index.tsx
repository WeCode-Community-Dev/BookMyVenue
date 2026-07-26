import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate, useSearchParams } from 'react-router';
import AuthLayout from '@/layout/AuthLayout';
import { resetPasswordSchema } from './validation';
import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/toast';
import type { FormikHelpers } from 'formik';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';

interface ResetFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Reset token is missing from the URL. Please request a new password reset link.');
    }
  }, [token, toast]);

  const handleSubmit = async (
    values: ResetFormValues,
    { resetForm }: FormikHelpers<ResetFormValues>
  ) => {
    if (!token) {
      toast.error('Cannot reset password without a valid token.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        password: values.password,
      });

      toast.success(response.data?.message || 'Password reset successful!');

      resetForm();

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      toast.error(
        extractErrorMessage(error) || 'Failed to reset password. Please request a new link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password 🔐"
      subtitle="Create a strong password to secure your account."
      footer={
        <div className="flex flex-col gap-2">
          <div>
            Remembered your password?
            <Link
              to="/login"
              className="ml-2 font-semibold text-[var(--text-primary)] hover:underline"
            >
              Sign In
            </Link>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]/80">
            Note: If you choose to log in using your existing password, this reset token will be
            immediately invalidated. As a best practice, changing your password frequently helps
            maintain account security. But don't forget it too!
          </p>
        </div>
      }
    >
      {!token && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <h3 className="font-semibold text-red-700 dark:text-red-400">Invalid Reset Link</h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            Your password reset link is missing or has expired. Please request a new password reset
            email.
          </p>
        </div>
      )}

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-6">
            <PasswordInput
              id="password"
              name="password"
              label="New Password"
              placeholder="Enter new password"
              withHint
              value={values.password}
              disabled={loading || !token}
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              disabled={loading || !token}
            />

            <AuthSubmitButton
              isSubmitting={loading}
              disabled={!token}
              text="Reset Password"
              loadingText="Resetting Password..."
            />
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
