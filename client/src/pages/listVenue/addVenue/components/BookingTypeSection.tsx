import { Field, ErrorMessage } from 'formik';
import { FORM_ERROR_CLASS } from '@/constants/uiClasses';
import { DAYS_OF_WEEK } from '@/constants/common';

const err = FORM_ERROR_CLASS;

export function BookingTypeSection() {
  return (
    <>
      {/* Booking Type */}
      <div>
        <label className="block mb-4 font-bold text-[var(--text-primary)]">Booking Type</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
            <Field type="radio" name="bookingType" value="fixedBooking" />
            Fixed Package
          </label>
          <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
            <Field type="radio" name="bookingType" value="flexibleBooking" />
            Flexible Time Slots
          </label>
        </div>
        <ErrorMessage name="bookingType" component="p" className={err} />
      </div>

      {/* Working Days */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Working Days</h3>
        <div className="flex flex-wrap gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day}
              className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer"
            >
              <Field type="checkbox" name="workingDays" value={day} />
              {day}
            </label>
          ))}
        </div>
        <ErrorMessage name="workingDays" component="p" className={err} />
      </div>
    </>
  );
}
