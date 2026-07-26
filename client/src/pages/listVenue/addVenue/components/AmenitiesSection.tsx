import { Field, ErrorMessage } from 'formik';
import { AMENITIES_LIST } from '@/constants/venueConstants';
import { FORM_ERROR_CLASS } from '@/constants/uiClasses';

const err = FORM_ERROR_CLASS;

export function AmenitiesSection() {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Amenities</h3>
      <div className="flex flex-wrap gap-3">
        {AMENITIES_LIST.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer"
          >
            <Field type="checkbox" name="amenities" value={item} />
            {item}
          </label>
        ))}
      </div>
      <ErrorMessage name="amenities" component="p" className={err} />
    </div>
  );
}
