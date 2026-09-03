import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router';
import { HiOutlineMail } from 'react-icons/hi';
import AuthLayout from '@/layout/AuthLayout';
import { forgotPasswordSchema } from './validation';
import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';
import { useToast } from '@/hooks/useToast';
import type { FormikHelpers } from 'formik';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthSubmitButton } from '@/components/auth/AuthSubmitButton';

const ForgotPasswordPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: { email: string },
    { resetForm }: FormikHelpers<{ email: string }>
  ) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email: values.email,
      });

      toast.success(response.data?.message || 'If an account exists, a reset link has been sent.');

      resetForm();
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to request reset link. Please try again.';

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries. Enter your email address and we'll send you a secure password reset link."
      footer={
        <>
          Remember your password?
          <Link
            to="/login"
            className="ml-2 font-semibold text-[var(--text-primary)] hover:underline"
          >
            Sign In
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-6">
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            disabled={loading}
            icon={<HiOutlineMail />}
          />

          <AuthSubmitButton
            isSubmitting={loading}
            text="Send Reset Link"
            loadingText="Sending Reset Link..."
          />
        </Form>
      </Formik>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
