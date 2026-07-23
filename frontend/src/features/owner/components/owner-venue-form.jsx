import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { FormikCheckboxField, FormikTextField } from '@/components/form/formik-field';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { paths } from '@/config/paths';
import { EMPTY_AMENITIES, VENUE_AMENITY_OPTIONS, amenitiesFromVenue, toVenueApiPayload } from '@/features/owner/utils/venue-form';
import { getApiErrorMessage } from '@/lib/api';

const venueSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Name is too short').required('Name is required'),
  description: Yup.string().trim(),
  pricePerHour: Yup.number().typeError('Enter a number').min(0, 'Must be 0 or more').required('Price is required'),
  city: Yup.string().trim().required('City is required'),
  district: Yup.string().trim().required('District is required'),
  state: Yup.string().trim().required('State is required'),
  country: Yup.string().trim().required('Country is required'),
  latitude: Yup.number().typeError('Enter a number').min(-90).max(90).required('Latitude is required'),
  longitude: Yup.number().typeError('Enter a number').min(-180).max(180).required('Longitude is required'),
  capacity: Yup.number().typeError('Enter a number').integer().min(1, 'At least 1').required('Capacity is required'),
  amenities: Yup.object({
    parking: Yup.boolean(),
    parkingSize: Yup.number().nullable().typeError('Enter a number').min(0),
    airConditioning: Yup.boolean(),
    petsAllowed: Yup.boolean(),
    outsideFoodAllowed: Yup.boolean(),
    catering: Yup.boolean(),
    cafeteria: Yup.boolean(),
    stage: Yup.boolean(),
    swimmingPool: Yup.boolean(),
    wifi: Yup.boolean(),
  }),
});

function buildInitialValues(venue) {
  if (!venue) {
    return {
      name: '',
      description: '',
      pricePerHour: '',
      city: '',
      district: '',
      state: '',
      country: 'India',
      latitude: '',
      longitude: '',
      capacity: '',
      amenities: { ...EMPTY_AMENITIES, parkingSize: '' },
    };
  }

  return {
    name: venue.name ?? '',
    description: venue.description ?? '',
    pricePerHour: venue.pricePerHour ?? '',
    city: venue.city ?? '',
    district: venue.district ?? '',
    state: venue.state ?? '',
    country: venue.country ?? '',
    latitude: venue.latitude ?? '',
    longitude: venue.longitude ?? '',
    capacity: venue.capacity ?? '',
    amenities: {
      ...amenitiesFromVenue(venue.amenities),
      parkingSize: venue.amenities?.parkingSize ?? '',
    },
  };
}

/**
 * Shared create/edit venue form.
 * Route layer passes `onSave(payload)` so this feature never imports venues-api.
 */
export function OwnerVenueForm({ mode, venue, onSave, isSaving = false }) {
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-brand-text">{isEdit ? 'Edit venue' : 'Add a venue'}</CardTitle>
        <CardDescription>
          {isEdit ? 'Update details customers see when browsing and booking.' : 'List a new space. Price is charged per hour.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          enableReinitialize
          initialValues={buildInitialValues(venue)}
          validationSchema={venueSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await onSave(toVenueApiPayload(values));
              toast.success(isEdit ? 'Venue updated' : 'Venue created');
              navigate(paths.owner.dashboard.path);
            } catch (error) {
              toast.error(getApiErrorMessage(error, isEdit ? 'Could not update venue' : 'Could not create venue'));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-8" noValidate>
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-text">Basics</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormikTextField name="name" label="Venue name" placeholder="Sunset Banquet Hall" className="sm:col-span-2" />
                  <FormikTextField name="description" label="Description" placeholder="Short description for customers" className="sm:col-span-2" />
                  <FormikTextField name="pricePerHour" type="number" label="Price per hour (₹)" placeholder="5000" min="0" step="1" />
                  <FormikTextField name="capacity" type="number" label="Capacity" placeholder="200" min="1" step="1" />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-text">Location</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormikTextField name="city" label="City" placeholder="Bengaluru" />
                  <FormikTextField name="district" label="District" placeholder="Bengaluru Urban" />
                  <FormikTextField name="state" label="State" placeholder="Karnataka" />
                  <FormikTextField name="country" label="Country" placeholder="India" />
                  <FormikTextField name="latitude" type="number" label="Latitude" placeholder="12.9716" step="any" />
                  <FormikTextField name="longitude" type="number" label="Longitude" placeholder="77.5946" step="any" />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-text">Amenities</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {VENUE_AMENITY_OPTIONS.map((option) => (
                    <FormikCheckboxField key={option.name} name={`amenities.${option.name}`} label={option.label} />
                  ))}
                </div>
                {values.amenities.parking ? (
                  <FormikTextField
                    name="amenities.parkingSize"
                    type="number"
                    label="Parking capacity (spots)"
                    placeholder="50"
                    min="0"
                    step="1"
                    className="max-w-xs"
                  />
                ) : null}
              </section>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting || isSaving}>
                  {isSubmitting || isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Create venue'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(paths.owner.dashboard.path)}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
