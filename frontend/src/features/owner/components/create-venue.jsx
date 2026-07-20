import { Formik } from 'formik';
import React, {useEffect} from 'react';
import './create-veneue-style.css';
import * as Yup from 'yup';
import { useCreateVenueMutation } from '@/features/venues/api/venues-api';
import { toast } from 'sonner';

const createVenueSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Minimum 3 characters').max(50, 'Minimum 50 characters').required('Required'),
  email: Yup.string().email().required('Required'),
  pricePerHour: Yup.number().required().positive().integer(),
});

const CreateVenue = () => {
  const [createVenue, { isFetching, error, result ,isLoading}] = useCreateVenueMutation();
  console.log('error', error);
  console.log('isFetching', isFetching);
  console.log('data', result);

  useEffect(() => {
    if(error){
      toast.error(error.message)
    }
  }, [isFetching,isLoading,error,result])
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          city: '',
          description: '',
          pricePerHour: '',
          district: '',
          state: '',
          latitude: '',
          longitude: '',
          country: '',
          capacity: '',
          amenities: {},
        }}
        validationSchema={createVenueSchema}
        onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            const data = createVenue(JSON.stringify(values, null, 2)).unwrap();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
          /* and other goodies */
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className="form-container mx-auto flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-4">
                <div className="form-inner-wrapper border-2">
                  <div className="grid min-w-max grid-cols-2 items-center justify-center gap-2 overflow-y-auto rounded-md p-4">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <div className="form-control-container">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />
                        <div className={`${errors.name && touched.name && 'is-invalid'}`}>{errors.name && touched.name && errors.name}</div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <div className="form-control-container">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          id="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                        <div className={`${errors.email && touched.email && 'is-invalid'}`}>{errors.email && touched.email && errors.email}</div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <div className="form-control-container">
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          id="city"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.city}
                        />
                        <div className={`${errors.city && touched.city && 'is-invalid'}`}>
                          {errors.city && touched.city && errors.city}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <div className="form-control-container">
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          id="description"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.description}
                        />
                        <div className={`${errors.description && touched.description && 'is-invalid'}`}>
                          {errors.description && touched.description && errors.description}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="pricePerHour">Price Per Hour</label>
                      <div className="form-control-container">
                        <input
                          type="number"
                          className="form-control"
                          name="pricePerHour"
                          id="pricePerHour"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.pricePerHour}
                        />
                        <div className={`${errors.pricePerHour && touched.pricePerHour && 'is-invalid'}`}>
                          {errors.pricePerHour && touched.pricePerHour && errors.pricePerHour}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="district">District</label>
                      <div className="form-control-container">
                        <label htmlFor="district">District</label>
                        <input
                          type="text"
                          className="form-control"
                          name="district"
                          id="district"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.district}
                        />
                        <div className={`${errors.district && touched.district && 'is-invalid'}`}>
                          {errors.district && touched.district && errors.district}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <div className="form-control-container">
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          id="state"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.state}
                        />
                        <div className={`${errors.state && touched.state && 'is-invalid'}`}>{errors.state && touched.state && errors.state}</div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="latitude">Latitude</label>
                      <div className="form-control-container">
                        <input
                          type="number"
                          className="form-control"
                          name="latitude"
                          id="latitude"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.latitude}
                        />
                        <div className={`${errors.latitude && touched.latitude && 'is-invalid'}`}>
                          {errors.latitude && touched.latitude && errors.latitude}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="longitude">Longitude</label>
                      <div className="form-control-container">
                        <input
                          type="number"
                          className="form-control"
                          name="longitude"
                          id="longitude"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.longitude}
                        />
                        <div className={`${errors.longitude && touched.longitude && 'is-invalid'}`}>
                          {errors.longitude && touched.longitude && errors.longitude}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <div className="form-control-container">
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          id="country"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.country}
                        />
                        <div className={`${errors.country && touched.country && 'is-invalid'}`}>
                          {errors.country && touched.country && errors.country}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="capacity">Capacity</label>
                      <div className="form-control-container">
                        <input
                          type="number"
                          className="form-control"
                          name="capacity"
                          id="capacity"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.capacity}
                        />
                        <div className={`${errors.capacity && touched.capacity && 'is-invalid'}`}>
                          {errors.capacity && touched.capacity && errors.capacity}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="amenities">Amenities</label>
                      <div className="form-control-container">
                        <select name="amenities" id="amenities" onChange={handleChange} onBlur={handleBlur} value={values.amenities}>
                          <option defaultValue={''} aria-placeholder="pick an option">
                            pick an option
                          </option>
                        </select>
                        <div className={`${errors.amenities && touched.amenities && 'is-invalid'}`}>
                          {errors.amenities && touched.amenities && errors.amenities}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="submit-button flex items-center justify-center p-4">
                    <button type="submit" className="rounded-sm bg-blue-200 p-3 px-5">
                      {(isFetching || isLoading) ? '...Processing' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateVenue;
