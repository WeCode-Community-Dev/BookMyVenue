// format used inside the qr code so the owner scanner knows it is a booking check-in
export function buildCheckInQrValue(token) {
  return `BMV_CHECKIN:${token}`;
}

export function parseCheckInQrValue(raw) {
  const text = (raw || "").trim();
  if (text.startsWith("BMV_CHECKIN:")) {
    return text.slice("BMV_CHECKIN:".length);
  }
  return text;
}
