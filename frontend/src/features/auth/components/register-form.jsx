import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import { useRegisterMutation } from '@/features/auth/api/auth-api';
import { FormikSelectField, FormikTextField } from '@/features/auth/components/formik-field';
import { setCredentials } from '@/features/auth/stores/auth-slice';
import { getApiErrorMessage } from '@/lib/api';

const registerSchema = Yup.object({
  username: Yup.string().trim().required('Username is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  mobileNumber: Yup.string().trim().required('Mobile number is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['CUSTOMER', 'OWNER']).required('Role is required'),
});

export function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        mobileNumber: '',
        password: '',
        role: 'CUSTOMER',
      }}
      validationSchema={registerSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const data = await register(values).unwrap();
          dispatch(setCredentials({ token: data.token, user: data.user }));
          toast.success('Account created!');

          const destination = data.user.role === 'OWNER' ? paths.owner.dashboard.path : paths.home.path;
          navigate(destination, { replace: true });
        } catch (error) {
          toast.error(getApiErrorMessage(error, 'Registration failed'));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4" noValidate>
          <FormikTextField name="username" label="Username" autoComplete="username" placeholder="jane_doe" />
          <FormikTextField name="email" type="email" label="Email" autoComplete="email" placeholder="you@example.com" />
          <FormikTextField name="mobileNumber" type="tel" label="Mobile number" autoComplete="tel" placeholder="9876543210" />
          <FormikTextField name="password" type="password" label="Password" autoComplete="new-password" placeholder="At least 6 characters" />
          <FormikSelectField name="role" label="I am a">
            <option value="CUSTOMER">Customer (book venues)</option>
            <option value="OWNER">Owner (list venues)</option>
          </FormikSelectField>
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Creating account…' : 'Create account'}
          </Button>
          <p className="text-center text-sm text-brand-muted">
            Already have an account?{' '}
            <Link to={paths.auth.login.path} className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
