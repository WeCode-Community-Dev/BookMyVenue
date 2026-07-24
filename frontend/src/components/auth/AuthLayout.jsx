import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import bmvLogo from "../../assets/bmv-logo.jpeg";

const AuthLayout = ({
  brandingTitle,
  brandingSubtitle,
  brandingPoints = [],
  brandingAlign = "end",
  brandingImage = bmvLogo,
  brandingImagePosition = "center",
  children,
}) => {
  const brandingPositionClass =
    brandingAlign === "center" ? "justify-center" : "justify-end";

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:flex-row">
      <aside className="relative hidden overflow-hidden lg:block lg:w-[48%]">
        <img
          src={brandingImage}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          style={{ objectPosition: brandingImagePosition }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/55 to-gray-900/35"
          aria-hidden="true"
        />

        <div
          className={`relative z-10 flex h-full flex-col p-12 xl:px-20 xl:py-16 ${brandingPositionClass}`}
        >
          <div className="max-w-md">
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
            FIND YOUR SPACE
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
              {brandingTitle}
            </h2>
            {brandingSubtitle && (
              <p className="mt-4 text-base leading-relaxed text-white/85">
                {brandingSubtitle}
              </p>
            )}
            {brandingPoints.length > 0 && (
              <ul className="mt-8 space-y-3">
                {brandingPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Check className="h-3 w-3 text-white" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-1 flex-col lg:w-[52%]">
        <div className="px-4 py-5 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 underline-offset-2 transition-colors hover:text-gray-900 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-8 sm:pb-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
