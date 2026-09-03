import { Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useImageUpload } from '@/hooks/useImageUpload';
import { queryClient } from '@/config/queryClient';
import Spinner from '@/components/common/Spinner';
import {
  createVenue,
  updateVenue,
  submitVenue,
  getVenueById,
  getMyDraft,
  upsertVenueDraft,
} from '@/services/venueService';
import { mapFormToDTO, mapVenueToForm } from '@/utils/venueFormMapper';
import {
  saveDraftSession,
  loadDraftSession,
  clearDraftSession,
  clearDraft,
} from '@/utils/venueDraft';
import type { AddVenueFormValues } from '@/types/venue.types';

import BasicInfoStep from './components/BasicInfoStep';
import { basicInfoSchema } from './components/BasicValidation';
import BookingStep from './components/middleStep';
import FinishStep from './components/FinishStep';
import { finishSchema } from './components/FinishValidation';
import { middleSchema } from './components/middleValidation';

const BLANK_FORM: AddVenueFormValues = {
  VenueName: '',
  VenueDescription: '',
  venueType: '',
  district: '',
  state: '',
  city: '',
  pincode: '',
  fullAddress: '',
  googleMapsLink: '',
  coordinates: null,
  spaceAttributes: [],
  seatingConfigurations: [],
  maxCapacity: '',
  bookingType: '',
  workingDays: [],
  fixedPackages: [{ slotName: '', startTime: '', endTime: '', price: 0 }],
  workingHours: { open: '', close: '' },
  flexibleBooking: { slotDuration: '', bufferTime: '' },
  pricing: {
    pricingType: '',
    basePrice: 0,
    pricingRules: [{ fromTime: '', toTime: '', price: 0 }],
  },
  blockedTimes: [{ fromTime: '', toTime: '', reason: '' }],
  amenities: [],
  venuePhotos: [],
  existingImages: {
    coverImage: '',
    galleryImages: [],
  },
  contact: { name: '', phone: '', email: '' },
  cancellation: {
    policy: '',
    refundType: '',
    refundRules: [{ daysBefore: '', refundPercentage: '' }],
  },
};

const STEP_LABELS = ['Basic Info', 'Booking', 'Final Details'];

const AddVenue = () => {
  const { venueId } = useParams<{ venueId?: string }>();
  const isEditMode = !!venueId;
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState<AddVenueFormValues>(BLANK_FORM);
  const [initializing, setInitializing] = useState(true);
  const [venueData, setVenueData] = useState<{
    _id: string;
    currentEditDeadline?: string;
    submissionCount?: number;
    status: string;
  } | null>(null);
  const [now, setNow] = useState(new Date());
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const { uploadFiles, isUploading } = useImageUpload();

  const stepSchemas = [basicInfoSchema, middleSchema, finishSchema];

  // Update now every minute for deadline calculations
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine if deadline has passed
  const isDeadlinePassed = venueData?.currentEditDeadline
    ? now > new Date(venueData.currentEditDeadline)
    : false;

  // Calculate days left
  const daysLeft =
    venueData?.currentEditDeadline && !isDeadlinePassed
      ? Math.max(
          0,
          Math.ceil(
            (new Date(venueData.currentEditDeadline).getTime() - now.getTime()) /
              (24 * 60 * 60 * 1000)
          )
        )
      : 0;

  // Load venue data for edit mode
  useEffect(() => {
    if (isEditMode && venueId) {
      const fetchVenue = async () => {
        try {
          const venue = await getVenueById(venueId);
          setVenueData({
            _id: venue._id,
            currentEditDeadline: venue.currentEditDeadline,
            submissionCount: venue.submissionCount,
            status: venue.status,
          });
          setFormValues(mapVenueToForm(venue));
          setInitializing(false);
        } catch (err) {
          console.error('Failed to load venue:', err);
          showError('Failed to load venue');
          setInitializing(false);
          navigate('/list-venue/my-venues');
        }
      };
      void fetchVenue();
    } else {
      // New venue mode - load draft
      const init = async () => {
        if (authLoading) return;
        if (!user?.id) {
          setInitializing(false);
          return;
        }

        const session = loadDraftSession(user.id);
        if (session && session.formValues) {
          console.log('Restoring draft from session:', session.formValues);
          setStep(session.step || 0);
          setFormValues({ ...BLANK_FORM, ...session.formValues });
          setInitializing(false);
          showSuccess('Draft retrieved, you can continue from here.');
          return;
        }

        try {
          const draft = await getMyDraft();
          console.log('Draft from API:', draft);
          if (draft && draft.formValues && Object.keys(draft.formValues).length > 0) {
            console.log('Restoring draft from API:', draft.formValues);
            const values = { ...BLANK_FORM, ...(draft.formValues as Partial<AddVenueFormValues>) };
            const resumeStep = typeof draft.step === 'number' ? draft.step : 0;

            setStep(resumeStep);
            setFormValues(values);
            saveDraftSession(user.id, { venueId: 'draft', step: resumeStep, formValues: values });
            showSuccess('Draft retrieved, you can continue from here.');
          }
        } catch (err) {
          console.error('Failed to get draft:', err);
        } finally {
          setInitializing(false);
        }
      };

      void init();
    }
  }, [venueId, isEditMode, user?.id, authLoading, showSuccess, showError, navigate]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="h-10 w-10" />
          <p className="text-[var(--text-secondary)] text-sm mt-3">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={formValues}
      enableReinitialize
      validationSchema={stepSchemas[step] || undefined}
      onSubmit={async (values, { setSubmitting }) => {
        if (!user?.id) {
          showError('User not authenticated. Please restart.');
          return;
        }
        try {
          setSubmitting(true);

          let newImageUrls: string[] = [];
          if (values.venuePhotos?.length > 0) {
            newImageUrls = await uploadFiles(values.venuePhotos);
          }

          const remainingExisting = [
            values.existingImages.coverImage,
            ...values.existingImages.galleryImages,
          ].filter(Boolean) as string[];

          const allImageUrls = [...remainingExisting, ...newImageUrls];
          const dto = mapFormToDTO(values, allImageUrls);

          if (isEditMode && venueId) {
            // Update existing venue
            await updateVenue(venueId, dto);
            // Then submit for review
            await submitVenue(venueId);

            clearDraftSession(user.id);
            clearDraft(user.id);
            showSuccess('Venue resubmitted for review successfully!');
          } else {
            // Create new venue
            await createVenue(dto);

            clearDraftSession(user.id);
            clearDraft(user.id);
            showSuccess('Venue submitted for review successfully!');
          }

          await queryClient.invalidateQueries({ queryKey: ['my-venues'] });
          navigate('/list-venue/my-venues');
        } catch (error) {
          console.error('Submission failed:', error);
          showError('Submission failed. Please try again.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ validateForm, setTouched, values, errors, isSubmitting, submitForm }) => {
        const hasErrors = Object.keys(errors).length > 0;

        const handleNext = async () => {
          if (isNavigating) return;
          setIsNavigating(true);
          try {
            const errs = await validateForm();
            const touchAll = (obj: Record<string, unknown>): Record<string, unknown> =>
              Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
                const val = obj[key];
                acc[key] =
                  val && typeof val === 'object' && !Array.isArray(val)
                    ? touchAll(val as Record<string, unknown>)
                    : Array.isArray(val)
                      ? (val as unknown[]).map((item) =>
                          item && typeof item === 'object'
                            ? touchAll(item as Record<string, unknown>)
                            : true
                        )
                      : true;
                return acc;
              }, {});

            if (Object.keys(errs).length > 0) {
              await setTouched(touchAll(errs) as never, false);
              return;
            }

            if (!user?.id) {
              showError('User not authenticated');
              return;
            }

            if (!isEditMode) {
              await upsertVenueDraft(step + 1, values);
              saveDraftSession(user.id, { venueId: 'draft', step: step + 1, formValues: values });
            }
            setStep((s) => s + 1);
          } catch (error) {
            console.error('Save failed:', error);
            showError('Failed to save progress. Please try again.');
          } finally {
            setIsNavigating(false);
          }
        };

        return (
          <Form className="pb-28">
            <div className="mb-6 flex gap-2 md:gap-3 items-center px-2 md:px-0 pt-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
              {STEP_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      i === step
                        ? 'bg-[var(--bg-green)] text-white'
                        : i < step
                          ? 'bg-[var(--bg-green)]/30 text-[var(--bg-green)]'
                          : 'border border-[var(--bg-grey)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      i === step ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {label}
                  </span>
                  {i < STEP_LABELS.length - 1 && (
                    <span className="ml-2 text-[var(--bg-grey)]">›</span>
                  )}
                </div>
              ))}
            </div>

            {/* Deadline banner for edit mode */}
            {isEditMode && venueData?.currentEditDeadline && (
              <div
                className={`mb-6 p-4 rounded-xl border ${
                  isDeadlinePassed
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-200'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isDeadlinePassed ? (
                    <svg
                      className="text-red-500 mt-0.5"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ) : (
                    <svg
                      className="text-amber-500 mt-0.5"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                  <div>
                    <p
                      className={`font-semibold ${isDeadlinePassed ? 'text-red-800' : 'text-amber-800'}`}
                    >
                      {isDeadlinePassed
                        ? 'Edit Window Expired'
                        : `⏰ ${daysLeft} day(s) left to resubmit`}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      Deadline:{' '}
                      {new Date(venueData.currentEditDeadline!).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      .
                      {isDeadlinePassed
                        ? ' This venue has been auto-suspended and cannot be resubmitted.'
                        : ' After this, the venue will be auto-suspended.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 0 && <BasicInfoStep />}
            {step === 1 && <BookingStep />}
            {step === 2 && <FinishStep />}

            <div className="fixed bottom-[4.5rem] md:bottom-0 left-0 md:left-72 right-0 bg-[var(--bg-tertiary)] border-t border-[var(--bg-grey)] px-4 md:px-8 py-3 md:py-4 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="border border-[var(--bg-grey)] px-6 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--bg-grey)]/30 transition-colors"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}

              {hasErrors && (
                <div className="text-center">
                  <p className="text-red-500 dark:text-red-400 text-sm font-semibold">
                    Please fix the errors before continuing
                  </p>
                  <p
                    className="text-red-400 text-xs mt-1 max-w-md truncate"
                    title={Object.keys(errors).join(', ')}
                  >
                    Errors in: {Object.keys(errors).join(', ')}
                  </p>
                </div>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={hasErrors || isSubmitting || isUploading || isNavigating}
                  className="bg-[var(--bg-green)] text-white px-6 py-2.5 rounded-xl transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isNavigating ? 'Saving…' : 'Next →'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submitForm()}
                  disabled={isSubmitting || isUploading || hasErrors || isDeadlinePassed}
                  className="bg-[var(--bg-green)] text-white px-6 py-2.5 rounded-xl transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting || isUploading
                    ? 'Submitting…'
                    : isEditMode
                      ? 'Resubmit for Review'
                      : 'Submit Venue'}
                </button>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddVenue;
