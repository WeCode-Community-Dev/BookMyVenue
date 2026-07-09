import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo, useEffect } from "react";
import { getVenue } from "@/server-adapters/venues.functions";
import {
  quoteBooking,
  createBookingHold,
  confirmBooking,
} from "@/server-adapters/bookings.functions";
import {
  listVenueReviews,
  canIReviewVenue,
  upsertMyReview,
  deleteMyReview,
} from "@/server-adapters/reviews.functions";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { StarRating } from "@/components/star-rating";
import { formatAddress, formatMoney } from "@/lib/format";
import { pricingUnitLabel, type PricingMode } from "@repo/domain/venues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/venues/$venueId")({
  head: ({ params }) => ({
    meta: [
      { title: `Venue — Book My Venue` },
      { name: "description", content: `Reserve this space on Book My Venue.` },
      { property: "og:title", content: `Venue — Book My Venue` },
    ],
    links: [{ rel: "canonical", href: `/venues/${params.venueId}` }],
  }),
  component: VenueDetailPage,
});

function defaultStart() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(18, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}
function defaultEnd() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(22, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function VenueDetailPage() {
  const { venueId } = Route.useParams();
  const navigate = useNavigate();

  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", venueId],
    queryFn: () => getVenue({ data: { id: venueId } }),
  });

  const [start, setStart] = useState(defaultStart());
  const [end, setEnd] = useState(defaultEnd());
  const [guests, setGuests] = useState<number>(50);
  const [coupon, setCoupon] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const startIso = useMemo(() => new Date(start).toISOString(), [start]);
  const endIso = useMemo(() => new Date(end).toISOString(), [end]);

  const quoteFn = useServerFn(quoteBooking);
  const { data: quote } = useQuery({
    queryKey: ["quote", venueId, startIso, endIso, coupon],
    queryFn: () =>
      quoteFn({
        data: {
          venue_id: venueId,
          start_time: startIso,
          end_time: endIso,
          guest_count: guests,
          coupon_code: coupon || undefined,
        },
      }).catch(() => null),
    enabled: !!venue && new Date(end) > new Date(start),
  });

  const holdFn = useServerFn(createBookingHold);
  const confirmFn = useServerFn(confirmBooking);

  const reserveMutation = useMutation({
    mutationFn: async () => {
      const sess = await authClient.getSession();
      if (!sess || !sess.data || !sess.data.session) {
        navigate({ to: "/login", search: { redirect: window.location.pathname } });
        throw new Error("auth-required");
      }
      const booking = await holdFn({
        data: {
          venue_id: venueId,
          start_time: startIso,
          end_time: endIso,
          guest_count: guests,
          coupon_code: coupon || undefined,
        },
      });
      // Mock booking — no external payment API is called.
      await confirmFn({ data: { booking_id: booking.id } });
      return booking;
    },
    onSuccess: (booking) => {
      toast.success("Booking confirmed");
      navigate({ to: "/account/bookings", search: { highlight: booking.id } });
    },
    onError: (e: Error) => {
      if (e.message !== "auth-required") toast.error(e.message);
    },
  });

  if (isLoading || !venue) {
    return (
      <div className="min-h-screen bg-surface">
        <SiteNav />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center text-lead/50">Loading…</div>
      </div>
    );
  }

  const gallery: string[] = Array.isArray(venue.gallery_urls)
    ? (venue.gallery_urls as unknown[]).filter((u): u is string => typeof u === "string")
    : [];
  const amenities: string[] = Array.isArray(venue.amenities)
    ? (venue.amenities as unknown[]).filter((a): a is string => typeof a === "string")
    : [];

  return (
    <div className="min-h-screen bg-surface text-lead">
      <SiteNav />

      <section className="py-12 bg-white ring-1 ring-black/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-4xl mb-3">{venue.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-lead/60 mb-8">
              <span>{formatAddress(venue.address_data)}</span>
              <span className="text-zinc-950/10">·</span>
              <span className="capitalize">{venue.venue_type}</span>
              <span className="text-zinc-950/10">·</span>
              <span>Up to {venue.capacity} guests</span>
              <ReviewSummary venueId={venueId} />
            </div>

            <div className="grid grid-cols-4 gap-3 mb-12">
              <div className="col-span-4 aspect-[16/9] bg-stone-100 rounded-[12px] overflow-hidden ring-1 ring-black/5">
                {(selectedImage ?? venue.cover_image_url) ? (
                  <img
                    src={selectedImage ?? venue.cover_image_url!}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs uppercase tracking-widest text-stone-400">
                    No image
                  </div>
                )}
              </div>
              {gallery.slice(0, 4).map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(url)}
                  className="aspect-square bg-stone-100 rounded-[12px] overflow-hidden ring-1 ring-black/5 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="max-w-[60ch]">
              <h2 className="text-xl font-medium mb-4">About this space</h2>
              <p className="text-lead/70 text-pretty mb-8 whitespace-pre-line">
                {venue.description || "An exceptional setting for your next event."}
              </p>
              {amenities.length > 0 && (
                <>
                  <h3 className="text-sm uppercase tracking-widest font-semibold text-lead/50 mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <span
                        key={a}
                        className="px-3 py-1 bg-stone-100 text-[12px] font-medium rounded-full ring-1 ring-black/5"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white ring-1 ring-black/10 rounded-[20px] p-6 shadow-xl shadow-zinc-950/5">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-2xl font-serif text-brand">
                  {formatMoney(venue.base_price_cents, venue.currency)}
                </span>
                <span className="text-sm text-lead/50">
                  {pricingUnitLabel((venue.pricing_mode ?? "per_hour") as PricingMode)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <Label
                    htmlFor="start"
                    className="text-[9px] uppercase tracking-wider text-lead/50 font-bold"
                  >
                    Start
                  </Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="end"
                    className="text-[9px] uppercase tracking-wider text-lead/50 font-bold"
                  >
                    End
                  </Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="guests"
                    className="text-[9px] uppercase tracking-wider text-lead/50 font-bold"
                  >
                    Guests
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={venue.capacity}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="coupon"
                    className="text-[9px] uppercase tracking-wider text-lead/50 font-bold"
                  >
                    Coupon code (optional)
                  </Label>
                  <Input
                    id="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="ATELIER10"
                  />
                </div>
              </div>

              {quote && (
                <div className="space-y-3 mb-6 border-t border-zinc-950/5 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-lead/60">
                      {quote.pricing_mode === "flat"
                        ? `Flat rate · ${quote.hours} hr`
                        : `${quote.units} ${quote.unit_label} × ${formatMoney(venue.base_price_cents, venue.currency)}`}
                    </span>
                    <span>{formatMoney(quote.subtotal_cents, quote.currency)}</span>
                  </div>
                  {quote.discount_amount_cents > 0 && (
                    <div className="flex justify-between text-brand">
                      <span>Coupon {quote.coupon?.code}</span>
                      <span>−{formatMoney(quote.discount_amount_cents, quote.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-3 border-t border-zinc-950/5">
                    <span>Total</span>
                    <span>{formatMoney(quote.total_cents, quote.currency)}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => reserveMutation.mutate()}
                disabled={reserveMutation.isPending || !quote}
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90 rounded-full py-6"
              >
                {reserveMutation.isPending ? "Reserving…" : "Reserve space"}
              </Button>
              <p className="text-[11px] text-lead/40 text-center mt-3">
                Soft-locked for 15 min while you confirm your reservation.
              </p>
              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800 text-center">
                <span className="font-semibold">Disclaimer:</span> This is a mock project — no real
                payment is processed.
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection venueId={venueId} />

      <SiteFooter />
    </div>
  );
}

function ReviewSummary({ venueId }: { venueId: string }) {
  const { data } = useQuery({
    queryKey: ["venue-reviews", venueId],
    queryFn: () => listVenueReviews({ data: { venueId } }),
  });
  if (!data || data.count === 0) return null;
  return (
    <>
      <span className="text-zinc-950/10">·</span>
      <span className="inline-flex items-center gap-1.5">
        <StarRating value={data.average} size={14} readOnly />
        <span className="font-medium text-lead">{data.average.toFixed(1)}</span>
        <span className="text-lead/50">({data.count})</span>
      </span>
    </>
  );
}

function ReviewsSection({ venueId }: { venueId: string }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const authed = !!session;

  const { data: reviewsData } = useQuery({
    queryKey: ["venue-reviews", venueId],
    queryFn: () => listVenueReviews({ data: { venueId } }),
  });

  const eligibilityFn = useServerFn(canIReviewVenue);
  const { data: eligibility } = useQuery({
    queryKey: ["venue-review-eligibility", venueId, authed],
    queryFn: () => eligibilityFn({ data: { venueId } }),
    enabled: authed === true,
  });

  const upsertFn = useServerFn(upsertMyReview);
  const deleteFn = useServerFn(deleteMyReview);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (eligibility?.existingReview) {
      setRating(eligibility.existingReview.rating);
      setFeedback(eligibility.existingReview.feedback ?? "");
    }
  }, [eligibility?.existingReview]);

  const submit = useMutation({
    mutationFn: () => upsertFn({ data: { venueId, rating, feedback: feedback || null } }),
    onSuccess: () => {
      toast.success("Review saved");
      qc.invalidateQueries({ queryKey: ["venue-reviews", venueId] });
      qc.invalidateQueries({ queryKey: ["venue-review-eligibility", venueId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => {
      if (!eligibility?.existingReview) throw new Error("no review");
      return deleteFn({ data: { reviewId: eligibility.existingReview.id } });
    },
    onSuccess: () => {
      setRating(0);
      setFeedback("");
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["venue-reviews", venueId] });
      qc.invalidateQueries({ queryKey: ["venue-review-eligibility", venueId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reviews = reviewsData?.reviews ?? [];

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl mb-2">Reviews</h2>
          {reviewsData && reviewsData.count > 0 ? (
            <div className="flex items-center gap-2 mb-8 text-sm text-lead/60">
              <StarRating value={reviewsData.average} readOnly size={16} />
              <span className="font-medium text-lead">{reviewsData.average.toFixed(1)}</span>
              <span>
                · {reviewsData.count} review{reviewsData.count > 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <p className="text-lead/50 text-sm mb-8">No reviews yet.</p>
          )}
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="bg-white ring-1 ring-black/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{r.reviewer_name}</span>
                  <span className="text-xs text-lead/40">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <StarRating value={r.rating} readOnly size={14} />
                {r.feedback && (
                  <p className="text-sm text-lead/70 mt-3 whitespace-pre-line">{r.feedback}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white ring-1 ring-black/10 rounded-[20px] p-6 shadow-xl shadow-zinc-950/5">
            <h3 className="font-serif text-xl mb-4">
              {eligibility?.existingReview ? "Update your review" : "Leave a review"}
            </h3>

            {authed === false && (
              <div className="space-y-3">
                <p className="text-sm text-lead/60">Sign in to leave a review for this venue.</p>
                <Button
                  onClick={() =>
                    navigate({ to: "/login", search: { redirect: window.location.pathname } })
                  }
                  className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Sign in
                </Button>
              </div>
            )}

            {authed === true && eligibility && !eligibility.eligible && (
              <div className="space-y-3">
                <p className="text-sm text-lead/60">
                  Only guests with a confirmed booking at this venue can leave a review.
                </p>
                <Link to="/account/bookings" className="text-sm text-brand hover:underline">
                  View your bookings →
                </Link>
              </div>
            )}

            {authed === true && eligibility?.eligible && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (rating < 1) {
                    toast.error("Please select a star rating");
                    return;
                  }
                  submit.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-[9px] uppercase tracking-wider text-lead/50 font-bold">
                    Rating
                  </Label>
                  <div className="mt-2">
                    <StarRating value={rating} onChange={setRating} size={28} />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="feedback"
                    className="text-[9px] uppercase tracking-wider text-lead/50 font-bold"
                  >
                    Feedback (optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    rows={4}
                    maxLength={2000}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience…"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submit.isPending}
                  className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {submit.isPending
                    ? "Saving…"
                    : eligibility.existingReview
                      ? "Update review"
                      : "Submit review"}
                </Button>
                {eligibility.existingReview && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate()}
                    className="w-full text-lead/60 hover:text-destructive"
                  >
                    Delete review
                  </Button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
