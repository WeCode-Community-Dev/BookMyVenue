import * as Yup from 'yup';

// HH:MM → total minutes since midnight for easy comparison
const toMinutes = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const middleSchema = Yup.object({
  bookingType: Yup.string().required('Select booking type'),

  /*  Working Days */
  workingDays: Yup.array().min(1, 'Select at least one working day'),

  /* Fixed Booking */
  fixedPackages: Yup.array().when('bookingType', {
    is: 'fixedBooking',
    then: () =>
      Yup.array()
        .min(1, 'Add at least one package')
        .of(
          Yup.object({
            slotName: Yup.string().trim().required('Slot name required'),
            startTime: Yup.string().required('Start time required'),
            endTime: Yup.string().required('End time required'),
            price: Yup.number()
              .typeError('Enter valid price')
              .required('Price required')
              .positive('Must be positive'),
          }).test('fixed-pkg-times', 'End time must be after start time', function (value) {
            const { startTime, toTime } = value as {
              startTime?: string;
              toTime?: string;
            };
            if (startTime && toTime && toMinutes(toTime) <= toMinutes(startTime)) {
              return this.createError({
                path: `${this.path}.endTime`,
                message: 'End time must be after start time',
              });
            }
            return true;
          })
        ),
    otherwise: () => Yup.array(),
  }),

  /* Flexible Booking */
  workingHours: Yup.object().when('bookingType', {
    is: 'flexibleBooking',
    then: () =>
      Yup.object({
        open: Yup.string().required('Open time required'),
        close: Yup.string().required('Close time required'),
      }).test('open-before-close', 'Close time must be after open time', function (value) {
        const { open, close } = value as { open?: string; close?: string };
        if (open && close && toMinutes(close) <= toMinutes(open)) {
          return this.createError({
            path: `${this.path}.close`,
            message: 'Close time must be after open time',
          });
        }
        return true;
      }),
    otherwise: () => Yup.object(),
  }),

  slotDuration: Yup.string().when('bookingType', {
    is: 'flexibleBooking',
    then: (schema) => schema.required('Select slot duration'),
  }),

  bufferTime: Yup.string().when('bookingType', {
    is: 'flexibleBooking',
    then: (schema) => schema.required('Select buffer time'),
  }),

  pricingType: Yup.string().when('bookingType', {
    is: 'flexibleBooking',
    then: (schema) => schema.required('Select pricing type'),
  }),

  pricing: Yup.object().when('pricingType', {
    is: 'timeBasedPricing',
    then: () =>
      Yup.object({
        basePrice: Yup.number()
          .typeError('Enter valid base price')
          .required('Enter base price')
          .positive('Must be positive'),
        pricingRules: Yup.array()
          .min(1, 'Add at least one pricing rule')
          .of(
            Yup.object({
              fromTime: Yup.string().required('Required'),
              toTime: Yup.string().required('Required'),
              price: Yup.number()
                .typeError('Enter valid price')
                .required('Required')
                .positive('Must be positive'),
            }).test('pricing-rule-times', 'Invalid pricing rule times', function (value) {
              const { fromTime, toTime } = value as {
                fromTime?: string;
                toTime?: string;
              };

              // toTime must be after fromTime
              if (fromTime && toTime && toMinutes(toTime) <= toMinutes(fromTime)) {
                return this.createError({
                  path: `${this.path}.toTime`,
                  message: 'To time must be after from time',
                });
              }

              // Times must stay within workingHours — read from the root form value.
              // `this.from` is ordered [current, ...parent chain], so the last entry is the root.
              const root = (
                this as unknown as {
                  from?: { value?: { workingHours?: { open?: string; close?: string } } }[];
                }
              ).from?.at(-1)?.value;
              const open = root?.workingHours?.open;
              const close = root?.workingHours?.close;

              if (open && close) {
                if (fromTime && toMinutes(fromTime) < toMinutes(open)) {
                  return this.createError({
                    path: `${this.path}.fromTime`,
                    message: `Must be on or after open time (${open})`,
                  });
                }
                if (toTime && toMinutes(toTime) > toMinutes(close)) {
                  return this.createError({
                    path: `${this.path}.toTime`,
                    message: `Must be on or before close time (${close})`,
                  });
                }
              }
              return true;
            })
          ),
      }).required('Base price is required'),
    otherwise: () => Yup.object(),
  }),

  /* Same Price */
  samePrice: Yup.string().when('pricingType', {
    is: 'fixedPricing',
    then: (schema) => schema.required('Enter slot price'),
  }),

  /*
   * blockedTimes — optional rows, but if filled they must stay within workingHours.
   * Object-level test to avoid fromTime ↔ toTime cyclic dependency.
   */
  blockedTimes: Yup.array().when('bookingType', {
    is: 'flexibleBooking',
    then: () =>
      Yup.array().of(
        Yup.object({
          fromTime: Yup.string(),
          toTime: Yup.string(),
        }).test(
          'blocked-times-pair-and-range',
          'Both From Time and To Time are required together and must stay within working hours',
          function (value) {
            const { fromTime, toTime } = value as {
              fromTime?: string;
              toTime?: string;
            };

            // Pair check
            if (fromTime && !toTime) {
              return this.createError({
                path: `${this.path}.toTime`,
                message: 'To time required',
              });
            }
            if (!fromTime && toTime) {
              return this.createError({
                path: `${this.path}.fromTime`,
                message: 'From time required',
              });
            }

            // If both filled — validate order and bounds
            if (fromTime && toTime) {
              if (toMinutes(toTime) <= toMinutes(fromTime)) {
                return this.createError({
                  path: `${this.path}.toTime`,
                  message: 'To time must be after from time',
                });
              }

              // Walk up the form tree to get workingHours
              const formValues = (
                this as unknown as {
                  from?: {
                    value: { workingHours?: { open?: string; close?: string } };
                  }[];
                }
              ).from;
              const open = formValues?.[1]?.value?.workingHours?.open;
              const close = formValues?.[1]?.value?.workingHours?.close;

              if (open && close) {
                if (toMinutes(fromTime) < toMinutes(open)) {
                  return this.createError({
                    path: `${this.path}.fromTime`,
                    message: `Must be on or after open time (${open})`,
                  });
                }
                if (toMinutes(toTime) > toMinutes(close)) {
                  return this.createError({
                    path: `${this.path}.toTime`,
                    message: `Must be on or before close time (${close})`,
                  });
                }
              }
            }

            return true;
          }
        )
      ),
    otherwise: () => Yup.array(),
  }),

  /* Amenities */
  amenities: Yup.array().min(1, 'Select at least one amenity'),
});
