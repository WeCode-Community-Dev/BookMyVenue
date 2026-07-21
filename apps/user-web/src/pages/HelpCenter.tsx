import { InfoPageLayout, InfoSection } from '../components/shared/InfoPageLayout'

const SECTIONS = [
  { id: 'how-booking-works', label: 'How does booking work?' },
  { id: 'missed-payment', label: "Didn't pay in time?" },
  { id: 'cancel-booking', label: 'Cancel a booking' },
  { id: 'owner-cancels', label: 'Owner cancels' },
  { id: 'list-venue', label: 'List your venue' },
  { id: 'still-need-help', label: 'Still need help?' },
]

export default function HelpCenter() {
  return (
    <InfoPageLayout
      title="Help Center"
      subtitle="Answers to common questions about booking and hosting on Venue404."
      sections={SECTIONS}
    >
      <InfoSection id="how-booking-works" heading="How does booking a venue work?">
        <p>
          You send a booking request for a slot. If the venue owner accepts, you have 24 hours
          to pay a token advance to confirm the booking. Requesting a slot does not reserve it
          until payment is confirmed.
        </p>
      </InfoSection>

      <InfoSection id="missed-payment" heading="What happens if I don't pay within 24 hours?">
        <p>
          Your accepted request expires and the slot becomes available for the owner to accept
          another request.
        </p>
      </InfoSection>

      <InfoSection id="cancel-booking" heading="Can I cancel a confirmed booking?">
        <p>
          Yes, from the{' '}
          <a href="/my-bookings" className="text-brand hover:underline dark:text-brand-secondary">
            My Bookings
          </a>{' '}
          page. Cancellation terms vary by venue.
        </p>
      </InfoSection>

      <InfoSection id="owner-cancels" heading="What if the venue owner cancels my booking?">
        <p>You'll receive a full refund of your advance and any remaining payment made.</p>
      </InfoSection>

      <InfoSection id="list-venue" heading="How do I list my venue?">
        <p>
          Create an account and add your first venue from the owner portal. Listings are
          reviewed before they appear in public search.
        </p>
      </InfoSection>

      <InfoSection id="still-need-help" heading="Still need help?">
        <p>
          Reach our team through the{' '}
          <a href="/contact" className="text-brand hover:underline dark:text-brand-secondary">
            Contact Us
          </a>{' '}
          page, or email{' '}
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
