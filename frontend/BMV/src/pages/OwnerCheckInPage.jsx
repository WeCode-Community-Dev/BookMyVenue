import { useEffect, useRef, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import { verifyBookingCheckIn } from "../modules/venueOwner/services/venueOwnerService";
import { parseCheckInQrValue } from "../utils/checkInQr";

function OwnerCheckInPage() {
  const scannerRef = useRef(null);
  const verifyingRef = useRef(false);
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = useCallback(async (rawToken) => {
    if (verifyingRef.current) return;

    const token = parseCheckInQrValue(rawToken);
    if (!token) {
      setError("Invalid check-in code.");
      return;
    }

    verifyingRef.current = true;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await verifyBookingCheckIn(token);
      setResult(data);
    } catch (err) {
      setError(err.message || "Check-in failed.");
    } finally {
      setLoading(false);
      verifyingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "owner-check-in-scanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    scanner.render(
      (decodedText) => {
        handleVerify(decodedText);
      },
      () => {},
    );

    scannerRef.current = scanner;

    return () => {
      scanner
        .clear()
        .catch(() => {})
        .finally(() => {
          scannerRef.current = null;
        });
    };
  }, [handleVerify]);

  return (
    <OwnerLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Scan guest check-in</h1>
          <p className="text-sm text-slate-500 mt-1">
            Scan the customer&apos;s QR code to accommodate them at your venue.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 overflow-hidden">
          <div id="owner-check-in-scanner" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
          <p className="text-sm font-medium text-slate-700">Or enter code manually</p>
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Paste check-in token"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300/50"
          />
          <button
            type="button"
            disabled={loading || !manualToken.trim()}
            onClick={() => handleVerify(manualToken)}
            className="w-full rounded-xl bg-rose-900 text-white py-2.5 text-sm font-medium hover:bg-rose-950 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify check-in"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-3">{error}</p>
        )}

        {result && (
          <div
            className={`rounded-2xl border p-5 space-y-2 ${
              result.already_checked_in
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="font-semibold text-slate-800">{result.message}</p>
            <p className="text-sm text-slate-600">Guest: {result.guest_name}</p>
            <p className="text-sm text-slate-600">Venue: {result.venue_name}</p>
            {result.guest_count && (
              <p className="text-sm text-slate-600">Guests: {result.guest_count}</p>
            )}
            {result.event_type && (
              <p className="text-sm text-slate-600">Event: {result.event_type}</p>
            )}
            <p className="text-xs text-slate-400">
              Booking #{result.booking_id} ·{" "}
              {new Date(result.checked_in_at).toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}

export default OwnerCheckInPage;
