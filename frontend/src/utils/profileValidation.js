const FULL_NAME_MIN_LENGTH = 2
const FULL_NAME_MAX_LENGTH = 255
const FULL_NAME_PATTERN = /^[a-zA-Z]+(?:[ '.-][a-zA-Z]+)*$/

function normalizeFullName(value) {
  return value.trim().replace(/\s+/g, " ")
}

function normalizePhone(value) {
  let digits = value.replace(/\D/g, "")

  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2)
  }

  return digits
}

export function validateProfileName(value) {
  const name = normalizeFullName(value)

  if (!name) {
    return "Full name is required."
  }

  if (name.length < FULL_NAME_MIN_LENGTH) {
    return "Full name must be at least 2 characters."
  }

  if (name.length > FULL_NAME_MAX_LENGTH) {
    return "Full name must be at most 255 characters."
  }

  if (!FULL_NAME_PATTERN.test(name)) {
    return "Full name can only contain letters, spaces, hyphens, apostrophes, and periods."
  }

  return ""
}

export function validateProfilePhone(value) {
  const phone = value.trim()

  if (!phone) {
    return "Phone number is required."
  }

  const digits = normalizePhone(phone)

  if (digits.length !== 10) {
    return "Enter a valid 10-digit Indian mobile number."
  }

  if (!/^[6789]/.test(digits)) {
    return "Indian mobile numbers must start with 6, 7, 8, or 9."
  }

  return ""
}

export function normalizeProfileName(value) {
  return normalizeFullName(value)
}

export function normalizeProfilePhone(value) {
  return normalizePhone(value)
}
