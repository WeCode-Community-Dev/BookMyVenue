import Image from "next/image";
import type { ReactNode } from "react";

const AUTH_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cmtFtqQDxCCb8cbolHEKsH-g0aC7KDk6A5mEbBqspfIdywH408161WwZfApMRXr1cvH_bD__hbY7IDRZbCsBaIJKS0UjHt2WlVhfSP3O5WVAQMopYHwvlIA0kKVKPRz-Z2WcCL-dbmb21d9whOM5d4jtpv4dUPNm60wC9FhjRLsCDf0iFGsyi2-HFz8vgQoVFSekqOLVKVOX-carvQz-nTvIr65N14u98FUm343L3KTP1tqF4uJ_flGGWFlSFvJVaMvti0HFhgq_";

const inputClassName =
  "auth-input px-4 placeholder:text-text-muted/50 focus:auth-input-focus";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <>
      <main className="flex min-h-screen overflow-hidden bg-background text-on-background antialiased">
        <section className="relative hidden overflow-hidden lg:block lg:w-1/2">
          <Image
            src={AUTH_HERO_IMAGE}
            alt="Luxury event venue with natural light and modern architecture"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-primary/10 mix-blend-multiply" />
          <div className="absolute right-12 bottom-12 left-12 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
            <p className="font-display text-headline-sm text-white">
              The world&apos;s most unique venues, at your fingertips.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="size-8 rounded-full border-2 border-white bg-stone-200" />
                <div className="size-8 rounded-full border-2 border-white bg-stone-300" />
                <div className="size-8 rounded-full border-2 border-white bg-stone-400" />
              </div>
              <span className="text-label-md text-white/90">
                Joined by 10k+ hosts worldwide
              </span>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-surface p-8 md:p-12 lg:w-1/2 lg:p-24">
          {children}
        </section>
      </main>

      <div className="pointer-events-none fixed top-0 right-0 -z-10 size-64 rounded-full bg-primary-container/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 left-1/2 -z-10 size-96 rounded-full bg-secondary-container/5 blur-[150px]" />
    </>
  );
}

function AuthBrand({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center space-y-6 lg:items-start">
      <div className="flex items-center gap-2">
        <span className="font-display text-headline-sm font-bold text-on-surface">
          BookMy<span className="text-primary-container">Venue</span>
        </span>
      </div>
      <div className="text-center lg:text-left">
        <h1 className="mb-2 text-headline-md text-on-surface">{title}</h1>
        <p className="text-body-md text-text-muted">{description}</p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthDivider() {
  return (
    <div className="relative flex items-center py-2">
      <div className="grow border-t border-border-subtle" />
      <span className="mx-4 shrink-0 text-label-sm tracking-wider text-text-muted uppercase">
        Or continue with
      </span>
      <div className="grow border-t border-border-subtle" />
    </div>
  );
}

export {
  AuthSplitLayout,
  AuthBrand,
  GoogleIcon,
  AuthDivider,
  inputClassName,
  AUTH_HERO_IMAGE,
};
