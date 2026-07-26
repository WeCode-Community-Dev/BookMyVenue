import { Field, FieldArray, ErrorMessage } from 'formik';
import { FORM_ERROR_CLASS, FORM_INPUT_CLASS } from '@/constants/uiClasses';
import { PRICING_TYPES } from '@/constants/venueConstants';

const err = FORM_ERROR_CLASS;
const inputCls = FORM_INPUT_CLASS;

interface FlexibleBookingSectionProps {
  openTime?: string;
  closeTime?: string;
  pricingType: string;
  pricingRules: { fromTime: string; toTime: string; price: string }[];
  blockedTimes: { fromTime: string; toTime: string }[];
}

export function FlexibleBookingSection({
  openTime,
  closeTime,
  pricingType,
  pricingRules,
  blockedTimes,
}: FlexibleBookingSectionProps) {
  return (
    <div className="space-y-8">
      {/* Working Hours */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-bold">Open Time</label>
            <Field name="workingHours.open" type="time" className={inputCls} />
            <ErrorMessage name="workingHours.open" component="p" className={err} />
          </div>
          <div>
            <label className="block mb-2 font-bold">Close Time</label>
            <Field
              name="workingHours.close"
              type="time"
              {...(openTime ? { min: openTime } : {})}
              className={inputCls}
            />
            <ErrorMessage name="workingHours.close" component="p" className={err} />
          </div>
        </div>
        {openTime && closeTime && (
          <p className="text-[var(--text-secondary)] text-sm mt-2">
            ⏱ All time-based fields below are restricted to{' '}
            <strong>
              {openTime} – {closeTime}
            </strong>
          </p>
        )}
      </div>

      {/* Slot Duration & Buffer Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-bold">Slot Duration</label>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Minimum booking duration for each slot.
          </p>
          <Field as="select" name="slotDuration" className={inputCls}>
            <option value="">Select duration</option>
            <option value="30">30 mins</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </Field>
          <ErrorMessage name="slotDuration" component="p" className={err} />
        </div>

        <div>
          <label className="block mb-2 font-bold">Buffer Time</label>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Time gap between each slot.</p>
          <Field as="select" name="bufferTime" className={inputCls}>
            <option value="">Select buffer</option>
            <option value="0">No Buffer</option>
            <option value="15">15 mins</option>
            <option value="30">30 mins</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </Field>
          <ErrorMessage name="bufferTime" component="p" className={err} />
        </div>
      </div>

      {/* Pricing Type */}
      <div>
        <label className="block mb-4 font-bold">Pricing Type</label>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
            <Field type="radio" name="pricingType" value="fixedPricing" />
            Same Price All Day
          </label>
          <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
            <Field type="radio" name="pricingType" value="timeBasedPricing" />
            Time Based Pricing
          </label>
        </div>
        <ErrorMessage name="pricingType" component="p" className={err} />
      </div>

      {/* Same Price */}
      {pricingType === PRICING_TYPES.FIXED && (
        <div>
          <label className="block mb-2 font-bold">Price Per Slot (₹)</label>
          <Field name="samePrice" type="number" placeholder="1000" className={inputCls} />
          <ErrorMessage name="samePrice" component="p" className={err} />
        </div>
      )}

      {/* Time Based Pricing Rules */}
      {pricingType === PRICING_TYPES.TIME_BASED && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Pricing Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-bold">Base Price (₹)</label>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                This base price applies when time-based pricing is active.
              </p>
              <Field
                name="pricing.basePrice"
                type="number"
                placeholder="1000"
                className={inputCls + ' mt-2'}
              />
              <ErrorMessage name="pricing.basePrice" component="p" className={err} />
            </div>
          </div>
          {openTime && closeTime && (
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Times must be within working hours:{' '}
              <strong>
                {openTime} – {closeTime}
              </strong>
            </p>
          )}
          <FieldArray name="pricingRules">
            {({ push, remove }) => (
              <div className="space-y-5">
                {(pricingRules || []).map((_, index) => (
                  <div key={index} className="border border-[var(--bg-grey)] rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block mb-2 font-bold">From Time</label>
                        <Field
                          name={`pricingRules.${index}.fromTime`}
                          type="time"
                          {...(openTime ? { min: openTime } : {})}
                          {...(closeTime ? { max: closeTime } : {})}
                          className={inputCls}
                        />
                        <ErrorMessage
                          name={`pricingRules.${index}.fromTime`}
                          component="p"
                          className={err}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-bold">To Time</label>
                        <Field
                          name={`pricingRules.${index}.toTime`}
                          type="time"
                          {...(openTime ? { min: openTime } : {})}
                          {...(closeTime ? { max: closeTime } : {})}
                          className={inputCls}
                        />
                        <ErrorMessage
                          name={`pricingRules.${index}.toTime`}
                          component="p"
                          className={err}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-bold">Price (₹)</label>
                        <Field
                          name={`pricingRules.${index}.price`}
                          type="number"
                          placeholder="1000"
                          className={inputCls}
                        />
                        <ErrorMessage
                          name={`pricingRules.${index}.price`}
                          component="p"
                          className={err}
                        />
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 dark:text-red-400 mt-4 cursor-pointer"
                      >
                        Remove Rule
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push({ fromTime: '', toTime: '', price: '' })}
                  className="bg-[var(--bg-green)] text-white px-5 py-3 rounded-xl cursor-pointer"
                >
                  + Add Pricing Rule
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      )}

      {/* Blocked Times */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Blocked Time</h3>
        <p className="text-[var(--text-secondary)] mb-4">
          Add maintenance, lunch break or unavailable hours.
          {openTime && closeTime && (
            <>
              {' '}
              Times must be within{' '}
              <strong>
                {openTime} – {closeTime}
              </strong>
              .
            </>
          )}
        </p>
        <FieldArray name="blockedTimes">
          {({ push, remove }) => (
            <div className="space-y-5">
              {(blockedTimes || []).map((_, index) => (
                <div key={index} className="border border-[var(--bg-grey)] rounded-2xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-bold">From Time</label>
                      <Field
                        name={`blockedTimes.${index}.fromTime`}
                        type="time"
                        {...(openTime ? { min: openTime } : {})}
                        {...(closeTime ? { max: closeTime } : {})}
                        className={inputCls}
                      />
                      <ErrorMessage
                        name={`blockedTimes.${index}.fromTime`}
                        component="p"
                        className={err}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-bold">To Time</label>
                      <Field
                        name={`blockedTimes.${index}.toTime`}
                        type="time"
                        {...(openTime ? { min: openTime } : {})}
                        {...(closeTime ? { max: closeTime } : {})}
                        className={inputCls}
                      />
                      <ErrorMessage
                        name={`blockedTimes.${index}.toTime`}
                        component="p"
                        className={err}
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 dark:text-red-400 mt-4 cursor-pointer"
                    >
                      Remove Block
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => push({ fromTime: '', toTime: '' })}
                className="bg-[var(--bg-green)] text-white px-5 py-3 rounded-xl cursor-pointer"
              >
                + Add Blocked Time
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
}
