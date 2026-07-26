import { Field, FieldArray, ErrorMessage } from 'formik';
import { FORM_ERROR_CLASS, FORM_INPUT_CLASS } from '@/constants/uiClasses';

const err = FORM_ERROR_CLASS;
const inputCls = FORM_INPUT_CLASS;

interface FixedBookingSectionProps {
  fixedPackages: { slotName: string; startTime: string; endTime: string; price: string }[];
}

export function FixedBookingSection({ fixedPackages }: FixedBookingSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Fixed Packages</h3>
      <FieldArray name="fixedPackages">
        {({ push, remove }) => (
          <div className="space-y-5">
            {(fixedPackages || []).map((_, index) => (
              <div key={index} className="border border-[var(--bg-grey)] rounded-2xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-bold">Slot Name</label>
                    <Field
                      name={`fixedPackages.${index}.slotName`}
                      type="text"
                      placeholder="e.g. Morning Package"
                      className={inputCls}
                    />
                    <ErrorMessage
                      name={`fixedPackages.${index}.slotName`}
                      component="p"
                      className={err}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-bold">Start Time</label>
                    <Field
                      name={`fixedPackages.${index}.startTime`}
                      type="time"
                      className={inputCls}
                    />
                    <ErrorMessage
                      name={`fixedPackages.${index}.startTime`}
                      component="p"
                      className={err}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-bold">End Time</label>
                    <Field
                      name={`fixedPackages.${index}.endTime`}
                      type="time"
                      className={inputCls}
                    />
                    <ErrorMessage
                      name={`fixedPackages.${index}.endTime`}
                      component="p"
                      className={err}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 font-bold">Price (₹)</label>
                    <Field
                      name={`fixedPackages.${index}.price`}
                      type="number"
                      placeholder="20000"
                      className={inputCls}
                    />
                    <ErrorMessage
                      name={`fixedPackages.${index}.price`}
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
                    Remove Package
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                push({
                  slotName: '',
                  startTime: '',
                  endTime: '',
                  price: '',
                })
              }
              className="bg-[var(--bg-green)] text-white px-5 py-3 rounded-xl cursor-pointer"
            >
              + Add Package
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
