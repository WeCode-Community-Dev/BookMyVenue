import { InfoPageLayout, InfoSection } from '../components/shared/InfoPageLayout'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use-it', label: 'How We Use Your Information' },
  { id: 'payment-information', label: 'Payment Information' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'contact-us', label: 'Contact Us' },
]

export default function PrivacyPolicy() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Last updated July 2026" sections={SECTIONS}>
      <InfoSection id="overview" heading="Overview">
        <p>
          This Privacy Policy explains how Venue404 ("we", "us") collects, uses, and protects
          your information when you use our venue discovery and booking marketplace.
        </p>
      </InfoSection>

      <InfoSection id="information-we-collect" heading="Information We Collect">
        <p>
          When you create an account, we collect your name, email address, and phone number
          through our authentication provider. When you book a venue, we collect booking
          details, payment confirmation records, and communications with venue owners.
        </p>
      </InfoSection>

      <InfoSection id="how-we-use-it" heading="How We Use Your Information">
        <p>
          We use your information to process bookings, facilitate payments, send booking and
          account notifications, and provide customer support. We do not sell your personal
          information to third parties.
        </p>
      </InfoSection>

      <InfoSection id="payment-information" heading="Payment Information">
        <p>
          Payments are processed by our payment provider. Venue404 does not store your full
          card details on our servers.
        </p>
      </InfoSection>

      <InfoSection id="data-retention" heading="Data Retention">
        <p>
          We retain account and booking records for as long as your account is active and as
          required to meet legal, accounting, or dispute-resolution obligations.
        </p>
      </InfoSection>

      <InfoSection id="your-rights" heading="Your Rights">
        <p>
          You may access, update, or request deletion of your personal information from your{' '}
          <a href="/profile" className="text-brand hover:underline dark:text-brand-secondary">
            Profile
          </a>{' '}
          page, or by contacting us.
        </p>
      </InfoSection>

      <InfoSection id="contact-us" heading="Contact Us">
        <p>
          Questions about this policy can be sent to{' '}
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
