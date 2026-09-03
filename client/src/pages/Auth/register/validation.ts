import * as Yup from 'yup';

export const signupSchema = Yup.object({
  name: Yup.string().required('Full name is required'),

  email: Yup.string().email('Enter a valid email address').required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^\w]/, 'Password must contain at least one special symbol'),

  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match'),
});
