import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from '@/constants/upload';
import { FORM_ERROR_CLASS } from '@/constants/uiClasses';
import { CANCELLATION_POLICIES, REFUND_TYPES } from '@/constants/bookingConstants';

type FinishStepValues = {
  contact: { name: string; phone: string; email?: string };
  cancellation: {
    policy: string;
    refundType: string;
    refundRules: { daysBefore: string; refundPercentage: string }[];
  };
  venuePhotos: File[];
  existingImages: {
    coverImage: string;
    galleryImages: string[];
  };
};

const err = FORM_ERROR_CLASS;

const FinishStep = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { values, setFieldValue } = useFormikContext<FinishStepValues>();
  const { error: showError } = useToast();

  useEffect(() => {
    const urls = values.venuePhotos?.map((file) => URL.createObjectURL(file)) || [];
    setPreviewImages(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [values.venuePhotos]);

  const existingCover = values.existingImages?.coverImage || '';
  const existingGallery = values.existingImages?.galleryImages || [];

  const allDisplayItems: Array<
    { type: 'existing'; url: string } | { type: 'new'; url: string; index: number }
  > = [
    ...(existingCover ? [{ type: 'existing' as const, url: existingCover }] : []),
    ...existingGallery.map((url) => ({ type: 'existing' as const, url })),
    ...previewImages.map((url, i) => ({ type: 'new' as const, url, index: i })),
  ];

  const hasImages = allDisplayItems.length > 0;

  return (
    <section className="font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--bg-green)]">Final Details</h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Upload photos and configure final venue settings.
          </p>
        </div>

        <div className="bg-[var(--bg-tertiary)] rounded-3xl p-8 border border-[var(--bg-grey)] shadow-sm space-y-10">
          {/* Photos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Venue Photos</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Upload venue images. First image becomes cover photo.
            </p>

            {/* Combined Grid — existing images + new upload previews */}
            {hasImages && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {allDisplayItems.map((item, index) => (
                  <div
                    key={item.type === 'existing' ? item.url : `new-${item.index}`}
                    className={`relative rounded-2xl overflow-hidden border-2 ${
                      index === 0 ? 'border-[var(--bg-green)]' : 'border-[var(--bg-grey)]'
                    }`}
                  >
                    <img src={item.url} alt="" className="w-full h-40 object-cover" />

                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-[var(--bg-green)] text-white text-xs px-2 py-1 rounded-lg">
                        Cover
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (item.type === 'existing') {
                          if (item.url === existingCover) {
                            setFieldValue('existingImages.coverImage', '');
                          } else {
                            setFieldValue(
                              'existingImages.galleryImages',
                              existingGallery.filter((u) => u !== item.url)
                            );
                          }
                        } else {
                          const newFiles = [...(values.venuePhotos || [])];
                          newFiles.splice(item.index, 1);
                          setFieldValue('venuePhotos', newFiles);
                        }
                      }}
                      className="absolute top-2 right-2 bg-white/90 w-8 h-8 rounded-full shadow flex items-center justify-center text-red-500 hover:bg-white transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <label className="flex items-center justify-center w-full border-2 border-dashed border-[var(--bg-grey)] rounded-2xl p-8 cursor-pointer hover:border-[var(--bg-green)] transition">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const validFiles = files.filter((file) => {
                    if (
                      !ALLOWED_IMAGE_TYPES.includes(
                        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
                      )
                    ) {
                      showError(
                        `Invalid file type: ${file.name}. Only JPG, PNG and WEBP are allowed.`
                      );
                      return false;
                    }
                    if (file.size > MAX_IMAGE_FILE_SIZE) {
                      showError(`File too large: ${file.name}. Maximum size is 5MB.`);
                      return false;
                    }
                    return true;
                  });
                  if (validFiles.length > 0) {
                    const currentFiles = values.venuePhotos || [];
                    setFieldValue('venuePhotos', [...currentFiles, ...validFiles]);
                  }
                  e.target.value = '';
                }}
              />
              <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)]">Click to Upload Images</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  JPG, PNG, WEBP · Max 5MB each
                </p>
              </div>
            </label>

            <ErrorMessage name="venuePhotos" component="p" className={err} />

            {previewImages.length > 0 && (
              <p className="mt-4 text-sm text-[var(--bg-green)] font-medium">
                {previewImages.length} new image(s) selected
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold">Contact Name</label>
                <Field
                  name="contact.name"
                  type="text"
                  placeholder="Contact Name"
                  className="w-full rounded-xl border border-[var(--bg-grey)] px-4 py-3 outline-none focus:border-[var(--bg-green)]"
                />
                <ErrorMessage name="contact.name" component="p" className={err} />
              </div>
              <div>
                <label className="block mb-2 font-bold">Phone Number</label>
                <Field
                  name="contact.phone"
                  type="text"
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-[var(--bg-grey)] px-4 py-3 outline-none focus:border-[var(--bg-green)]"
                />
                <ErrorMessage name="contact.phone" component="p" className={err} />
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Cancellation Policy</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
                <Field type="radio" name="cancellation.policy" value="refundable" />
                Refundable
              </label>
              <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
                <Field type="radio" name="cancellation.policy" value="nonRefundable" />
                Non Refundable
              </label>
            </div>
            <ErrorMessage name="cancellation.policy" component="p" className={err} />
          </div>

          {/* Refund Rules — only for refundable */}
          {values.cancellation.policy === CANCELLATION_POLICIES.REFUNDABLE && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Refund Rules</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Configure refund percentage based on cancellation time.
              </p>

              {/* Refund Type */}
              <div className="mb-6">
                <label className="block mb-2 font-bold">Refund Type</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
                    <Field type="radio" name="cancellation.refundType" value="fullRefund" />
                    Full Refund
                  </label>
                  <label className="flex items-center gap-2 border border-[var(--bg-grey)] rounded-xl px-4 py-3 cursor-pointer">
                    <Field type="radio" name="cancellation.refundType" value="timeBasedRefund" />
                    Time Based
                  </label>
                </div>
                <ErrorMessage name="cancellation.refundType" component="p" className={err} />
              </div>

              {/* Refund Rules — only for time based */}
              {values.cancellation.refundType === REFUND_TYPES.TIME_BASED && (
                <FieldArray name="cancellation.refundRules">
                  {({ push, remove }) => (
                    <div className="space-y-5">
                      {values.cancellation.refundRules.map((_, index) => (
                        <div key={index} className="border border-[var(--bg-grey)] rounded-2xl p-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block mb-2 font-bold">Days Before</label>
                              <Field
                                name={`cancellation.refundRules.${index}.daysBefore`}
                                type="number"
                                placeholder="7"
                                className="w-full rounded-xl border border-[var(--bg-grey)] px-4 py-3"
                              />
                              <ErrorMessage
                                name={`cancellation.refundRules.${index}.daysBefore`}
                                component="p"
                                className={err}
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-bold">Refund %</label>
                              <Field
                                name={`cancellation.refundRules.${index}.refundPercentage`}
                                type="number"
                                placeholder="90"
                                className="w-full rounded-xl border border-[var(--bg-grey)] px-4 py-3"
                              />
                              <ErrorMessage
                                name={`cancellation.refundRules.${index}.refundPercentage`}
                                component="p"
                                className={err}
                              />
                            </div>
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 dark:text-red-400 mt-4"
                            >
                              Remove Rule
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => push({ daysBefore: '', refundPercentage: '' })}
                        className="bg-[var(--bg-green)] text-white px-5 py-3 rounded-xl"
                      >
                        + Add Rule
                      </button>
                    </div>
                  )}
                </FieldArray>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinishStep;
