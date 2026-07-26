import * as Yup from 'yup';

export const basicInfoSchema = Yup.object({
  VenueName: Yup.string()
    .trim()
    .required('Venue name is required')
    .min(3, 'Minimum 3 characters')
    .max(100, 'Maximum 100 characters'),

  VenueDescription: Yup.string()
    .trim()
    .required('Description is required')
    .min(10, 'Minimum 10 characters'),

  venueType: Yup.string().required('Venue type is required'),

  district: Yup.string().required('District is required'),

  city: Yup.string().required('City / Place is required'),

  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Invalid pincode')
    .required('Pincode is required'),

  fullAddress: Yup.string().required('Address is required').min(5, 'Minimum 5 characters'),

  googleMapsLink: Yup.string().url('Invalid Google Maps URL').nullable().optional(),

  spaceAttributes: Yup.array().min(1, 'Select at least one'),

  seatingConfigurations: Yup.array(),

  maxCapacity: Yup.number().typeError('Must be a number').positive('Must be positive').optional(),
});
