import { InfoPageLayout, InfoSection } from '../components/shared/InfoPageLayout'

const SECTIONS = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'booking-requests', label: 'Booking Requests' },
  { id: 'confirmation-conflicts', label: 'Confirmation and Conflicts' },
  { id: 'cancellations', label: 'Cancellations' },
  { id: 'owner-responsibilities', label: 'Venue Owner Responsibilities' },
  { id: 'account-suspension', label: 'Account Suspension' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'contact-us', label: 'Contact Us' },
]

export default function TermsOfService() {
  return (
    <InfoPageLayout title="Terms of Service" subtitle="Last updated July 2026" sections={SECTIONS}>
      <InfoSection id="acceptance" heading="Acceptance of Terms">
        <p>
          By creating an account or booking a venue through Venue404, you agree to these
          Terms of Service.
        </p>
      </InfoSection>

      <InfoSection id="booking-requests" heading="Booking Requests">
        <p>
          Requesting a slot does not reserve it. A venue owner may accept your request, which
          starts a 24-hour hold during which you must pay a token advance to confirm your
          booking. If payment is not completed within 24 hours, the hold expires and the owner
          may accept another request for the same slot.
        </p>
      </InfoSection>

      <InfoSection id="confirmation-conflicts" heading="Confirmation and Conflicts">
        <p>
          Only one confirmed booking may exist for a given slot. Once a booking is confirmed
          by successful payment, all other competing requests for that slot are automatically
          canceled.
        </p>
      </InfoSection>

      <InfoSection id="cancellations" heading="Cancellations">
        <p>
          If you cancel a confirmed booking, the slot may become available again to other
          eligible requesters. If a venue owner cancels a confirmed booking, you will receive a
          full refund of your advance and any remaining payment made.
        </p>
      </InfoSection>

      <InfoSection id="owner-responsibilities" heading="Venue Owner Responsibilities">
        <p>
          Venues listed on Venue404 are reviewed before becoming publicly visible. Owners are
          responsible for keeping listing information, availability, and pricing accurate.
        </p>
      </InfoSection>

      <InfoSection id="account-suspension" heading="Account Suspension">
        <p>
          We may suspend accounts that violate these terms, engage in fraudulent activity, or
          abuse the booking system.
        </p>
      </InfoSection>

      <InfoSection id="liability" heading="Limitation of Liability">
        <p>
          Venue404 facilitates connections between customers and venue owners but is not a
          party to the underlying venue rental agreement.
        </p>
      </InfoSection>

      <InfoSection id="contact-us" heading="Contact Us">
        <p>
          Questions about these terms can be sent to{' '}
          <a
            href="mailto:venue404.support@gmail.com"
            className="text-brand hover:underline dark:text-brand-secondary"
          >
            venue404.support@gmail.com
          </a>
          .
        </p>
      </InfoSection>
    </InfoPageLayout>
  )
}
