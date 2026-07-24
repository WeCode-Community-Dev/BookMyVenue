import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { becomeProvider } from "../../services/authService";
import BecomeHostModal from "../provider/onboarding/BecomeHostModal";
import providerCtaImage from "../../assets/hero/hero-venue-1.jpg";

const ProviderCTA = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    authReady,
    isProvider,
    syncUserAfterBecomeProvider,
  } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = () => {
    if (!user) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    if (isProvider) {
      navigate("/provider/dashboard");
      return;
    }

    setError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (upgrading) return;
    setModalOpen(false);
    setError("");
  };

  const handleConfirmBecomeHost = async () => {
    if (upgrading || isProvider) return;

    try {
      setUpgrading(true);
      setError("");

      const data = await becomeProvider();

      if (!data.success) {
        throw new Error(data.message || "Failed to upgrade to provider.");
      }

      const roles = await syncUserAfterBecomeProvider(data.roles);

      if (!roles?.includes("provider")) {
        throw new Error(
          "Provider upgrade could not be confirmed. Please refresh and try again."
        );
      }

      setModalOpen(false);
      toast.success(data.message || "You are now a provider!");
      navigate("/provider/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to become a provider. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setUpgrading(false);
    }
  };

  const buttonLabel = isProvider
    ? "Go to Provider Dashboard"
    : "Host a Venue";

  const heading = isProvider ? "Manage your venues" : "Are you a venue owner?";
  const subheading = isProvider
    ? "Access your Provider Dashboard"
    : "List your venues";
  const description = isProvider
    ? "Update listings, manage availability, and track reservations across your venues from one place."
    : "List your space on Book My Venue, manage availability, accept bookings, and track reservations from your provider dashboard, all in one place.";

  return (
    <>
      <section id="provider-cta" className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-red-50/90 via-stone-50 to-white p-6 shadow-sm ring-1 ring-red-100/60 sm:rounded-3xl sm:p-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:p-10 xl:p-12">
            <div className="text-left">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[2rem]">
                {heading}
              </h2>

              <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
                {subheading}
              </p>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
                {description}
              </p>

              {!loading && authReady && (
                <button
                  type="button"
                  onClick={handleClick}
                  className="group mt-7 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-red-600/25 ring-1 ring-red-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:px-9 sm:text-base"
                >
                  {buttonLabel}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              )}

              {error && !modalOpen && (
                <p className="mt-4 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              {!loading && authReady && user && !isProvider && !error && (
                <p className="mt-4 text-sm text-gray-500">
                  Start hosting your venue and manage bookings from your provider
                  dashboard.
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center lg:mt-0 lg:justify-end">
              <div className="w-full max-w-[18rem] overflow-hidden rounded-2xl bg-white/60 p-2 shadow-sm ring-1 ring-red-100/50 sm:max-w-xs lg:max-w-sm">
                <img
                  src={providerCtaImage}
                  alt="Venue owner listing a space"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalOpen ? (
        <BecomeHostModal
          open
        onClose={handleCloseModal}
        onConfirm={handleConfirmBecomeHost}
        isLoading={upgrading}
        error={error}
        />
      ) : null}
    </>
  );
};

export default ProviderCTA;
