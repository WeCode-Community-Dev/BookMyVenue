import { describe, it, expect } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { Formik } from 'formik';
import { FlexibleBookingSection } from '@/pages/listVenue/addVenue/components/FlexibleBookingSection';

const initialValues = {
  workingHours: { open: '09:00', close: '18:00' },
  pricingType: 'timeBasedPricing',
  pricing: {
    pricingType: 'timeBasedPricing',
    basePrice: '500',
    pricingRules: [{ fromTime: '', toTime: '', price: '' }],
  },
};

function setup() {
  let latestValues: typeof initialValues | undefined;
  const view = render(
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => {
        latestValues = values;
        return (
          <FlexibleBookingSection
            openTime="09:00"
            closeTime="18:00"
            pricingType={values.pricingType}
            pricingRules={values.pricing.pricingRules}
            blockedTimes={[]}
          />
        );
      }}
    </Formik>
  );
  return {
    container: view.container,
    getValues: () => latestValues,
  };
}

describe('FlexibleBookingSection pricing rules', () => {
  it('writes pricing rule inputs into pricing.pricingRules (server contract)', () => {
    const { container, getValues } = setup();

    const fromInput = container.querySelector('input[name$=".fromTime"]') as HTMLInputElement;
    const toInput = container.querySelector('input[name$=".toTime"]') as HTMLInputElement;
    const priceInput = container.querySelector('input[name$=".price"]') as HTMLInputElement;

    expect(fromInput).toBeTruthy();
    expect(toInput).toBeTruthy();
    expect(priceInput).toBeTruthy();

    act(() => {
      fireEvent.change(fromInput, { target: { value: '10:00' } });
      fireEvent.change(toInput, { target: { value: '12:00' } });
      fireEvent.change(priceInput, { target: { value: '500' } });
    });

    expect(getValues()?.pricing?.pricingRules?.[0]).toMatchObject({
      fromTime: '10:00',
      toTime: '12:00',
    });
    expect(Number(getValues()?.pricing?.pricingRules?.[0]?.price)).toBe(500);
  });
});
