import { useFormikContext } from 'formik';
import { BOOKING_TYPES } from '@/constants/venueConstants';
import SlotPreviewPanel from './SlotPreviewPanel';
import { BookingTypeSection } from './BookingTypeSection';
import { FixedBookingSection } from './FixedBookingSection';
import { FlexibleBookingSection } from './FlexibleBookingSection';
import { AmenitiesSection } from './AmenitiesSection';

type BookingStepValues = {
  bookingType: string;
  pricingType: string;
  fixedPackages: {
    slotName: string;
    startTime: string;
    endTime: string;
    price: string;
  }[];
  workingDays: string[];
  workingHours: {
    open: string;
    close: string;
  };
  slotDuration: string;
  bufferTime: string;
  samePrice: string;
  pricingRules: {
    fromTime: string;
    toTime: string;
    price: string;
  }[];
  blockedTimes: {
    fromTime: string;
    toTime: string;
  }[];
  amenities: string[];
  pricing?: {
    basePrice?: string;
    pricingRules?: {
      fromTime: string;
      toTime: string;
      price: string;
    }[];
  };
};

const BookingStep = () => {
  const { values } = useFormikContext<BookingStepValues>();

  const openTime = values.workingHours?.open || undefined;
  const closeTime = values.workingHours?.close || undefined;

  return (
    <section className="font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="max-w-5xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[var(--bg-green)]">Booking Configuration</h2>
                <p className="text-[var(--text-secondary)] mt-2">
                  Configure booking, pricing and venue setup.
                </p>
              </div>

              <div className="bg-[var(--bg-tertiary)] rounded-3xl p-8 border border-[var(--bg-grey)] shadow-sm space-y-10">
                <BookingTypeSection />

                {values.bookingType === BOOKING_TYPES.FIXED && (
                  <FixedBookingSection fixedPackages={values.fixedPackages} />
                )}

                {values.bookingType === BOOKING_TYPES.FLEXIBLE && (
                  <FlexibleBookingSection
                    openTime={openTime}
                    closeTime={closeTime}
                    pricingType={values.pricingType}
                    pricingRules={values.pricing?.pricingRules ?? []}
                    blockedTimes={values.blockedTimes}
                  />
                )}

                <AmenitiesSection />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 lg:relative">
            <div className="lg:absolute lg:inset-0 w-full flex flex-col">
              <SlotPreviewPanel
                bookingType={values.bookingType as 'fixedBooking' | 'flexibleBooking'}
                workingDays={values.workingDays}
                workingHours={values.workingHours}
                fixedPackages={(values.fixedPackages || []).map((pkg) => ({
                  ...pkg,
                  price: parseFloat(pkg.price) || 0,
                }))}
                slotDuration={values.slotDuration}
                bufferTime={values.bufferTime}
                pricingType={values.pricingType}
                pricingRules={(values.pricing?.pricingRules ?? []).map((rule) => ({
                  ...rule,
                  price: parseFloat(rule.price) || 0,
                }))}
                blockedTimes={values.blockedTimes || []}
                samePrice={values.samePrice}
                basePrice={values.pricing?.basePrice}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingStep;
