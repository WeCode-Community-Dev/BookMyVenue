import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import { useLoginMutation } from '@/features/auth/api/auth-api';
import { FormikTextField } from '@/features/auth/components/formik-field';
import { setCredentials } from '@/features/auth/stores/auth-slice';
import { getApiErrorMessage } from '@/lib/api';

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const from = location.state?.from?.pathname;

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const data = await login(values).unwrap();
          dispatch(setCredentials({ token: data.token, user: data.user }));
          toast.success('Welcome back!');

          const destination = from || (data.user.role === 'OWNER' ? paths.owner.dashboard.path : paths.home.path);
          navigate(destination, { replace: true });
        } catch (error) {
          toast.error(getApiErrorMessage(error, 'Login failed'));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4" noValidate>
          <FormikTextField name="email" type="email" label="Email" autoComplete="email" placeholder="you@example.com" />
          <FormikTextField name="password" type="password" label="Password" autoComplete="current-password" placeholder="••••••••" />
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Logging in…' : 'Log in'}
          </Button>
          <p className="text-center text-sm text-brand-muted">
            No account?{' '}
            <Link to={paths.auth.register.path} className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
