import { QRCodeSVG } from "qrcode.react";
import { buildCheckInQrValue } from "../utils/checkInQr";

function BookingQrCode({ token, size = 180 }) {
  if (!token) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <QRCodeSVG value={buildCheckInQrValue(token)} size={size} level="M" />
      </div>
      <p className="text-xs text-slate-500 text-center max-w-xs">
        Show this QR code at the venue. The owner will scan it to check you in.
      </p>
    </div>
  );
}

export default BookingQrCode;
