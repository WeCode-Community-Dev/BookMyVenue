import type { ReactNode } from 'react';
import { FaCalendarCheck, FaShieldAlt, FaUsers } from 'react-icons/fa';
import bmvLogo from '@/assets/bmv-logo.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

const features = [
  {
    icon: <FaCalendarCheck />,
    title: 'Instant Booking',
    description: 'Reserve venues in just a few clicks.',
  },
  {
    icon: <FaUsers />,
    title: 'Trusted Hosts',
    description: 'Thousands of verified venue owners.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Secure Payments',
    description: 'Book confidently with protected transactions.',
  },
];

const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Background Blobs */}
      <div className="absolute left-[-140px] top-[-140px] h-80 w-80 rounded-full bg-[var(--bg-grey)]/30 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] h-96 w-96 rounded-full bg-[var(--bg-grey)]/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--bg-grey)]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-between px-6 py-10 lg:px-12">
        {/* Left Section */}
        <div className="hidden max-w-xl lg:block">
          <div className="mb-10">
            <img src={bmvLogo} alt="BookMyVenue" className="h-16 w-auto" />
          </div>

          <p className="mt-6 text-xl leading-8 text-[var(--text-secondary)]">
            Find and book the perfect venue for weddings, parties, corporate events and
            unforgettable celebrations.
          </p>

          <div className="mt-14 space-y-7">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-lg text-white shadow-md">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{feature.title}</h3>

                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg">
          <div className="rounded-[32px] border border-[var(--bg-grey)]/70 bg-[var(--bg-tertiary)]/80 p-8 shadow-2xl backdrop-blur-xl lg:p-10">
            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <img src={bmvLogo} alt="BookMyVenue" className="h-12 w-auto" />
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>

              <p className="mt-3 text-[var(--text-secondary)]">{subtitle}</p>
            </div>

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-8 border-t border-[var(--bg-grey)] pt-4 text-center text-sm text-[var(--text-secondary)]">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
